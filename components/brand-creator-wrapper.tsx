'use client'

import { BrandCreatorPopup } from './brand-creator-popup'

export function BrandCreatorWrapper() {
  const handleSelection = (type: 'brand' | 'creator') => {
    console.log('User selected:', type)
    // You can add additional logic here if needed
  }

  return <BrandCreatorPopup onSelection={handleSelection} />
}
