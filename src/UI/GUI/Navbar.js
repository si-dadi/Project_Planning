import React, { useEffect, useState } from "react";
import { Disclosure } from "@headlessui/react";
import { BsPersonCircle } from "react-icons/bs";
import { IoMdNotifications } from "react-icons/io";
import SearchBar from "./SearchBar";
import ceeriLogo from "../../assets/images/Central_Electronics_Engineering_Research_Institute_Logo.png";

const navigation = [];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

export default function Example({ setNavigator, searchTerm, setSearchTerm, filteredProjects, setFilteredProjects }) {
  return (
    <Disclosure as="nav" className="bg-[#e7e2e1]">
      {({ open }) => (
        <>
          <div className=" min-h-[1/5] mx-auto ml-5 px-2 sm:px-6 lg:px-8 sticky top-0 z-[100]">
            <div className="relative flex h-18 items-center">
              <div className="relative items-center mx-auto w-1/3">
                <SearchBar
                  searchTerm={searchTerm}
                  setSearchTerm={setSearchTerm}
                  filteredProjects={filteredProjects}
                  setFilteredProjects={setFilteredProjects}
                />
              </div>

              <div className="hidden sm:ml-6 sm:block">
                <div className="flex space-x-4">
                  {navigation.map((item) => (
                    <a
                      key={item.name}
                      href={item.href}
                      className={classNames(
                        item.current
                          ? "bg-gray-900 text-white"
                          : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "px-3 py-2 rounded-md text-sm font-medium"
                      )}
                      aria-current={item.current ? "page" : undefined}
                    >
                      {item.name}
                    </a>
                  ))}
                </div>
              </div>
              <div className="absolute w-16 inset-y-0 right-0 mx-4 flex items-center sm:static sm:inset-auto sm:ml-6 sm:pr-0 ">
                <div>
                  <button>
                    <IoMdNotifications className="w-6 h-6" />
                  </button>
                </div>
                <div>
                  <img
                    src={
                      localStorage.getItem("photoURL") ? (
                        localStorage.getItem("photoURL")
                      ) : (
                        <BsPersonCircle />
                      )
                    }
                    className=" w-20 rounded-full"
                  ></img>
                </div>
              </div>
            </div>
          </div>

          <Disclosure.Panel className="sm:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((item) => (
                <Disclosure.Button
                  key={item.name}
                  as="a"
                  href={item.href}
                  className={classNames(
                    item.current
                      ? "bg-gray-900 text-white"
                      : "text-gray-300 hover:bg-gray-700 hover:text-white",
                    "block px-3 py-2 rounded-md text-base font-medium"
                  )}
                  aria-current={item.current ? "page" : undefined}
                >
                  {item.name}
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}
