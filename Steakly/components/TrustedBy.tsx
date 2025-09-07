export const TrustedBy = () => {
  const companyLogos = [
    "slack",
    "framer",
    "netflix",
    "google",
    "linkedin",
    "instagram",
    "facebook",
  ];

  return (
    <>
      <style>{`
                  .marquee-inner {
                      animation: marqueeScroll linear infinite;
                  }
  
                  @keyframes marqueeScroll {
                      0% {
                          transform: translateX(0%);
                      }
  
                      100% {
                          transform: translateX(-50%);
                      }
                  }
              `}</style>

      <p className="self-center text-lg text-slate-700">
        Our app is trusted by devs from high-performed co's.
      </p>
      <div className="overflow-hidden w-full relative max-w-5xl mx-auto select-none">
        <div className="absolute left-0 top-0 h-full w-20 z-10 pointer-events-none bg-gradient-to-r from-white to-transparent" />
        <div
          className="marquee-inner flex will-change-transform min-w-[200%]"
          style={{ animationDuration: "20s" }}
        >
          <div className="flex">
            {[...companyLogos, ...companyLogos].map((company, index) => (
              <img
                key={index}
                src={`https://raw.githubusercontent.com/prebuiltui/prebuiltui/main/assets/companyLogo/${company}.svg`}
                alt={company}
                className="w-full h-full object-cover mx-6"
                draggable={true}
              />
            ))}
          </div>
        </div>
        <div className="absolute right-0 top-0 h-full w-20 md:w-40 z-10 pointer-events-none bg-gradient-to-l from-white to-transparent" />
      </div>
    </>
  );
};
