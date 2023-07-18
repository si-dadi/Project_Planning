import React, { useEffect, useState } from "react";
import { FiSearch } from "react-icons/fi";
import admins from "../../loginPage/UserData";
const Searchbar = ({
  searchTerm,
  setSearchTerm,
  filteredProjects,
  setFilteredProjects,
}) => {

  const [projects, setProjects] = useState([]);
    const [isAdmin, setIsAdmin] = useState(false);
  
    useEffect(() => {
      const fetchData = async () => {
        try {
          const url = `http://localhost:5984/${process.env.REACT_APP_COUCHDB_DBNAME}/_all_docs`;
          const headers = new Headers();
          headers.append("Content-Type", "application/json");
          headers.append(
            "Authorization",
            "Basic " + btoa(process.env.REACT_APP_COUCHDB_USERNAME_AND_PASSWORD)
          );
  
          const response = await fetch(url, {
            method: "GET",
            headers: headers,
          });
  
          if (response.ok) {
            const data = await response.json();
            const projectDocs = await Promise.all(
              data.rows.map(async (row) => {
                const docUrl = `http://localhost:5984/${process.env.REACT_APP_COUCHDB_DBNAME}/${row.id}`;
                const docResponse = await fetch(docUrl, {
                  method: "GET",
                  headers: headers,
                });
                if (docResponse.ok) {
                  const docData = await docResponse.json();
                  return docData;
                } else {
                  console.error(
                    `An error occurred while fetching project document: ${docResponse.status} ${docResponse.statusText}`
                  );
                  return null;
                }
              })
            );
            setProjects(projectDocs.filter((doc) => doc !== null));
          } else {
            const errorText = await response.text();
            console.error(
              `An error occurred while fetching data: ${response.status} ${response.statusText}\n${errorText}`
            );
          }
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };
  
      fetchData();
  
      function isAdminUser(e) {
        if (admins[e]) {
          return true;
        } else {
          return false;
        }
      }
      setIsAdmin(isAdminUser(localStorage.getItem("email")));
    }, []);
  
    const handleSearch = (e) => {
      e.preventDefault();
  
      const searchTermLowerCase = searchTerm.toLowerCase();
      const results = projects.filter((project) =>
        JSON.stringify(project).toLowerCase().includes(searchTermLowerCase)
      );
  
      setFilteredProjects(results);
    };
  return (
    <div>
      <form
        autoComplete="off"
        className="p-2 text-gray-900 hover:text-gray-700"
        onSubmit={handleSearch}
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
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </form>
    </div>
  );
};

export default Searchbar;