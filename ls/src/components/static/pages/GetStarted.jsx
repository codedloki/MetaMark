import React from "react";
const GetStarted = () => {
  const steps = [
    {
      title: "Step 1: Sign Up",
      description: "Create your MetaMark account and verify your identity.",
    },
    {
      title: "Step 2: Register Product",
      description:
        "Use our platform to securely register your product data on the blockchain.",
    },
    {
      title: "Step 3: Print QR Code",
      description:
        "Generate unique, tamper-proof QR codes for your physical products.",
    },
    {
      title: "Step 4: Verify Instantly",
      description:
        "Customers scan the code to instantly confirm product authenticity.",
    },
  ];

  return (
    // Set background to white
    <section className="py-20 bg-white border-t border-b border-gray-100 h-screen overflow-y-scroll">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 text-center mb-16">
          HOW TO <span className="text-[#6C63FF]"> GET STARTED?</span>
        </h2>

        <div className="relative">
          {/* Vertical line/Stepper track (hidden on mobile for cleaner look) */}
          <div className="hidden md:block absolute left-1/2 top-0 h-full w-0.5 bg-blue-200 transform -translate-x-1/2"></div>

          <div className="space-y-16">
            {steps.map((step, index) => {
              const isEven = index % 2 !== 0; // Steps 1 (index 0) and 3 (index 2) are odd, Steps 2 (index 1) and 4 (index 3) are even

              return (
                <div
                  key={index}
                  className="flex flex-col md:flex-row items-start md:items-center relative"
                >
                  {/* Step Content */}
                  <div
                    className={`w-full md:w-1/2 p-4 rounded-xl transition-all duration-500 ease-in-out ${
                      // Content for Odd steps (1, 3) goes right (order-2), aligns left (pr-12)
                      // Content for Even steps (2, 4) goes left (default order), aligns right (pl-12)
                      isEven
                        ? "md:pl-12" // Even steps (2, 4) content left, aligned left
                        : "md:pr-12 md:text-right md:order-2" // Odd steps (1, 3) content right, aligned right
                    }`}
                  >
                    {/* Mobile Indicator (Visible on small screens) */}
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm mb-4 md:hidden">
                      {index + 1}
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {step.title}
                    </h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>

                  {/* Step Indicator Dot (Fixed, Centered on desktop timeline) */}
                  <div className="hidden md:flex absolute top-0 bottom-0 left-1/2 w-0 h-full justify-center items-start pt-4 transform -translate-x-1/2">
                    <div className="w-8 h-8 rounded-full bg-blue-600 border-4 border-white shadow-lg flex items-center justify-center text-white font-bold text-sm">
                      {index + 1}
                    </div>
                  </div>

                  {/* Spacer or Content holder for opposite side on desktop */}
                  <div
                    className={`hidden md:block w-1/2 ${isEven ? "md:order-2" : "md:order-1"}`}
                  ></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default GetStarted;
