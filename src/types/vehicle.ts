export interface Vehicle {
  id: string
  name: string
  class: string
  garage: string
  imageUrl?: string
  userId: string
  createdAt: string
  updatedAt: string
}

export const VEHICLE_CLASSES = [
  'Super',
  'Sports',
  'Sports Classic',
  'Coupe',
  'Muscle',
  'Off-Road',
  'SUV',
  'Sedan',
  'Compact',
  'Motorcycle',
  'Utility',
  'Van',
  'Service',
  'Emergency',
  'Military',
  'Commercial'
] as const