import React, { useEffect, useState } from "react";
import SideNav from "../GUI/SideNav";
import Navbar from "../GUI/Navbar";
import Projects from "./Projects";
import MyTasks from "./MyTasks";
import Calendar from "./Calendar";
import Equipment from "./Equipment";
import Consumables from "./Consumables";
import Settings from "./Settings";
import Repost from "./Repost";
import Error from "./Error";
import Dashboard from "./Dashboard";
import AddProject from "./AddProject";
// import AddProjectPME from "./AddProjectPME";
import admins from "../../loginPage/UserData";
function Homepage() {
  const [navigator, setNavigator] = useState("Dashboard");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    admins[localStorage.getItem("email")]
      ? (document.title = "Admin PME - CEERI")
      : (document.title = "PME - CEERI");
  }, []);

  return (
    <div className="bg-[#e7e2e1] h-screen w-screen flex">
      {/* Sidebar */}
      <div className="w-1/6">
        <SideNav setNavigator={setNavigator} setSearchTerm={setSearchTerm} />
      </div>

      <div className="flex flex-col flex-1">
        <div className=" top-0 right-0 h-1/10 w-full">
          <Navbar
            setNavigator={setNavigator}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
        </div>
        <div className="flex-1 bg-[#F2F2F2] overflow-y-auto p-4 ml-1/6">
          {navigator === "Dashboard" ? (
            <Dashboard />
          ) : navigator === "Projects" ? (
            <Projects />
          ) : navigator === "My Tasks" ? (
            <MyTasks />
          ) : navigator === "Calendar" ? (
            <Calendar />
          ) : navigator === "Equipment" ? (
            <Equipment />
          ) : navigator === "Consumables" ? (
            <Consumables />
          ) : navigator === "Settings" ? (
            <Settings />
          ) : navigator === "Repost" ? (
            <Repost />
          ) : navigator === "Add Project" ? (
            <AddProject />
          ) : (
            <Error />
          )}
        </div>
      </div>
    </div>
  );
}

export default Homepage;
