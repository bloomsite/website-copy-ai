import {
  LayoutDashboard,
  Mail,
  Users,
  FileText,
  Settings,
  Bot,
  LetterText,
  User,
  Plus,
  Check,
} from "lucide-react";

export const getIcon = (iconName: string, size: number = 20) => {
  switch (iconName) {
    case "dashboard":
      return <LayoutDashboard size={size} />;
    case "users":
      return <Users size={size} />;
    case "form":
      return <FileText size={size} />;
    case "settings":
      return <Settings size={size} />;
    case "mail":
      return <Mail size={size} />;
    case "bot":
      return <Bot size={size} />;
    case "letter-text":
      return <LetterText size={size} />;
    case "user":
      return <User size={size} />;
    case "plus":
      return <Plus size={size} />;
    case "check":
      return <Check size={size} />;
    default:
      return <Settings size={size} />;
  }
};
