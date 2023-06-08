import React, { useState, useEffect } from "react";
import { HiMenuAlt3, HiLogout } from "react-icons/hi";
import { MdDashboard } from "react-icons/md";
import { AiFillSetting } from "react-icons/ai";
import { FaPenSquare } from "react-icons/fa";
import ceeriLogo from "../../assets/images/Central_Electronics_Engineering_Research_Institute_Logo.png";
import admins from "../../loginPage/UserData";
import {
  BsFileBarGraphFill,
  BsFillCalendarWeekFill,
  BsChatTextFill,
  BsFillCheckCircleFill,
} from "react-icons/bs";
import { MdEmail, MdAssignmentAdd } from "react-icons/md";

export default function SideNav({ setNavigator, setSearchTerm }) {
  const onClickAction = (menu) => {
    setNavigator(menu.name);
    setSearchTerm("");
  };

  const logout = () => {
    localStorage.clear();
    window.location.reload();
  };

  const menus = [
    {
      name: "Dashboard",
      icon: MdDashboard,
      OnClick: onClickAction,
    },
    {
      name: "Projects",
      icon: FaPenSquare,
      OnClick: onClickAction,
    },
    {
      name: "Add Project",
      icon: MdAssignmentAdd,
      OnClick: onClickAction,
    },
    {
      name: "My Tasks",
      icon: BsFileBarGraphFill,
      OnClick: onClickAction,
    },
    {
      name: "Calendar",
      icon: BsFillCalendarWeekFill,
      OnClick: onClickAction,
    },
    {
      name: "Equipment",
      icon: MdEmail,
      OnClick: onClickAction,
    },
    {
      name: "Consumables",
      icon: BsChatTextFill,
      OnClick: onClickAction,
    },
    {
      name: "Settings",
      icon: AiFillSetting,
      OnClick: onClickAction,
    },
    {
      name: "Repost",
      icon: BsFillCheckCircleFill,
      OnClick: onClickAction,
    },
    {
      name: "Logout",
      icon: HiLogout,
      OnClick: logout,
      margin: true,
    },
  ];

  const adminMenus = [

  ];

  const [open, setOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("Dashboard");

  useEffect(() => {
    setNavigator(activeTab);
  }, [activeTab]);

  const userIsAdmin = admins.hasOwnProperty(localStorage.getItem("email"));

  return (
    <div
      className={`bg-[#e7e2e1] overflow-y-auto overflow-x-hidden h-screen fixed   ${
        open ? "w-1/6" : "w-16"
      } duration-500 text-black px-4 z-0`}
      style={{ marginTop: "15px" }}
    >
      <div className="flex flex-row mx-4 items-center top-10 ld:left-10 sm:left-6 md:left-8">
        <a href="https://www.ceeri.res.in/" target="_blank">
          <img src={ceeriLogo} className=" w-16 cursor-pointer rounded-full " />
        </a>
        <h1 className="mx-10 font-extrabold text-xl tracking-widest">PME</h1>
      </div>
      <div className="my-12 flex flex-col gap-4 relative mx-auto">
        {(userIsAdmin ? [...adminMenus, ...menus] : menus).map((menu, i) => (
          <button
            to={menu?.link}
            key={i}
            className={` ${
              menu?.margin && "mt-5"
            } group flex items-center text-sm  gap-3.5 font-medium p-2 transition-all duration-300 hover:scale-110 rounded-md ${
              activeTab === menu.name
                ? "bg-gray-600 text-teal-300 scale-110"
                : "hover:bg-gray-600 hover:text-yellow-300"
            }`}
            onClick={() => {
              setActiveTab(menu.name);
              menu.OnClick(menu);
            }}
          >
            <div>{React.createElement(menu?.icon, { size: "20" })}</div>
            <h2
              className={`whitespace-pre cursor-pointer ${
                !open && "opacity-0 translate-x-28 overflow-hidden"
              }`}
            >
              {menu?.name}
            </h2>
            <h2
              className={`${
                open && "hidden"
              } absolute left-48 bg-white font-semibold whitespace-pre text-gray-900 rounded-md drop-shadow-lg px-0 py-0 w-0 overflow-hidden group-hover:px-2 group-hover:py-1 group-hover:left-14 group-hover:duration-300 group-hover:w-fit  `}
            >
              {menu?.name}
            </h2>
          </button>
        ))}
      </div>
    </div>
  );
}
