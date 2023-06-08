import React, { useState } from "react";
import admins from "../../loginPage/UserData";
class Project {
  constructor(isAdmin) {
    this.projectTitle = "";
    this.projectNo = "";
    this.projectInvestigator = "";
    this.coPI = "";
    this.teamMembers = [];
    this.objectives = "";
    this.timeline = "";
    this.resourcesRequired = {
      equipment: [
        {
          name: "",
          cost: "",
          gteRequired: "",
          throughGeM: "",
          year1: "",
          year2: "",
          year3: "",
          indentingDate: isAdmin ? "" : undefined,
          indenter: isAdmin ? "" : undefined,
          indentCost: isAdmin ? "" : undefined,
          gteProposalDate: isAdmin ? "" : undefined,
          gteReceivedDate: isAdmin ? "" : undefined,
          equipmentReceived: isAdmin ? "" : undefined,
          inventoryDBUpdated: isAdmin ? "" : undefined,
        },
      ],
      consumables: [
        {
          name: "",
          cost: "",
          gteRequired: "",
          throughGeM: "",
          year1: "",
          year2: "",
          year3: "",
          indentingDate: isAdmin ? "" : undefined,
          indenter: isAdmin ? "" : undefined,
          indentCost: isAdmin ? "" : undefined,
          gteProposalDate: isAdmin ? "" : undefined,
          gteReceivedDate: isAdmin ? "" : undefined,
          equipmentReceived: isAdmin ? "" : undefined,
        },
      ],
      services: [
        {
          name: "",
          cost: "",
          gteRequired: "",
          throughGeM: "",
          year1: "",
          year2: "",
          year3: "",
          indentingDate: isAdmin ? "" : undefined,
          indenter: isAdmin ? "" : undefined,
          indentCost: isAdmin ? "" : undefined,
          gteProposalDate: isAdmin ? "" : undefined,
          gteReceivedDate: isAdmin ? "" : undefined,
          equipmentReceived: isAdmin ? "" : undefined,
        },
      ],
      works: [
        {
          name: "",
          cost: "",
          gteRequired: "",
          throughGeM: "",
          year1: "",
          year2: "",
          year3: "",
          indentingDate: isAdmin ? "" : undefined,
          indenter: isAdmin ? "" : undefined,
          indentCost: isAdmin ? "" : undefined,
          gteProposalDate: isAdmin ? "" : undefined,
          gteReceivedDate: isAdmin ? "" : undefined,
          equipmentReceived: isAdmin ? "" : undefined,
        },
      ],
    };
    this.manpower = {
      proposedRequirement: {
        "PA-I": {
          techHR: "",
          level: "",
          cost: "",
          justification: "",
          year1: "",
          year2: "",
          year3: "",
        },
        "PA-II": {
          techHR: "",
          level: "",
          cost: "",
          justification: "",
          year1: "",
          year2: "",
          year3: "",
        },
        "PA-III": {
          techHR: "",
          level: "",
          cost: "",
          justification: "",
          year1: "",
          year2: "",
          year3: "",
        },
      },
      interviewDate: isAdmin ? "" : undefined,
      candidateName: isAdmin ? "" : undefined,
      joiningDate: isAdmin ? "" : undefined,
      leavingDate: isAdmin ? "" : undefined,
    };
    this.budget = {
      nonRecurring: {
        equipment: "",
        works: "",
        subTotal: "",
      },
      recurring: {
        travel: "",
        consumable: "",
        contingency: "",
        ORE: "",
        subTotal: "",
      },
      total: "",
    };
  }
}

