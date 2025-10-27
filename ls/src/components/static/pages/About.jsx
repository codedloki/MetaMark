import React from "react";

// --- Icon SVGs for Features Section (Restored from context) ---

// 1. Secure with Blockchain (Blue Shield/Lock)
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

// 2. Instant Verification (Flash/Lightning)
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

// 3. Global Access (Globe/Magnifier)
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

// 4. Easy Integration (Gear)
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

// --- Helper Components ---

/**
 * Reusable component for the feature grid items.
 */
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

// --- Refactored About Section ---

const About = () => {
  // Removed complex state, useRef, useEffect, and external component imports.

  const handleButtonClick = () => {
    console.log("View Team button clicked - Navigation logic placeholder.");
    // In a full React application, you would use: navigate("/team");
  };

  return (
    <div className=" bg-white h-screen overflow-y-scroll">
      <section className="py-16 bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-xl mx-auto text-center p-12 rounded-xl shadow-lg border border-gray-100">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6">
              Who are we?
            </h2>

            <p className="text-lg text-gray-700 mb-8">
              We are a decentralized crew on a mission to make ownership
              trustless and unstoppable. Built for the people, by the people 💫
            </p>

            <div>
              <button
                onClick={handleButtonClick}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition duration-300 shadow-md shadow-blue-500/50"
              >
                View Team
              </button>
            </div>
          </div>
        </div>
      </section>
      <FeaturesSection />
    </div>
  );
};

// --- Features Section ---

const FeaturesSection = () => {
  const features = [
    { icon: SecureIcon, title: "Secure with Blockchain" },
    { icon: InstantIcon, title: "Instant Verification" },
    { icon: GlobalAccessIcon, title: "Global Access" },
    { icon: IntegrationIcon, title: "Easy Integration for Brands" },
  ];

  return (
    // Background is light gray (bg-gray-100) for visual separation, contrasting the white About section.
    <section className="py-16 bg-gray-100 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 text-center mb-12">
          Features
        </h2>

        {/* Responsive grid: 2 columns on mobile, 4 columns on desktop */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <GridItem
              key={index}
              icon={feature.icon}
              title={feature.title}
              // Icon background is set to true to ensure the icon color stands out if the background changes.
              isDarkBackground={true}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
