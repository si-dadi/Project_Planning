import React, { useEffect } from "react";
import { FiSearch } from "react-icons/fi";

const Searchbar = ({
  searchTerm,
  setSearchTerm,
}) => {

  return (
    <div>
      <form
        autoComplete="off"
        className="p-2 text-gray-900 hover:text-gray-700"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-row justify-start items-center bg-[#CCC1BE] rounded-lg">
          <FiSearch aria-hidden="true" className="w-5 h-5 ml-4" />
          <input
            name="search-field"
            autoComplete="off"
            id="search-field"
            className="flex-1 bg-transparent border-none placeholder-gray-800 hover:text-gray-800 outline-none text-base text-black p-4"
            placeholder="Search"
            type="search"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
            }}
            onSubmit={(e) => e.preventDefault()}
          />
        </div>
      </form>
    </div>
  );
};

export default Searchbar;