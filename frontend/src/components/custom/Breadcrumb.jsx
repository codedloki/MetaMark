import React  from "react";
import { Link } from "react-router-dom";
const Breadcrumb = ({ items }) => (
  <nav className="text-gray-500 text-sm" aria-label="Breadcrumb">
    <ol className="list-none p-0 inline-flex">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-center">
          {item.href ? (
            <Link to={item.href} className="hover:text-blue-600">
              {item.label}
            </Link>
          ) : (
            <span className="text-gray-700 font-semibold">{item.label}</span>
          )}
          {idx < items.length - 1 && (
            <svg className="mx-2 h-4 w-4 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          )}
        </li>
      ))}
    </ol>
  </nav>
);

export default Breadcrumb;