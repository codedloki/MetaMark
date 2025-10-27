import React from 'react';

/**
 * Breadcrumbs Component
 * Displays the current navigation path and allows clicking on previous steps.
 * @param {Array<object>} crumbs - The list of breadcrumb objects ({label: string, href?: string}).
 * @param {function} onCrumbClick - Function to call when a preceding crumb is clicked.
 */
const Breadcrumbs = ({ crumbs, onCrumbClick }) => {
  // Ensure crumbs is an array before trying to map, though React usually handles this.
  // The issue here is the content of the array, not the array itself.
  if (!Array.isArray(crumbs)) {
    return null; 
  }
  
  return (
    // Tailwind styling for the navigation container
    <nav className="text-sm font-medium text-gray-500 mb-4">
      <ol className="list-none p-0 inline-flex">
        {crumbs.map((crumb, index) => (
          // Key for list item iteration
          <li key={index} className="flex items-center">
            {/* Conditional rendering of the chevron separator for all but the first item */}
            {index > 0 && (
              <svg className="fill-current w-3 h-3 mx-2" viewBox="0 0 24 24">
                <path d="M7.33 24l-2.83-2.829 9.339-9.175-9.339-9.167 2.83-2.829 12.17 12z"/>
              </svg>
            )}

            {/* If it's not the last crumb, it's clickable */}
            {index < crumbs.length - 1 ? (
              <button
                onClick={() => onCrumbClick(index)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
              >
                {/* 🛑 FIX: Access the 'label' property of the crumb object */}
                {crumb.label}
              </button>
            ) : (
              // The last crumb is the current page and is not clickable
              <span className="text-gray-900">
                {/* 🛑 FIX: Access the 'label' property of the crumb object */}
                {crumb.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumbs;