import React, { useState, useEffect } from "react";
import admins from "../../loginPage/UserData";

const EditProject = ({ projectToEdit, Id, Rev }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isAdmin = isAdminUser(localStorage.getItem("email"));

  const [selectedProject, setEditProject] = useState(projectToEdit);
  useEffect(() => {
    setEditProject(projectToEdit);
  });

  class Project {
    constructor(isAdmin) {
      this.projectTitle = selectedProject.projectTitle;
      this.projectNo = selectedProject.projectNo;
      this.projectInvestigator = selectedProject.projectInvestigator;
      this.coPI = selectedProject.coPI;
      this.teamMembers = selectedProject.teamMembers;
      this.objectives = selectedProject.objectives;
      this.timeline = selectedProject.timeline;
      this.resourcesRequired = selectedProject.resourcesRequired;
      this.manpower = selectedProject.manpower;
      this.budget = selectedProject.budget;
    }
  }
  const [project, setProject] = useState(new Project(isAdmin));

  function isAdminUser(e) {
    if (admins[e]) {
      return true;
    } else {
      return false;
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "teamMembers") {
      const newValue = value;
      setProject((prevProject) => ({
        ...prevProject,
        [name]: newValue,
      }));
    } else if (name.startsWith("budget.")) {
      const [category, subCategory] = name.split(".")?.slice(1);
      setProject((prevProject) => ({
        ...prevProject,
        budget: {
          ...prevProject.budget,
          [category]: {
            ...prevProject.budget[category],
            [subCategory]: value,
          },
        },
      }));
    } else {
      setProject((prevProject) => ({
        ...prevProject,
        [name]: value,
      }));
    }
  };

  const resourceTypes = ["equipment", "consumables", "services", "works"];

  const addResource = (resourceType) => {
    setProject((prevProject) => {
      const newResource = {
        name: "",
        cost: "",
        gteRequired: "",
        throughGeM: "",
        year1: "",
        year2: "",
        year3: "",
        indentingDate: "",
        indenter: "",
        indentCost: "",
        gteProposalDate: "",
        gteReceivedDate: "",
        [resourceType + "Received"]: "",
        inventoryDBUpdated: "",
      };

      return {
        ...prevProject,
        resourcesRequired: {
          ...prevProject.resourcesRequired,
          [resourceType]: [
            ...prevProject.resourcesRequired[resourceType],
            newResource,
          ],
        },
      };
    });
  };
  const removeLastResource = (resourceType) => {
    setProject((prevProject) => {
      const updatedResources = [...prevProject.resourcesRequired[resourceType]];
      updatedResources.pop(); // Remove the last resource from the array

      return {
        ...prevProject,
        resourcesRequired: {
          ...prevProject.resourcesRequired,
          [resourceType]: updatedResources,
        },
      };
    });
  };

  const handleResourceChange = (e, index, resourceType) => {
    const { name, value } = e.target;
    setProject((prevProject) => {
      const updatedResources = [...prevProject.resourcesRequired[resourceType]];
      updatedResources[index] = {
        ...updatedResources[index],
        [name]: value,
      };
      return {
        ...prevProject,
        resourcesRequired: {
          ...prevProject.resourcesRequired,
          [resourceType]: updatedResources,
        },
      };
    });
  };

  const [manpowerFields, setManpowerFields] = useState([]);

  // Function to handle adding a new manpower field
  const addManpowerField = () => {
    setManpowerFields([
      ...manpowerFields,
      { name: "", cost: "", gteRequired: "" },
    ]);
  };

  // Function to handle changing the values of manpower fields
  const handleManpowerChange = (index, field, value) => {
    const updatedFields = [...manpowerFields];
    updatedFields[index][field] = value;
    setManpowerFields(updatedFields);
  };

  const handleBudgetChange = (event) => {
    const { name, value } = event.target;
    const [category, subCategory] = name.split("."); // Split the name into category and subCategory

    setProject((prevProject) => ({
      ...prevProject,
      budget: {
        ...prevProject.budget,
        [category]: {
          ...prevProject.budget[category],
          [subCategory]: value,
        },
        total: calculateTotalBudget({
          ...prevProject.budget,
          [category]: { ...prevProject.budget[category], [subCategory]: value },
        }),
      },
    }));
  };
  const calculateTotalBudget = (budget) => {
    const nonRecurringTotal = Object.values(budget.nonRecurring).reduce(
      (acc, val) => acc + Number(val),
      0
    );
    const recurringTotal = Object.values(budget.recurring).reduce(
      (acc, val) => acc + Number(val),
      0
    );
    return nonRecurringTotal + recurringTotal;
  };
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formSubmitted) {
      alert("Form has already been submitted.");
      return;
    }

    // Set the flag to true to prevent multiple submissions
    setFormSubmitted(true);

    try {
      const { _id, _rev } = selectedProject;

      // Construct the updated document data
      const updatedFields = {
        ...project,
        teamMembers: project.teamMembers,
        _id,
        _rev,
      };

      // Set up the fetch request
      const documentUrl = `http://localhost:5984/${process.env.REACT_APP_COUCHDB_DBNAME}/${_id}`;
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Basic " + btoa(process.env.REACT_APP_COUCHDB_USERNAME_AND_PASSWORD)
      );

      const response = await fetch(documentUrl, {
        method: "PUT",
        headers: headers,
        body: JSON.stringify(updatedFields),
      });

      if (response.ok) {
        alert("Data submitted successfully!");
        window.location.reload();
      } else {
        const errorText = await response.text();
        alert(
          `An error occurred while submitting data: ${response.status} ${response.statusText}\n${errorText}`
        );
      }
    } catch (error) {
      alert(`An error occurred while submitting data: ${error}`);
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={openModal}
      >
        Edit
      </button>
      {isModalOpen && (
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

            <div className="mt-16">
              <form onSubmit={handleSubmit} id="myForm">
                <div className="mb-8 flex flex-row mx-auto">
                  <label className="flex flex-col flex-1 mb-4 mx-6">
                    <span className="font-bold">Project Title:</span>
                    <input
                      type="text"
                      name="projectTitle"
                      value={project.projectTitle}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                  <label className="flex flex-col">
                    <span className="font-bold">Project No.:</span>
                    <input
                      type="text"
                      name="projectNo"
                      value={project.projectNo}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                </div>

                <div className="mb-8 flex flex-row mx-auto ">
                  {/* Project Investigator */}
                  <div className="mb-8 flex-1 mx-4">
                    <label className="flex flex-col">
                      <span className="font-bold">Project Investigator:</span>
                      <input
                        type="text"
                        name="projectInvestigator"
                        value={project.projectInvestigator}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </label>
                  </div>
                  {/* CO-PI */}
                  <div className="mb-8">
                    <label className="flex flex-col">
                      <span className="font-bold">CO-PI:</span>
                      <input
                        type="text"
                        name="coPI"
                        value={project.coPI}
                        onChange={handleChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </label>
                  </div>
                </div>
                {/* Team Members */}
                <div className="mb-8">
                  <label className="flex flex-col">
                    <span className="font-bold">Team Members:</span>
                    <textarea
                      name="teamMembers"
                      value={project.teamMembers}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </label>
                </div>
                {/* Objectives */}
                <div className="mb-8">
                  <label className="flex flex-col">
                    <span className="font-bold">Objectives:</span>
                    <textarea
                      name="objectives"
                      value={project.objectives}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    ></textarea>
                  </label>
                </div>
                {/* Timeline */}
                <div className="mb-8">
                  <label className="flex flex-col">
                    <span className="font-bold">Timeline (in Months):</span>
                    <input
                      type="text"
                      name="timeline"
                      value={project.timeline}
                      onChange={handleChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md"
                    />
                  </label>
                </div>

                {/* Resources Required */}
                {/* Render Resources for each Resource Type */}
                <h1 className="font-bold text-lg">Resources Required</h1>
                {resourceTypes.map((resourceType) => (
                  <div key={resourceType}>
                    <div className="mb-6">
                      <h5 className="text-md font-bold mb-2">
                        {resourceType?.charAt(0).toUpperCase() +
                          resourceType?.slice(1)}{" "}
                        Required
                      </h5>
                      {project.resourcesRequired[resourceType].map(
                        (resource, index) => (
                          <div
                            key={index}
                            className="flex mb-2 flex-col items-center my-4"
                          >
                            <h5>Number {index + 1}</h5>
                            <div className="flex flex-row mb-2">
                              <input
                                type="text"
                                name="name"
                                value={resource.name}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 mr-2"
                                placeholder="Name of Resource"
                              />
                              <input
                                type="text"
                                name="cost"
                                value={resource.cost}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                                placeholder="Cost"
                              />
                            </div>
                            <div className="flex flex-row mx-4 items-center">
                              <input
                                type="text"
                                name="gteRequired"
                                placeholder="GTE Required"
                                checked={resource.gteRequired}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                              />
                              <input
                                type="text"
                                name="throughGeM"
                                placeholder="Through GeM"
                                checked={resource.throughGeM}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                              />
                              <input
                                type="text"
                                name="year1"
                                value={resource.year1}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                placeholder="Year 1"
                              />
                              <input
                                type="text"
                                name="year2"
                                value={resource.year2}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                placeholder="Year 2"
                              />
                              <input
                                type="text"
                                name="year3"
                                value={resource.year3}
                                onChange={(e) =>
                                  handleResourceChange(e, index, resourceType)
                                }
                                className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                placeholder="Year 3"
                              />
                            </div>
                            {isAdmin && (
                              <div className="flex flex-col my-4">
                                <div className="flex flex-row items-center">
                                  <input
                                    type="text"
                                    name="indentingDate"
                                    value={resource.indentingDate}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="Indenting Date"
                                  />
                                  <input
                                    type="text"
                                    name="indenter"
                                    value={resource.indenter}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="Indenter"
                                  />
                                  <input
                                    type="text"
                                    name="indentCost"
                                    value={resource.indentCost}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="Indent Cost"
                                  />
                                  <input
                                    type="text"
                                    name="gteProposalDate"
                                    value={resource.gteProposalDate}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="GTE Proposal Date"
                                  />
                                </div>
                                <div className="flex flex-row items-center">
                                  <input
                                    type="text"
                                    name="gteReceivedDate"
                                    value={resource.gteReceivedDate}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="GTE Received Date"
                                  />
                                  <input
                                    type="text"
                                    name="equipmentReceived"
                                    value={resource.equipmentReceived}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="Equipment Received"
                                  />
                                  <input
                                    type="text"
                                    name="inventoryDBUpdated"
                                    value={resource.inventoryDBUpdated}
                                    onChange={(e) =>
                                      handleResourceChange(
                                        e,
                                        index,
                                        resourceType
                                      )
                                    }
                                    className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                                    placeholder="Inventory DB Updated"
                                  />
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      )}
                      <button
                        type="button"
                        onClick={() => addResource(resourceType)}
                        className="px-4 py-2 mx-4 bg-blue-600 text-white rounded-md hover:scale-110 duration-300"
                      >
                        Add{" "}
                        {resourceType?.charAt(0).toUpperCase() +
                          resourceType?.slice(1)}
                      </button>
                      <button
                        type="button"
                        onClick={() => removeLastResource(resourceType)}
                        className="px-4 py-2 mx-4 bg-red-600 text-white rounded-md hover:scale-110 duration-300"
                      >
                        Remove Last
                      </button>
                    </div>
                  </div>
                ))}

                {/* Manpower */}
                <div className="mb-4">
                  <h3 className="text-lg font-bold mb-2">Manpower</h3>

                  {/* Existing manpower fields */}
                  {manpowerFields.map((manpower, index) => (
                    <div key={index} className="flex mb-2 flex-col">
                      <div className="flex flex-row mx-2 my-2 items-center">
                        <input
                          type="text"
                          name={`manpower[${index}].name`}
                          value={manpower.name}
                          onChange={(e) =>
                            handleManpowerChange(index, "name", e.target.value)
                          }
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded mr-2"
                          placeholder="Name"
                        />
                        <input
                          type="text"
                          name={`manpower[${index}].cost`}
                          value={manpower.cost}
                          onChange={(e) =>
                            handleManpowerChange(index, "cost", e.target.value)
                          }
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded mr-2"
                          placeholder="Cost"
                        />
                        <input
                          type="text"
                          name={`manpower[${index}].gteRequired`}
                          value={manpower.gteRequired}
                          onChange={(e) =>
                            handleManpowerChange(
                              index,
                              "gteRequired",
                              e.target.value
                            )
                          }
                          className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                          placeholder="GTE Required"
                        />
                      </div>
                      {isAdmin && (
                        <div className="flex flex-row items-center mx-4 my-2">
                          <input
                            type="text"
                            name={`manpower[${index}].interviewDate`}
                            value={manpower.interviewDate}
                            onChange={(e) =>
                              handleManpowerChange(
                                index,
                                "interviewDate",
                                e.target.value
                              )
                            }
                            className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                            placeholder="I  nterview Date"
                          />
                          <input
                            type="text"
                            name={`manpower[${index}].candidateName`}
                            value={manpower.candidateName}
                            onChange={(e) =>
                              handleManpowerChange(
                                index,
                                "candidateName",
                                e.target.value
                              )
                            }
                            className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                            placeholder="Candidate Name"
                          />
                          <input
                            type="text"
                            name={`manpower[${index}].joiningDate`}
                            value={manpower.joiningDate}
                            onChange={(e) =>
                              handleManpowerChange(
                                index,
                                "joiningDate",
                                e.target.value
                              )
                            }
                            className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                            placeholder="Joining Date"
                          />
                          <input
                            type="text"
                            name={`manpower[${index}].leavingDate`}
                            value={manpower.leavingDate}
                            onChange={(e) =>
                              handleManpowerChange(
                                index,
                                "leavingDate",
                                e.target.value
                              )
                            }
                            className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                            placeholder="Leaving Date"
                          />
                        </div>
                      )}
                    </div>
                  ))}

                  {/* Button to add more manpower fields */}
                  <button
                    type="button"
                    onClick={addManpowerField}
                    className="bg-blue-600 text-white px-4 py-2 rounded hover:scale-110 duration-300"
                  >
                    Add Manpower
                  </button>
                </div>

                {/* Budget */}
                <div>
                  <h3 className="text-lg font-bold mb-2">Budget</h3>
                  <div className="mb-6">
                    <h5 className="text-md font-bold mb-2">Non-Recurring</h5>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        name="nonRecurring.equipment" // Update field name
                        value={project.budget.nonRecurring.equipment}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 mr-4"
                        placeholder="Equipment Cost"
                      />
                      <input
                        type="text"
                        name="nonRecurring.works" // Update field name
                        value={project.budget.nonRecurring.works}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                        placeholder="Works Cost"
                      />
                    </div>
                    <input
                      type="text"
                      name="nonRecurring.subTotal" // Update field name
                      value={project.budget.nonRecurring.subTotal}
                      onChange={handleBudgetChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                      placeholder="Sub-Total"
                    />
                  </div>

                  <div className="mb-6">
                    <h5 className="text-md font-bold mb-2">Recurring</h5>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        name="recurring.travel" // Update field name
                        value={project.budget.recurring.travel}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 mr-4"
                        placeholder="Travel Cost"
                      />
                      <input
                        type="text"
                        name="recurring.consumable" // Update field name
                        value={project.budget.recurring.consumable}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                        placeholder="Consumable Cost"
                      />
                    </div>
                    <div className="flex mb-2">
                      <input
                        type="text"
                        name="recurring.contingency" // Update field name
                        value={project.budget.recurring.contingency}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 mr-4"
                        placeholder="Contingency Cost"
                      />
                      <input
                        type="text"
                        name="recurring.ORE" // Update field name
                        value={project.budget.recurring.ORE}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                        placeholder="ORE Cost"
                      />
                    </div>
                    <input
                      type="text"
                      name="recurring.subTotal" // Update field name
                      value={project.budget.recurring.subTotal}
                      onChange={handleBudgetChange}
                      className="mt-1 p-2 border border-gray-300 rounded-md w-1/2"
                      placeholder="Sub-Total"
                    />
                  </div>

                  <div>
                    <label className="flex flex-col">
                      <span className="font-bold">Grand Total:</span>
                      <input
                        type="text"
                        name="total"
                        value={project.budget.total}
                        onChange={handleBudgetChange}
                        className="mt-1 p-2 border border-gray-300 rounded-md"
                      />
                    </label>
                  </div>
                </div>
                
                <div className="flex justify-center bottom-8 align-middle items-center">
                  <button
                    className="bg-red-400 hover:bg-red-500 mx-4 px-3 py-2 rounded"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <div>
                    <button
                      type="submit"
                      className=" my-8 px-4 py-2 bg-green-600 font-light hover:scale-110 duration-300 text-lg text-white rounded-md"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </form>
            </div>

            <h3 className="text-sm text-red-900 mt-4">
              **Note: Saving would <strong>replace</strong> the data in the
              database with the data you filled in the above form.
            </h3>
            <i className="text-sm text-red-900 mb-10">
              Make sure that you haven't deleted any useful data by mistake
              before submitting!
            </i>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProject;
