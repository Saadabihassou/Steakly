"use client";

import React from "react";
import { Button } from "./ui/button";
import { FaGithub, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useSession, signIn, signOut } from "next-auth/react";

// Simple logo component for the navbar (unchanged)
export const Logo = (props: React.SVGAttributes<SVGElement>) => {
  return (
    <svg
      width="1em"
      height="1em"
      viewBox="0 0 324 323"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <rect
        x="88.1023"
        y="144.792"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 88.1023 144.792)"
        fill="currentColor"
      />
      <rect
        x="85.3459"
        y="244.537"
        width="151.802"
        height="36.5788"
        rx="18.2894"
        transform="rotate(-38.5799 85.3459 244.537)"
        fill="currentColor"
      />
    </svg>
  );
};

const Nav = () => {
  const { data: session, status } = useSession();

  return (
    <nav className="flex items-center justify-between rounded-full my-5 mx-20 px-5 py-3 border border-black shadow-xl">
      <div className="flex gap-1 items-center">
        <Logo className="size-6" />
        <span className="font-semibold">Steakly</span>
      </div>

      {/* Auth buttons */}
      <div>
        {status === "loading" ? (
          <span className="text-sm text-gray-500">Loading...</span>
        ) : session ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-8 mr-[23rem]">
              <p>Dashboard</p>
              <p>Pricing</p>
              <p>About</p>
            </div>
            <Button
              onClick={() => signOut()}
              variant="outline"
              className="rounded-full flex gap-2 items-center"
            >
              Sign Out <FaSignOutAlt />
            </Button>
          </div>
        ) : (
          <Button
            onClick={() => signIn()}
            variant="default"
            className="rounded-full flex gap-2 items-center"
          >
            Sign In with <FaGithub />
          </Button>
        )}
      </div>
    </nav>
  );
};

export default Nav;
