import React, { useEffect, useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavigationSidebar.css";
import { type SidebarItem } from "../../../core/Types/typeSidebarItem";
import { getIcon } from "../../../core/Utils/getIcon";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface NavigationsSidebarProps {
  sidebarTitle: string;
  sidebarItems: SidebarItem[];
}

const NavigationSidebar: React.FC<NavigationsSidebarProps> = ({
  sidebarItems,
  sidebarTitle,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    document.documentElement.style.setProperty(
      "--navigation-sidebar-width",
      isCollapsed ? "110px" : "280px"
    );
  }, [isCollapsed]);

  // Only display items with active === true
  const activeSidebarItems = sidebarItems.filter((item) => item.active);

  return (
    <div className={`navigation-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{!isCollapsed && sidebarTitle}</h2>
        <button
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {activeSidebarItems.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            className={({ isActive }) =>
              `nav-item ${isActive ? "active" : ""} ${
                isCollapsed ? "collapsed" : ""
              }`
            }
          >
            <span className="icon">{getIcon(item.icon)}</span>
            {!isCollapsed && <span className="title">{item.title}</span>}
          </NavLink>
        ))}
      </nav>
    </div>
  );
};

export default NavigationSidebar;
