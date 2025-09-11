// utils/email.ts
import emailjs from "@emailjs/browser";

export const sendEmailForNewHabit = async (
  email: string | null | undefined,
  name: string | null | undefined,
  image: string | null | undefined
) => {
  try {
    if (!email || !name) {
      console.error("Email or name is missing");
      return;
    }

    const templateParams = {
      name,
      email,
      image: image || "https://placehold.co/100x100.png",
      message: `Hello ${name},\n\nYou have successfully added a new habit to your account.\n\nBest,\nSteakly Team`,
      year: new Date().getFullYear(),
    };

    const response = await emailjs.send(
      process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID!,
      process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID!,
      templateParams,
      process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY!
    );

    console.log("Email sent successfully:", response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};
