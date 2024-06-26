import React, { useState, useEffect } from "react";
import EditProject from "./EditProject";
import {
  BsFileBarGraphFill,
  BsPlusSquareDotted,
  BsPersonCircle,
} from "react-icons/bs";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import recentActivity from "./recentActivity.json";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import Card from "./Card";
import Project from "./CurrentProject";
import data from "./data.json";
import projectsData from "./Projects.json";
import "./Content2.css";
import admins from "../../loginPage/UserData";

const ProjectList = ({ projects, handleProjectClick }) => {
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    function isAdminUser(e) {
      if (admins[e]) {
        return true;
      } else {
        return false;
      }
    }
    setIsAdmin(isAdminUser(localStorage.getItem("email")));
  }, []);

  const closeModal = () => {
    setSelectedProject(null);
    setShowModal(false);
  };

  return (
    <div className="flex flex-col mx-auto">
      <div className="flex flex-row items-center align-middle justify-center my-8">
        <h1 className="font-bold text-xl">My Projects</h1>
      </div>

      {projects.map((project, index) => (
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
                  ? Array.from(project.projectInvestigator).join(", ")
                  : project.projectInvestigator}
              </p>
              <p className="mx-6 text-sm">|</p>
              <p className="mx-6 text-sm">
                Co-Investigators:{" "}
                {Array.isArray(project.coPI)
                  ? Array.from(project.coPI).join(", ")
                  : project.coPI}
              </p>{" "}
            </div>
          </div>
          <div>
            <button
              className="bg-green-400 px-3 py-2 rounded-full text-sm italic"
              onClick={() => handleProjectClick(project.projectType)}
            >
              More Details
            </button>
          </div>
        </div>
      ))}

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

            {/* Add the necessary code to display the remaining project details */}

            <div className="">
              <button
                className="bg-red-400 px-3 py-2 rounded mt-4 mx-10"
                onClick={closeModal}
              >
                Close
              </button>
              {isAdmin && (
                <EditProject
                  projectToEdit={selectedProject}
                  id={selectedProject._id}
                  rev={selectedProject._rev}
                />
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const Dashboard = () => {
  const [selected, setSelected] = useState(null);
  const [projects, setProjects] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const genres = [
    { title: "My Project", value: "my project" },
    { title: "K-Pop", value: "k pop" },
    { title: "Country", value: "country" },
    { title: "Dance", value: "dance" },
    { title: "Alternative", value: "alternative" },
    { title: "Electronic", value: "electronic" },
    { title: "Rock", value: "rock" },
    { title: "Pop", value: "pop" },
    { title: "Soul", value: "soul" },
    { title: "Worldwide", value: "worldwide" },
  ];
  
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
          const projectIds = data.rows.map((row) => row.id);

          const projectRequests = projectIds.map(async (id) => {
            const projectUrl = `http://localhost:5984/${process.env.REACT_APP_COUCHDB_DBNAME}/${id}`;
            const projectResponse = await fetch(projectUrl, {
              method: "GET",
              headers: headers,
            });
            if (projectResponse.ok) {
              const projectData = await projectResponse.json();
              return projectData;
            }
          });

          const projectDataArray = await Promise.all(projectRequests);
          setProjects(projectDataArray.filter(Boolean));
        }
      } catch (error) {
        console.error("Error fetching projects:", error);
      }
    };

    fetchData();
  }, []);

  const handleProjectClick = (projectType) => {
    const filteredProjects = projects.filter(
      (project) => project.projectType === projectType
    );
    setSelected(filteredProjects);
    setShowModal(true);
  };
  const [selectedProject, setSelectedProject] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleGenreChange = (e) => {
    setSelected(e.target.value);
  };

  useEffect(() => {
    function isAdminUser(e) {
      if (admins[e]) {
        return true;
      } else {
        return false;
      }
    }
    setIsAdmin(isAdminUser(localStorage.getItem("email")));
  }, []);

  return (
    <div className="flex flex-col mt-[5%] -z-50">
      <div className="flex-1 w-full h-[1/8] items-center top-20 text-left p-6 left-20 flex flex-row">
        {/* First Div */}
        <div className="flex flex-1 flex-col">
          <h1 className="font-extrabold text-lg">Dashboard</h1>
          <h1 className="text-black/95 text-base">
            Hi, {localStorage.getItem("displayName")}
          </h1>
          <h1 className="text-black/60 text-sm">
            Welcome to Project Management Dashboard
          </h1>
        </div>
        <div className="right-[5%] flex flex-row items-center align-middle">
          <select
            defaultValue={genres[0]}
            value={selected}
            onChange={(e) => {
              setSelected(e.target.value);
            }}
            className="bg-[#F2F2F2] text-black font-semibold p-3 mr-1 text-sm rounded-lg outline-none sm:mt-0 mt-5"
          >
            {genres.map((genre) => (
              <option key={genre.value} value={genre.value}>
                {genre.title}
              </option>
            ))}
          </select>
          <div className="bg-[#F2F2F2] mx-6 w-10 h-10 rounded-xl flex">
            <button>
              <BsFileBarGraphFill className="w-10 h-7 my-auto" />
            </button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-[#F2F2F2] my-4">
        <div className="flex flex-row h-1/2 my-4">
          <div className="w-2/3">
            {/* First Div */}
            <div className="h-full flex flex-col">
              <h1 className="font-semibold">Project Statistics</h1>
              <div className="flex flex-col overflow-y-scroll ">
                {projectsData.map((project) => (
                  <button>
                    <Project key={project.id} project={project} />
                  </button>
                ))}
              </div>
            </div>
          </div>
          <div className="w-1/3">
            {/* Second Div */}
            <div className="h-full flex flex-col items-center justify-center custom-calendar-container">
              <h1 className="font-bold">Calendar</h1>
              <Calendar className="bg-[#CCC1BE]" />
            </div>
          </div>
        </div>
        <div className="flex flex-row h-1/2 my-4">
          <div className="w-full flex flex-row">
            {/* Third Div */}
            <div className="h-full w-2/3 flex flex-col items-center justify-center">
              <h1 className="font-semibold">Project Deliveries</h1>
              <LineChart width={500} height={200} data={data.dataPoints}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="x" />
                <YAxis />
                <Tooltip />
                <Legend align="right" verticalAlign="top" />
                <Line
                  type="monotone"
                  dataKey="Target"
                  stroke="#8884d8"
                  name="Target"
                  strokeWidth={4}
                />
                <Line
                  type="monotone"
                  dataKey="Achieved"
                  stroke="#82ca9d"
                  name="Achieved"
                  strokeWidth={4}
                />
              </LineChart>
            </div>
            <div className="h-full flex flex-col items-center justify-center w-1/3">
              <h1 className="font-bold">Events</h1>
              <div className="flex flex-row px-2 my-auto items-center">
                <div className="w-3/5">
                  <button>
                    <Card title="Monthly Report" subtitle="30th June" />
                  </button>
                </div>
                <div className="w-2/5">
                  <button>
                    <div className="bg-white flex-1 flex w-full h-full p-4 shadow-md rounded-lg">
                      <BsPlusSquareDotted className="w-8 h-8 flex flex-1 mx-auto my-auto" />
                    </div>
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col gap-4 w-1/3 mr-[5%]">
            <h1 className="font-bold">Activities</h1>
            {recentActivity.map((activity, index) => (
              <div
                key={index}
                className="bg-white p-4 shadow-md rounded-lg flex items-center"
              >
                <div className="mr-4">
                  <BsPersonCircle size={24} />
                </div>
                <div className="text-left">
                  <h2 className="font-semibold text-sm">{activity.title}</h2>
                  <p className="text-xs text-slate-500">{`${activity.subtitle.date} | ${activity.subtitle.time}`}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
