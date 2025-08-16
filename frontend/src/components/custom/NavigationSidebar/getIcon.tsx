import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  Bot,
  LetterText,
  User,
} from "lucide-react";

export const getIcon = (iconName: string) => {
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
    case "letter-text":
      return <LetterText size={20} />;
    case "user":
      return <User size={20} />;
    default:
      return <Settings size={20} />;
  }
};
