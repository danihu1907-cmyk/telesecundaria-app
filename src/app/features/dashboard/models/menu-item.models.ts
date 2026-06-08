export interface MenuItem {
  title: string;
  route: string;
  icon: string;
  group?: string;
}

export interface MenuGroup {
  label: string;
  items: MenuItem[];
}
