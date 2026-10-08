import type { AddOnDef, AddOnId } from '~/types/cake'

export const ADD_ONS: AddOnDef[] = [
  { id: 'addon-candles', name: 'Candle Pack', price: 6, blurb: 'Extra party candles for the top' },
  { id: 'addon-knife', name: 'Cake Knife', price: 8, blurb: 'Polished serving knife' },
  { id: 'addon-plates', name: 'Plates & Forks', price: 5, blurb: 'Place settings for eight' },
  { id: 'addon-card', name: 'Gift Card', price: 3, blurb: 'Handwritten note card' },
  { id: 'addon-box', name: 'Gift Box', price: 4, blurb: 'Sturdy carry box with window' },
]

export const getAddOn = (id: AddOnId): AddOnDef | undefined =>
  ADD_ONS.find((a) => a.id === id)
