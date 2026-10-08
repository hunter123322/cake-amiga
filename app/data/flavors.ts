import type { Flavor } from '~/types/cake'

export const FLAVORS: Flavor[] = [
  {
    id: 'vanilla',
    name: 'Vanilla Bean',
    sponge: '#f4dcae',
    cream: '#fff7e6',
    accent: '#d9a85c',
    priceMultiplier: 1,
  },
  {
    id: 'chocolate',
    name: 'Chocolate Fudge',
    sponge: '#6b4230',
    cream: '#b08155',
    accent: '#3f2418',
    priceMultiplier: 1.15,
  },
  {
    id: 'red-velvet',
    name: 'Red Velvet',
    sponge: '#a92338',
    cream: '#fbeeea',
    accent: '#7c1526',
    priceMultiplier: 1.2,
  },
  {
    id: 'lemon',
    name: 'Lemon Zest',
    sponge: '#f5da6d',
    cream: '#fffbe0',
    accent: '#d8ac2c',
    priceMultiplier: 1.05,
  },
  {
    id: 'strawberry',
    name: 'Strawberry',
    sponge: '#ef9fb4',
    cream: '#fff0f4',
    accent: '#cf5177',
    priceMultiplier: 1.05,
  },
  {
    id: 'pistachio',
    name: 'Pistachio',
    sponge: '#b9d474',
    cream: '#f3f8de',
    accent: '#7d9a36',
    priceMultiplier: 1.25,
  },
  {
    id: 'coffee',
    name: 'Coffee Mocha',
    sponge: '#c2946c',
    cream: '#f7e9db',
    accent: '#6f4a2b',
    priceMultiplier: 1.1,
  },
  {
    id: 'funfetti',
    name: 'Funfetti',
    sponge: '#fdf3f7',
    cream: '#ffe9f3',
    accent: '#ff6fa5',
    priceMultiplier: 1.15,
  },
]

export const getFlavor = (id: string): Flavor =>
  FLAVORS.find((f) => f.id === id) ?? FLAVORS[0]!
