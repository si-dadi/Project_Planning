import React, { useState, useEffect } from "react";
import admins from "../../loginPage/UserData";

const Search = ({
  searchTerm,
  setSearchTerm,
  filteredProjects,
  setFilteredProjects,
}) => {
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
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

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setShowModal(true);
  };

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  return (
    <div className="mt-20 overflow-y-auto scrollbar-none ">
      {filteredProjects.length > 0 ? (
        filteredProjects.map((project, index) => (
          <div
            key={index}
            className="bg-gray-200 p-4 m-4 rounded-xl flex flex-row justify-between"
          >
            <div>
              <div className="flex flex-row mx-6">
                <p className="mx-6 text-slate-700">
                  Project No: {project.projectNo}
                </p>
                <h2>
                  <strong>Title:</strong>{" "}
                  {project.projectTitle?.charAt(0).toUpperCase() +
                    project.projectTitle?.slice(1)}
                </h2>
              </div>
              <div className="flex flex-row mx-6">
                <p className="mx-4 text-sm">
                  Investigators:{" "}
                  {Array.isArray(project.projectInvestigator)
                    ? project.projectInvestigator.join(", ")
                    : project.projectInvestigator}
                </p>
                <p className="mx-6 text-sm">|</p>
                <p className="mx-6 text-sm">
                  Co-Investigators:{" "}
                  {Array.isArray(project.coPI)
                    ? project.coPI.join(", ")
                    : project.coPI}
                </p>{" "}
              </div>
            </div>
            <div>
              <button
                className="bg-green-400 px-3 py-2 rounded-full text-sm italic"
                onClick={() => handleProjectClick(project)}
              >
                More Details
              </button>
            </div>
          </div>
        ))
      ) : (
        <p>No results found</p>
      )}

      {selectedProject && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center z-[50000]">
          <div className="bg-white rounded-lg shadow-lg p-6 h-4/5 w-4/5 overflow-y-scroll relative">
            <button
              className="text-gray-500 hover:text-gray-700 absolute right-8 top-8 p-2 bg-gray-100 rounded-xl"
              onClick={closeModal}
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                ></path>
              </svg>
            </button>
            <div className="flex justify-between mb-4 mt-20">
              <h3 className="text-3xl flex mx-auto font-semibold text-gray-900 mb-10">
                Project Details
              </h3>
            </div>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Project No: {selectedProject.projectNo}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Title:{" "}
              {selectedProject.projectTitle?.charAt(0).toUpperCase() +
                selectedProject.projectTitle?.slice(1)}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Investigators:{" "}
              {Array.isArray(selectedProject.projectInvestigator)
                ? selectedProject.projectInvestigator.join(", ")
                : selectedProject.projectInvestigator}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Co-Investigators: {selectedProject.coPI}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Team Members:{" "}
              {Array.isArray(selectedProject.teamMembers)
                ? selectedProject.teamMembers.join(", ")
                : selectedProject.teamMembers}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Objectives: {selectedProject.objectives}
            </p>
            <p className="text-base leading-relaxed text-gray-500 mb-4">
              Timeline: {selectedProject.timeline}
            </p>

            <div>
              <h4 className="text-lg font-semibold mb-2">Resources Required</h4>
              <div className="mb-4">
                <p className="text-base leading-relaxed text-gray-500 mb-4">
                  Equipment:
                </p>
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(
                        selectedProject.resourcesRequired.equipment[0]
                      ).map((key, index) => {
                        if (
                          !isAdmin &&
                          (key === "indentingDate" ||
                            key === "indenter" ||
                            key === "indentCost" ||
                            key === "gteProposalDate" ||
                            key === "gteReceivedDate" ||
                            key === "equipmentReceived" ||
                            key === "inventoryDBUpdated")
                        ) {
                          return null; // Skip rendering the table header for non-admin users
                        }
                        return (
                          <th
                            key={index}
                            className="text-left border px-4 py-2 text-sm"
                          >
                            {key?.charAt(0).toUpperCase() + key?.slice(1)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.resourcesRequired.equipment.map(
                      (equipment, index) => (
                        <tr key={index}>
                          {Object.entries(equipment).map(
                            ([key, value], index) => {
                              if (
                                !isAdmin &&
                                (key === "indentingDate" ||
                                  key === "indenter" ||
                                  key === "indentCost" ||
                                  key === "gteProposalDate" ||
                                  key === "gteReceivedDate" ||
                                  key === "equipmentReceived" ||
                                  key === "inventoryDBUpdated")
                              ) {
                                return null; // Skip rendering the field for non-admin users
                              }
                              return (
                                <td
                                  key={index}
                                  className="border px-4 py-2 text-sm"
                                >
                                  {value}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mb-4">
                <p className="text-base leading-relaxed text-gray-500 mb-4">
                  Consumables:
                </p>
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(
                        selectedProject.resourcesRequired.consumables[0]
                      ).map((key, index) => {
                        if (
                          !isAdmin &&
                          (key === "indentingDate" ||
                            key === "indenter" ||
                            key === "indentCost" ||
                            key === "gteProposalDate" ||
                            key === "gteReceivedDate" ||
                            key === "equipmentReceived")
                        ) {
                          return null; // Skip rendering the table header for non-admin users
                        }
                        return (
                          <th
                            key={index}
                            className="text-left border px-4 py-2 text-sm"
                          >
                            {key?.charAt(0).toUpperCase() + key?.slice(1)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.resourcesRequired.consumables.map(
                      (consumable, index) => (
                        <tr key={index}>
                          {Object.entries(consumable).map(
                            ([key, value], index) => {
                              if (
                                !isAdmin &&
                                (key === "indentingDate" ||
                                  key === "indenter" ||
                                  key === "indentCost" ||
                                  key === "gteProposalDate" ||
                                  key === "gteReceivedDate" ||
                                  key === "equipmentReceived")
                              ) {
                                return null; // Skip rendering the field for non-admin users
                              }
                              return (
                                <td
                                  key={index}
                                  className="border px-4 py-2 text-sm"
                                >
                                  {value}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mb-4">
                <p className="text-base leading-relaxed text-gray-500 mb-4">
                  Services:
                </p>
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(
                        selectedProject.resourcesRequired.services[0]
                      ).map((key, index) => {
                        if (
                          !isAdmin &&
                          (key === "indentingDate" ||
                            key === "indenter" ||
                            key === "indentCost" ||
                            key === "gteProposalDate" ||
                            key === "gteReceivedDate" ||
                            key === "equipmentReceived")
                        ) {
                          return null; // Skip rendering the table header for non-admin users
                        }
                        return (
                          <th
                            key={index}
                            className="text-left border px-4 py-2 text-sm"
                          >
                            {key?.charAt(0).toUpperCase() + key?.slice(1)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.resourcesRequired.services.map(
                      (service, index) => (
                        <tr key={index}>
                          {Object.entries(service).map(
                            ([key, value], index) => {
                              if (
                                !isAdmin &&
                                (key === "indentingDate" ||
                                  key === "indenter" ||
                                  key === "indentCost" ||
                                  key === "gteProposalDate" ||
                                  key === "gteReceivedDate" ||
                                  key === "equipmentReceived")
                              ) {
                                return null; // Skip rendering the field for non-admin users
                              }
                              return (
                                <td
                                  key={index}
                                  className="border px-4 py-2 text-sm"
                                >
                                  {value}
                                </td>
                              );
                            }
                          )}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
              <div className="mb-4">
                <p className="text-base leading-relaxed text-gray-500 mb-4">
                  Works:
                </p>
                <table className="w-full">
                  <thead>
                    <tr>
                      {Object.keys(
                        selectedProject.resourcesRequired.works[0]
                      ).map((key, index) => {
                        if (
                          !isAdmin &&
                          (key === "indentingDate" ||
                            key === "indenter" ||
                            key === "indentCost" ||
                            key === "gteProposalDate" ||
                            key === "gteReceivedDate" ||
                            key === "equipmentReceived")
                        ) {
                          return null; // Skip rendering the table header for non-admin users
                        }
                        return (
                          <th
                            key={index}
                            className="text-left border px-4 py-2 text-sm"
                          >
                            {key?.charAt(0).toUpperCase() + key?.slice(1)}
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {selectedProject.resourcesRequired.works.map(
                      (work, index) => (
                        <tr key={index}>
                          {Object.entries(work).map(([key, value], index) => {
                            if (
                              !isAdmin &&
                              (key === "indentingDate" ||
                                key === "indenter" ||
                                key === "indentCost" ||
                                key === "gteProposalDate" ||
                                key === "gteReceivedDate" ||
                                key === "equipmentReceived")
                            ) {
                              return null; // Skip rendering the field for non-admin users
                            }
                            return (
                              <td
                                key={index}
                                className="border px-4 py-2 text-sm"
                              >
                                {value}
                              </td>
                            );
                          })}
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Manpower</h4>
              <p className="text-base leading-relaxed text-gray-500 mb-4">
                Proposed Requirement:
              </p>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-center border px-4 py-2">Key</th>
                    <th className="text-center border px-4 py-2">Cost</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(
                    selectedProject.manpower.proposedRequirement
                  ).map(([key, value], index) => (
                    <tr key={index}>
                      <td className="border px-4 py-2">{key}</td>
                      <td className="border px-4 py-2">{value.cost}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {isAdmin && (
                <div>
                  <p className="text-base leading-relaxed text-gray-500 mb-4">
                    Interview Date: {selectedProject.manpower.interviewDate}
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 mb-4">
                    Candidate Name: {selectedProject.manpower.candidateName}
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 mb-4">
                    Joining Date: {selectedProject.manpower.joiningDate}
                  </p>
                  <p className="text-base leading-relaxed text-gray-500 mb-4">
                    Leaving Date: {selectedProject.manpower.leavingDate}
                  </p>
                </div>
              )}
            </div>

            <div>
              <h4 className="text-lg font-semibold mb-2">Budget</h4>
              <p className="text-base leading-relaxed text-gray-500 mb-4">
                Non-Recurring:
              </p>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-center">Key</th>
                    <th className="text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedProject.budget.nonRecurring).map(
                    ([key, value], index) => (
                      <tr key={index}>
                        <td className="py-2">{key}</td>
                        <td className="py-2">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <p className="text-base leading-relaxed text-gray-500 mb-4">
                Recurring:
              </p>
              <table className="w-full mb-4">
                <thead>
                  <tr>
                    <th className="text-center">Key</th>
                    <th className="text-center">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(selectedProject.budget.recurring).map(
                    ([key, value], index) => (
                      <tr key={index}>
                        <td className="py-2">{key}</td>
                        <td className="py-2">{value}</td>
                      </tr>
                    )
                  )}
                </tbody>
              </table>
              <p>Total: {selectedProject.budget.total}</p>
            </div>
            <div className="">
              <button
                className="bg-red-400 px-3 py-2 rounded mt-4 mx-10"
                onClick={closeModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;