const AddProject = () => {
  const isAdmin = isAdminUser(localStorage.getItem("email"));

  function isAdminUser(e) {
    if (admins[e]) {
      // console.log("true", e);
      return true;
    } else {
      // console.log("false", e);
      return false;
    }
  }
  const [project, setProject] = useState(new Project(isAdmin));

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "teamMembers") {
      const newValue = value.split("\n");
      setProject((prevProject) => ({
        ...prevProject,
        [name]: newValue,
      }));
    } else if (name.startsWith("budget.")) {
      const [category, subCategory] = name.split(".").slice(1);
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
        throughGem: "",
        year1: "",
        year2: "",
        year3: "",
        indentingDate: "",
        indenter: "",
        indentCost: "",
        gteProposalDate: "",
        gteReceivedDate: "",
        resourceReceived: "",
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

  const handleBudgetChange = (e) => {
    const { name, value } = e.target;
    setProject((prevProject) => ({
      ...prevProject,
      budget: {
        nonRecurring: {
          ...(prevProject.budget?.nonRecurring || {}),
          [name]: value,
        },
        recurring: {
          ...(prevProject.budget?.recurring || {}),
          [name]: value,
        },
      },
    }));
  };

  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (formSubmitted) {
      console.log("Form has already been submitted.");
      return;
    }

    // Set the flag to true to prevent multiple submissions
    setFormSubmitted(true);

    try {
      // Construct the JSON data manually
      const jsonData = JSON.stringify({
        ...project,
        teamMembers: project.teamMembers.join("\n"),
      });

      // Set up the fetch request
      const url = "http://localhost:5984/projects_pme";
      const headers = new Headers();
      headers.append("Content-Type", "application/json");
      headers.append(
        "Authorization",
        "Basic " + btoa(process.env.REACT_APP_COUCHDB_USERNAME_AND_PASSWORD) // Replace with your actual username and password
      );

      const response = await fetch(url, {
        method: "POST",
        headers: headers,
        body: jsonData,
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

  return (
    <div className="mt-8 flex flex-col items-center">
      <h2 className="text-2xl font-bold mb-8 flex flex-row mx-auto">
        Add New Project
      </h2>
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
              value={project.teamMembers.join("\n")}
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
                {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}{" "}
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
                        name="resourceName"
                        value={resource.resourceName}
                        onChange={(e) =>
                          handleResourceChange(e, index, resourceType)
                        }
                        className="mt-1 p-2 border border-gray-300 rounded-md w-1/2 mr-2"
                        placeholder="Name of Resource"
                      />
                      <input
                        type="text"
                        name="resourceCost"
                        value={resource.resourceCost}
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
                              handleResourceChange(e, index, resourceType)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                            placeholder="Indenting Date"
                          />
                          <input
                            type="text"
                            name="indenter"
                            value={resource.indenter}
                            onChange={(e) =>
                              handleResourceChange(e, index, resourceType)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                            placeholder="Indenter"
                          />
                          <input
                            type="text"
                            name="indentCost"
                            value={resource.indentCost}
                            onChange={(e) =>
                              handleResourceChange(e, index, resourceType)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                            placeholder="Indent Cost"
                          />
                          <input
                            type="text"
                            name="gteProposalDate"
                            value={resource.gteProposalDate}
                            onChange={(e) =>
                              handleResourceChange(e, index, resourceType)
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
                              handleResourceChange(e, index, resourceType)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                            placeholder="GTE Received Date"
                          />
                          <input
                            type="text"
                            name="equipmentReceived"
                            value={resource.equipmentReceived}
                            onChange={(e) =>
                              handleResourceChange(e, index, resourceType)
                            }
                            className="mt-1 p-2 border border-gray-300 rounded-md w-[1/8]"
                            placeholder="Equipment Received"
                          />
                          <input
                            type="text"
                            name="inventoryDBUpdated"
                            value={resource.inventoryDBUpdated}
                            onChange={(e) =>
                              handleResourceChange(e, index, resourceType)
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
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:scale-110 duration-300"
              >
                Add{" "}
                {resourceType.charAt(0).toUpperCase() + resourceType.slice(1)}
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
                    handleManpowerChange(index, "gteRequired", e.target.value)
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
                    placeholder="Interview Date"
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
                      handleManpowerChange(index, "joiningDate", e.target.value)
                    }
                    className="w-1/3 px-3 py-2 border border-gray-300 rounded"
                    placeholder="Joining Date"
                  />
                  <input
                    type="text"
                    name={`manpower[${index}].leavingDate`}
                    value={manpower.leavingDate}
                    onChange={(e) =>
                      handleManpowerChange(index, "leavingDate", e.target.value)
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

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className=" my-8 px-4 py-2 bg-green-600 font-light hover:scale-110 duration-300 text-lg text-white rounded-md"
          >
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddProject;
