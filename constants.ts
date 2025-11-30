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
    address: 'Rua Principal, 123, Lagoa',
    leaders: 'Will & Jessica',
    phone: '(31) 99680-7292',
    contactLink: 'https://wa.me/5531996807292'
  },
  {
    id: 'g2',
    city: 'pedro-leopoldo',
    neighborhood: 'centro',
    address: 'Av. Central, 500, Apto 102',
    leaders: 'Pr. João & Maria',
    phone: '(31) 99999-8888',
    contactLink: 'https://wa.me/5531999998888'
  },
  {
    id: 'g3',
    city: 'matozinhos',
    neighborhood: 'mocambeiro',
    address: 'Rua das Flores, 45',
    leaders: 'Carlos & Ana',
    phone: '(31) 98888-7777',
    contactLink: '#'
  },
  {
    id: 'g4',
    city: 'vespasiano',
    neighborhood: 'morro-alto',
    address: 'Rua da Colina, 88',
    leaders: 'Pedro & Tiago',
    phone: '(31) 97777-6666',
    contactLink: '#'
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
    { value: 'centro', label: 'Centro' },
    { value: 'maria-candida', label: 'Maria Cândida' }
  ],
  'matozinhos': [
    { value: 'mocambeiro', label: 'Mocambeiro' },
    { value: 'centro', label: 'Centro' }
  ],
  'vespasiano': [
    { value: 'morro-alto', label: 'Morro Alto' },
    { value: 'jardim-ita', label: 'Jardim Itaú' }
  ]
};
