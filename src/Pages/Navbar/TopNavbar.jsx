import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, Transition } from "@headlessui/react";

const TopNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    console.log("Logout clicked");
    navigate("/");
  };

  const handleTakeSurvey = () => {
    console.log("Take a Survey clicked");
    navigate("/user");
  };

  return (
    <nav className="bg-gray-800 p-4  fixed top-0 w-full z-50">
      <div className="container flex justify-between items-center ">
        <Link to="/" className="text-white text-3xl font-bold">
          SurveyApp
        </Link>
        <div className="absolute top-0  right-10">
          <Menu as="div" className=" relative mt-5 ">
            {({ open }) => (
              <>
                <Menu.Button className="inline-flex items-center justify-center ml-2 text-gray-400 hover:text-white focus:outline-none focus:ring focus:border-blue-300">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    className="h-6 w-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M3 12h18m-18 5h18m-18-10h18M3 6h18"
                    />
                  </svg>
                </Menu.Button>

                <Transition
                  show={open}
                  as={React.Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items
                    static
                    className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
                  >
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } group flex items-center  w-full px-2 py-2 text-lg`}
                            onClick={handleTakeSurvey}
                          >
                            Take a Survey
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            className={`${
                              active
                                ? "bg-gray-100 text-gray-900"
                                : "text-gray-700"
                            } group flex items-center  w-full px-2 py-2 text-lg`}
                            onClick={handleLogout}
                          >
                            Logout
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </>
            )}
          </Menu>
        </div>
      </div>
    </nav>
  );
};

export default TopNavbar;
