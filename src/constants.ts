import { EventItem, GroupItem, CityData } from './types';

export const INITIAL_EVENTS: EventItem[] = [
  {
    id: '1',
    name: 'Culto de Celebração',
    link: '#',
    coverImage: 'https://picsum.photos/id/122/800/450',
    order: 1,
    active: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2025-12-31'
  },
  {
    id: '2',
    name: 'Conferência de Jovens',
    link: '#',
    coverImage: 'https://picsum.photos/id/143/800/450',
    order: 2,
    active: true,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '2025-10-15'
  },
  {
    id: '3',
    name: 'Escola Dominical',
    link: '#',
    coverImage: 'https://picsum.photos/id/160/800/450',
    order: 3,
    active: true,
    startDate: '',
    endDate: ''
  },
  {
    id: '4',
    name: 'Evento Passado (Inativo)',
    link: '#',
    coverImage: 'https://picsum.photos/id/180/800/450',
    order: 4,
    active: false,
    startDate: '2023-01-01',
    endDate: '2023-02-01'
  }
];

export const GROUPS_DATA: GroupItem[] = [
  {
    id: 'g1',
    city: 'pedro-leopoldo',
    neighborhood: 'lagoa-do-santo-antonio',
    address: 'Lagoa do Santo Antônio, Pedro Leopoldo',
    leaders: 'Will & Jessica',
    phone: '(31) 99680-7292',
    contactLink: 'https://wa.me/5531996807292'
  },
  {
    id: 'g2',
    city: 'pedro-leopoldo',
    neighborhood: 'maria-candida',
    address: 'Maria Cândida, Pedro Leopoldo',
    leaders: 'Daniel & Valéria',
    phone: '(31) 98394-3584',
    contactLink: 'https://wa.me/5531983943584'
  },
  {
    id: 'g3',
    city: 'matozinhos',
    neighborhood: 'mocambeiro',
    address: 'Mocambeiro, Matozinhos',
    leaders: 'Altamiro',
    phone: '(31) 99825-1517',
    contactLink: 'https://wa.me/5531998251517'
  },
  {
    id: 'g4',
    city: 'vespasiano',
    neighborhood: 'caieiras',
    address: 'Caieiras, Vespasiano',
    leaders: 'Wagner & Regiele',
    phone: '(31) 99740-1124',
    contactLink: 'https://wa.me/5531997401124'
  },
  {
    id: 'g5',
    city: 'pedro-leopoldo',
    neighborhood: 'morada-dos-hibiscos',
    address: 'Morada dos Hibiscos, Pedro Leopoldo',
    leaders: 'Ednei & Magda',
    phone: '(31) 99337-5171',
    contactLink: 'https://wa.me/5531993375171'
  },
  {
    id: 'g6',
    city: 'pedro-leopoldo',
    neighborhood: 'centro',
    address: 'Centro, Pedro Leopoldo',
    leaders: 'Pedro & Letícia',
    phone: '(31) 97127-6068',
    contactLink: 'https://wa.me/5531971276068'
  },
  {
    id: 'g7',
    city: 'matozinhos',
    neighborhood: 'centro',
    address: 'Centro, Matozinhos',
    leaders: 'Haroldo & Elcinára',
    phone: '(31) 98741-6151',
    contactLink: 'https://wa.me/5531987416151'
  }
];

export const CITIES: Record<string, string> = {
  'pedro-leopoldo': 'Pedro Leopoldo',
  'matozinhos': 'Matozinhos',
  'vespasiano': 'Vespasiano'
};

export const NEIGHBORHOODS: CityData = {
  'pedro-leopoldo': [
    { value: 'lagoa-do-santo-antonio', label: 'Lagoa do Santo Antônio' },
    { value: 'maria-candida', label: 'Maria Cândida' },
    { value: 'morada-dos-hibiscos', label: 'Morada dos Hibiscos' },
    { value: 'centro', label: 'Centro' }
  ],
  'matozinhos': [
    { value: 'mocambeiro', label: 'Mocambeiro' },
    { value: 'centro', label: 'Centro' }
  ],
  'vespasiano': [
    { value: 'caieiras', label: 'Caieiras' }
  ]
};
