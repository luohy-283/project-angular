export interface MenuItem {
  label: string;
  path: string;
  icon: string;
}

export const MENU_ITEMS: MenuItem[] = [
  { label: 'Dashboard', path: '/dashboard', icon: 'dashboard' },
  { label: 'Claims', path: '/claims', icon: 'assignment' },
  { label: 'Users', path: '/users', icon: 'people' }
];
