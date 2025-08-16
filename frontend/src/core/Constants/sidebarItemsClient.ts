import { type SidebarItem } from "../Types/typeSidebarItem";

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/dashboard/overview',
  },
  {
    title: 'Formulieren',
    icon: 'form',
    route: '/dashboard/forms',
  },
  {
    title: 'Gegenereerde Content',
    icon: 'letter-text',
    route: '/dashboard/generated-content',
  },
  {
    title: 'Inzendingen',
    icon: 'mail',
    route: '/dashboard/submissions',
  },
  {
    title: 'AI Assistent',
    icon: 'bot',
    route: '/dashboard/assistant',
  },
    {
    title: 'Profiel',
    icon: 'user',
    route: '/dashboard/profile',
  },
  {
    title: 'Instellingen',
    icon: 'settings',
    route: '/dashboard/settings',
  },
];