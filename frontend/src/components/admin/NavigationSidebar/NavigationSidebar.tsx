import { useState } from "react";
import { NavLink } from "react-router-dom";
import "./NavigationSidebar.css";
import { sidebarItems } from "./SidebarItems";
import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  Bot,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

const getIcon = (iconName: string) => {
  switch (iconName) {
    case "dashboard":
      return <LayoutDashboard size={20} />;
    case "users":
      return <Users size={20} />;
    case "form":
      return <FileText size={20} />;
    case "settings":
      return <Settings size={20} />;
    case "mail":
      return <Mail size={20} />;
    case "bot":
      return <Bot size={20} />;
    default:
      return null;
  }
};

const NavigationSidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className={`navigation-sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <div className="sidebar-header">
        <h2>{!isCollapsed && "Admin Panel"}</h2>
        <button
          className="collapse-button"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="sidebar-nav">
        {sidebarItems.map((item) => (
          <NavLink
            key={item.route}
            to={item.route}
            className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}
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
