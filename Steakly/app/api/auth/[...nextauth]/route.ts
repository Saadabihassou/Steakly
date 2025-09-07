import NextAuth, { Session } from "next-auth";
import GithubProvider from "next-auth/providers/github";
import { connectDB } from "@/lib/mongodb";
import User from "@/models/User";

export const authOptions = {
  providers: [
    GithubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({
      user,
    }: {
      user: {
        name?: string | null;
        email?: string | null;
        image?: string | null;
      };
    }) {
      // Connect DB
      await connectDB();

      // Check if user already exists
      const existingUser = await User.findOne({ email: user.email });

      if (!existingUser) {
        // Create new user document
        await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }

      return true;
    },
    async session({ session }: { session: Session }) {
      if (!session?.user?.email) return session;

      await connectDB();

      // Get the MongoDB user
      const dbUser = await User.findOne({ email: session.user.email });

      if (dbUser) {
        (session.user as any).id = dbUser._id.toString();
      }

      return session;
    },
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
