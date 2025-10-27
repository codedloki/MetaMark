import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
function DropdownMenu() {
  const [isOpen, setIsOpen] = useState(false)
  const menuRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <div className="relative inline-block text-left" ref={menuRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-blue-600 text-black px-4 py-2 rounded-md hover:bg-blue-700 focus:outline-none"
      >
        Connect
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-md shadow-lg z-10">
          <ul className="py-1 text-gray-800">
            {/* Register with Submenu */}
            <li className="relative group">
              <Link to="/register"                 className="block px-4 py-2 hover:bg-gray-100 w-full"
>
                Register
                </Link>
            
              {/* <ul className="absolute left-[-86%] top-0 mt-0 ml-1 hidden group-hover:block w-48 bg-white border border-gray-200 rounded-md shadow-lg z-20">
                <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Manufacturer
                  </a>
                </li>
                    <li>
                  <a
                    href="#"
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    Customer
                  </a>
                </li>
              </ul> */}
            </li>

            {/* Login */}
            <li >
              {/* <a href="#" className="block px-4 py-2 hover:bg-white"> */}
              <Link to='/login' className="block px-4 py-2 hover:bg-white">
                Login
                </Link>
              {/* </a> */}
            </li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default DropdownMenu
