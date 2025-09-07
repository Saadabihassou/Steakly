"use client";
import React from "react";

export const FAQ = () => {
  const [openIndex, setOpenIndex] = React.useState<Number | null>(null);
  const faqsData = [
    {
      question: "What is Steakly?",
      answer:
        "Steakly is a simple habit tracker that helps you build consistency and reach your goals by logging daily progress and tracking streaks.",
    },
    {
      question: "Is Steakly free to use?",
      answer:
        "Yes! You can start using Steakly completely free. We’ll always keep a free version so you can build better habits without limits.",
    },
    {
      question: "Do I need to create an account?",
      answer:
        "Yes, signing in lets us securely save your habits and streaks to your account so you can access them from anywhere.",
    },
    {
      question: "Can I track multiple habits at once?",
      answer:
        "Absolutely. You can add as many habits as you like and log daily check-ins for each one.",
    },
    {
      question: "What makes Steakly different?",
      answer:
        "Unlike cluttered productivity apps, Steakly is lightweight, distraction-free, and designed to keep you focused only on your habits.",
    },
    {
      question: "Is my data safe?",
      answer:
        "Yes. Your data is stored securely in the cloud and only linked to your account. We never sell or share your information.",
    },
  ];

  return (
    <>
      <div className="flex flex-col items-center text-center mt-7 text-slate-800 px-3">
        <p className="text-base font-medium text-slate-600">FAQ</p>
        <h1 className="text-3xl md:text-4xl bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-sky-400 font-semibold mt-2">
          Frequently Asked Questions
        </h1>
        <p className="text-[16px] text-slate-500 mt-6 max-w-md">
          Proactively answering FAQs boosts user confidence and cuts down on
          support tickets.
        </p>
        <div className="max-w-3/4 w-full mt-6 grid grid-cols-2 gap-4 items-start text-left">
          {faqsData.map((faq, index) => (
            <div key={index} className="flex flex-col items-start w-full">
              <div
                className="flex items-center justify-between w-full cursor-pointer bg-gradient-to-r from-indigo-50 to-white via-indigo-50 border border-indigo-100 p-4 rounded"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <h2 className="text-sm">{faq.question}</h2>
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 18 18"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className={`${openIndex === index ? "rotate-180" : ""} transition-all duration-500 ease-in-out`}
                >
                  <path
                    d="m4.5 7.2 3.793 3.793a1 1 0 0 0 1.414 0L13.5 7.2"
                    stroke="#1D293D"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <p
                className={`text-sm text-slate-500 px-4 transition-all duration-500 ease-in-out ${openIndex === index ? "opacity-100 max-h-[300px] translate-y-0 pt-4" : "opacity-0 max-h-0 -translate-y-2"}`}
              >
                {faq.answer}
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};
