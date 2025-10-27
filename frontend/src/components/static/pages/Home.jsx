import { Button } from "@mui/material";
import React from "react";

// --- Icon SVGs (Inline components for Hero and Info sections) ---

// HERO ICONS
// Security Shield
const SecurityShieldIcon = () => (
  <svg
    className="w-24 h-24 sm:w-32 sm:h-32 text-blue-600"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 17.5c-3.1-1.48-5.7-4.18-7-7.5V6.3l7-3 7 3v4.7c-1.3 3.32-3.9 6.02-7 7.5z" />
    <circle
      cx="12"
      cy="11"
      r="2.5"
      className="text-yellow-500"
      fill="currentColor"
    />
    <path
      d="M12 11c-.83 0-1.5-.67-1.5-1.5v-1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5z"
      fill="#fff"
    />
  </svg>
);

// Magnifying Glass and Circuit Board
const VerificationIcon = () => (
  <svg
    className="w-24 h-24 sm:w-32 sm:h-32 text-blue-500"
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    {/* Magnifying Glass */}
    <circle cx="11" cy="11" r="8" className="text-blue-400" strokeWidth="2" />
    <path d="M21 21l-4.35-4.35" className="text-blue-400" strokeWidth="2" />

    {/* Circuit Board/Map Overlay */}
    <rect
      x="13"
      y="2"
      width="6"
      height="6"
      rx="1"
      className="text-indigo-200"
      fill="currentColor"
      opacity="0.6"
      stroke="none"
    />
    <rect
      x="15"
      y="4"
      width="2"
      height="2"
      rx="0.5"
      className="text-indigo-700"
      fill="currentColor"
      stroke="none"
    />
    <rect
      x="2"
      y="13"
      width="4"
      height="4"
      rx="1"
      className="text-indigo-200"
      fill="currentColor"
      opacity="0.6"
      stroke="none"
    />
    <path d="M13 5h5M13 7h5" stroke="#4F46E5" strokeWidth="0.5" />
    <path d="M4 14v2M3 15h2" stroke="#4F46E5" strokeWidth="0.5" />
  </svg>
);

const IllustrationBlock = () => (
  <div className="flex items-center justify-center p-4 space-x-2">
    <SecurityShieldIcon />
    <VerificationIcon />
  </div>
);

// HOW IT WORKS ICONS
const ManufacturerIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-900"
  >
    <rect x="2" y="10" width="20" height="4" rx="1" ry="1"></rect>
    <path d="M7 10v4M12 10v4M17 10v4"></path>
    <circle cx="7" cy="12" r="1.5"></circle>
    <circle cx="17" cy="12" r="1.5"></circle>
    <path d="M4 14h16"></path>
    <path d="M7 10l-2-6h14l-2 6"></path>
  </svg>
);

const BlockchainIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-900"
  >
    <rect x="3" y="3" width="8" height="8" rx="1" ry="1"></rect>
    <rect x="13" y="3" width="8" height="8" rx="1" ry="1"></rect>
    <rect x="3" y="13" width="8" height="8" rx="1" ry="1"></rect>
    <path d="M11 7h2M7 11v2M13 11v2"></path>
    <line x1="17" y1="13" x2="17" y2="21"></line>
    <line x1="21" y1="17" x2="13" y2="17"></line>
  </svg>
);

const QRIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-900"
  >
    <rect x="3" y="3" width="6" height="6"></rect>
    <rect x="15" y="3" width="6" height="6"></rect>
    <rect x="3" y="15" width="6" height="6"></rect>
    <path d="M11 3h2M11 21h2M3 11v2M21 11v2"></path>
    <path d="M16 16h2v2h-2zM12 12h-2v-2h2z"></path>
  </svg>
);

const ConfirmedIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-900"
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

// FEATURES ICONS
const SecureIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 text-blue-600"
  >
    <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm0 17.5c-3.1-1.48-5.7-4.18-7-7.5V6.3l7-3 7 3v4.7c-1.3 3.32-3.9 6.02-7 7.5z" />
    <path
      d="M12 11c-.83 0-1.5-.67-1.5-1.5v-1c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v1c0 .83-.67 1.5-1.5 1.5z"
      fill="#fff"
    />
    <circle
      cx="12"
      cy="11"
      r="2.5"
      className="text-yellow-400"
      fill="currentColor"
    />
  </svg>
);

const InstantIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className="w-10 h-10 text-gray-600"
  >
    <path
      d="M13 14H9.5a.5.5 0 0 1-.46-.72L12.55 1.52A.49.49 0 0 1 13 1h3a.5.5 0 0 1 .46.72L13.45 12.48A.49.49 0 0 1 13 13h-3.5a.5.5 0 0 1-.46-.72L12.55 1.52A.49.49 0 0 1 13 1h3a.5.5 0 0 1 .46.72L13.45 12.48A.49.49 0 0 1 13 13z"
      className="text-gray-400 opacity-60"
    />
    <path
      d="M16.5 22h-9a.5.5 0 0 1-.5-.5v-1a.5.5 0 0 1 .5-.5h9a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5z"
      className="text-gray-900"
    />
    <path
      d="M13 17H9.5a.5.5 0 0 1-.46-.72L12.55 5.52A.49.49 0 0 1 13 5h3a.5.5 0 0 1 .46.72L13.45 16.48A.49.49 0 0 1 13 17z"
      className="text-gray-900"
    />
  </svg>
);

const GlobalAccessIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10"
  >
    {/* Globe */}
    <circle
      cx="12"
      cy="12"
      r="8"
      className="text-green-500 fill-green-500 opacity-10"
      stroke="#059669"
    />
    <line x1="2" y1="12" x2="22" y2="12" stroke="#059669" />
    <path
      d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
      stroke="#059669"
    />

    {/* Magnifier */}
    <circle
      cx="17.5"
      cy="17.5"
      r="3.5"
      className="text-blue-500"
      strokeWidth="2"
      stroke="#3B82F6"
    />
    <path
      d="M21 21l-2-2"
      className="text-blue-500"
      strokeWidth="2"
      stroke="#3B82F6"
    />
  </svg>
);

const IntegrationIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="w-10 h-10 text-gray-900"
  >
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09a1.65 1.65 0 0 0-1-1.51 1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09a1.65 1.65 0 0 0 1.51-1 1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V15z"></path>
  </svg>
);

// --- Component Helper Functions ---

/**
 * Simulates the use of an MUI button using Tailwind for perfect visual fidelity
 * with the provided design image.
 */
const CustomMuiButton = ({ children, variant, className = "", ...props }) => {
  const baseClasses =
    "font-medium text-center transition-all duration-200 shadow-md rounded-lg px-8 py-3 text-base sm:text-lg whitespace-nowrap";

  let specificClasses = "";

  // Primary Button (Filled/Contained)
  if (variant === "contained") {
    specificClasses =
      "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50";
  }
  // Secondary Button (Simulating Outlined or Text, styled as light gray)
  else if (variant === "text") {
    specificClasses = "bg-gray-200 hover:bg-gray-300 text-gray-800 shadow-none";
  } else {
    specificClasses =
      "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/50";
  }

  return (
    <button
      className={`${baseClasses} ${specificClasses} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

const GridItem = ({ icon: Icon, title, isDarkBackground = false }) => (
  <div className="flex flex-col items-center text-center p-4">
    <div
      className={`p-3 rounded-full mb-4 ${isDarkBackground ? "bg-white" : "bg-transparent"}`}
    >
      <Icon />
    </div>
    <p
      className={`font-medium text-lg ${isDarkBackground ? "text-gray-800" : "text-gray-900"}`}
    >
      {title}
    </p>
  </div>
);

// --- Main Section Components ---

const Home = () => {
  return (
    <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white rounded-t-xl h-screen overflow-y-scroll">
      <div className="w-full max-w-6xl mx-auto">
        {/* Responsive Grid/Flex Container */}
        <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-12">
          {/* Left Side: Text and CTAs */}
          <div className="md:w-1/2 order-2 md:order-1 text-center md:text-left">
            {/* Headline */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 leading-tight mb-6">
              Verify Authenticity Of Your Product Instantly With Blockchain
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 mb-10 max-w-md mx-auto md:mx-0">
              MetaMark ensures every product you buy is genuine through secure
              blockchain verification.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4 justify-center md:justify-start">
              <CustomMuiButton
                variant="contained"
                onClick={() => console.log("Get Started Clicked")}
              >
                Get Started
              </CustomMuiButton>

              <Button // <-- Now using CustomMuiButton
                sx={{
                  bgcolor: "#6C63FF",
                  color: "white",
                }} // <-- Using the new variant with #6C63FF
                onClick={() => console.log("Learn More Clicked")}
              >
                Learn More
              </Button>
            </div>
          </div>

          {/* Right Side: Illustration */}
          <div className="md:w-1/2 order-1 md:order-2 flex justify-center items-center">
            <IllustrationBlock />
          </div>
        </div>
      </div>
      <HowItWorksSection />
    </section>
  );
};

const HowItWorksSection = () => {
  const steps = [
    { icon: ManufacturerIcon, title: "Manufacturer Registers Product" },
    { icon: BlockchainIcon, title: "Blockchain Verification" },
    { icon: QRIcon, title: "Customer Scans QR" },
    { icon: ConfirmedIcon, title: "Authenticity Confirmed" },
  ];

  return (
    <section className="py-16 bg-white border-t border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-12">
          How It Works
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {steps.map((step, index) => (
            <GridItem key={index} icon={step.icon} title={step.title} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Home;
