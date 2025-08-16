import { type SidebarItem } from "../Types/typeSidebarItem";

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
  },
  {
    title: 'Users',
    icon: 'users',
    route: '/admin/users',
  },
  {
    title: 'Forms',
    icon: 'form',
    route: '/admin/forms',
  },
  {
    title: 'Submissions',
    icon: 'mail',
    route: '/admin/submissions',
  },
  {
    title: 'AI Assistant',
    icon: 'bot',
    route: '/admin/assistant',
  },
  {
    title: 'Settings',
    icon: 'settings',
    route: '/admin/settings',
  },
];