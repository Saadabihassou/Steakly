import React from "react";
import { Badge } from "./ui/badge";
import { FaArrowRight, FaRocket, FaSignInAlt } from "react-icons/fa";
import { Button } from "./ui/button";
import { motion as m } from "framer-motion";

const Hero = () => {
  return (
    <section className="relative flex flex-col mt-16 justify-center mb-10 items-center gap-10 overflow-hidden">
      <Badge className="rounded-full py-1 text-[13px] flex items-center gap-2 z-10">
        New Best prices! <FaArrowRight />
      </Badge>

      <main className="flex flex-col items-center justify-center gap-10 z-10">
        <div className="flex flex-col items-center justify-center gap-7">
          <h1 className="text-6xl bg-clip-text text-transparent bg-gradient-to-b from-black to-sky-300 text-center">
            Build Better Habits, <br /> One Day at a Time
          </h1>
          <p className="text-lg text-gray-600 max-w-3xl text-center">
            Steakly helps you stay consistent with a simple, distraction-free
            habit tracker. Log your progress, track streaks, and grow into the
            person you want to be.
          </p>
        </div>

        {/* CTA buttons */}
        <div className="space-x-8">
          <Button className="hover:-translate-y-1 hover:shadow-2xl cursor-pointer duration-300">
            Get Started Free <FaRocket />
          </Button>
          <Button
            variant="outline"
            className="hover:-translate-y-1 hover:shadow-2xl cursor-pointer duration-300"
          >
            Sign In <FaSignInAlt />
          </Button>
        </div>
      </main>
    </section>
  );
};

export default Hero;
