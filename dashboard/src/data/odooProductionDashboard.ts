import type { OdooProductionDashboardData } from '../types/odooProductionDashboard'

/** Snapshot from Odoo Production Dashboard (Licensed Apparel Ltd) */
export const odooProductionDashboard: OdooProductionDashboardData = {
  headlines: [
    { label: 'Open Items', value: 1901 },
    { label: 'Processed Today', value: 0 },
    { label: 'New Orders Items', value: 185 },
    { label: "Critically Aged MO's", value: 835, footnote: '*Older than 5 days' },
    { label: '% Critically Aged', value: '44%' },
  ],
  manufacturingStages: [
    { label: 'Awaiting Pick', value: 1016 },
    { label: 'Printing Stage', value: 26 },
    { label: 'Sorting Stage', value: 886 },
    { label: 'Shipped Today', value: 0 },
  ],
  printerThroughput: [
    { name: 'Printer 1', count: 108, model: 'Kornit Atlas Max' },
    { name: 'Printer 2', count: 70, model: 'Kornit Atlas Max' },
    { name: 'Printer 3', count: 0, model: 'Kornit Atlas Max Plus' },
    { name: 'Printer 4', count: 0, model: 'Kornit Atlas Max Plus' },
  ],
  topProducts: [
    { product: '[EA437R_EP16_STONEW/', orders: 742, qtyProduced: 777 },
    { product: '[EA437R_EP16_STONEW/', orders: 692, qtyProduced: 695 },
    { product: '[EA437R_EP16_STONEW/', orders: 512, qtyProduced: 520 },
    { product: '[EP16-SGY5] EP16 Earth Positive', orders: 384, qtyProduced: 390 },
    { product: '[CRBT300] CRBT300 Black', orders: 312, qtyProduced: 308 },
    { product: '[BHM_6760] Oversized Tee', orders: 256, qtyProduced: 260 },
    { product: '[SBG_n/a] Slam Dunk Tee', orders: 192, qtyProduced: 195 },
  ],
  blockedOrders: 394,
  blockedOrdersNote: '*Impacted by unavailable components',
  unavailableComponents: [
    {
      component: '[EP16-SGY5] EP16 Earth Positive',
      manufacturingOrder: 'WH/MO/54453',
      demand: 1,
      purchaseOrder: '',
    },
    {
      component: '[EP16-SGY5] EP16 Earth Positive',
      manufacturingOrder: 'WH/MO/54454',
      demand: 1,
      purchaseOrder: '',
    },
    {
      component: '[EP16-SGY5] EP16 Earth Positive',
      manufacturingOrder: 'WH/MO/54455',
      demand: 1,
      purchaseOrder: '',
    },
    {
      component: '[CRBT300] CRBT300 Black M',
      manufacturingOrder: 'WH/MO/54412',
      demand: 2,
      purchaseOrder: '',
    },
    {
      component: '[CRBT300] CRBT300 Black L',
      manufacturingOrder: 'WH/MO/54412',
      demand: 3,
      purchaseOrder: '',
    },
    {
      component: '[LABEL-BHM] License Label',
      manufacturingOrder: 'WH/MO/54398',
      demand: 1,
      purchaseOrder: '',
    },
  ],
}
