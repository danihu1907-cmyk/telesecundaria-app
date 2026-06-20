export interface MenuItem {
  title: string;
  route: string;
  icon: string;
}

export const INDEPENDENT_ITEMS: MenuItem[] = [
  {
    title: 'Escuela',
    route: '/dashboard/inicio',
    icon: 'lucideHouse',
  },
  {
    title: 'Expedientes',
    route: '/dashboard/expedientes',
    icon: 'lucideFileText',
  },
  {
    title: 'Usuarios',
    route: '/dashboard/usuarios',
    icon: 'lucideUsers',
  },
];

export interface MenuGroup {
  label: string;
  expanded: boolean;
  items: MenuItem[];
}

export const MENU_GROUPS: MenuGroup[] = [
  {
    label: 'Convocatorias',
    expanded: true,
    items: [
      { title: 'Convocatorias', route: '/dashboard/convocatorias', icon: 'lucideBookOpen' },
      { title: 'Aspirantes', route: '/dashboard/aspirantes', icon: 'lucideClipboardList' },
      { title: 'Revisiones', route: '/dashboard/revisiones', icon: 'lucideFileCheck' },
      { title: 'Adjunciones', route: '/dashboard/adjunciones', icon: 'lucideFolderPlus' },
    ],
  },
  {
    label: 'Inscripciones',
    expanded: true,
    items: [
      { title: 'Inscripciones', route: '/dashboard/inscripciones', icon: 'lucideGraduationCap' },
      { title: 'Citas', route: '/dashboard/citas', icon: 'lucideCalendarClock' },
      { title: 'Entregas', route: '/dashboard/entregas', icon: 'lucideFile' },
      { title: 'Cotejos', route: '/dashboard/cotejos', icon: 'lucideUsers' },
    ],
  },
  {
    label: 'Alumnos',
    expanded: false,
    items: [
      { title: 'Alumnos', route: '/dashboard/alumnos', icon: 'lucideGraduationCap' },
      { title: 'Grupos', route: '/dashboard/grupos', icon: 'lucideBoxes' },
      { title: 'Actividades', route: '/dashboard/actividades', icon: 'lucideBook' },
    ],
  },
];
