import { type SidebarItem } from "../Types/typeSidebarItem";

export const sidebarItems: SidebarItem[] = [
  {
    title: 'Dashboard',
    icon: 'dashboard',
    route: '/admin/dashboard',
    active: false, 
  },
  {
    title: 'Gebruikers',
    icon: 'users',
    route: '/admin/users',
    active: true, 
  },
  {
    title: 'Formulieren',
    icon: 'form',
    route: '/admin/forms',
    active: true, 
  },
  {
    title: 'Inzendingen',
    icon: 'mail',
    route: '/admin/submissions',
    active: true,
  },
  {
    title: 'Uitnodigen',
    icon: 'plus',
    route: '/admin/invite',
    active: true, 
  },
  {
    title: 'Instellingen',
    icon: 'settings',
    route: '/admin/settings',
    active: true, 
  },
];