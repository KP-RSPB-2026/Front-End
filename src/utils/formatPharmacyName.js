const PHARMACY_LABELS = {
  APTA: 'Apotik A',
  APTB: 'Apotik B',
  APTC: 'Apotik C',
}

export function formatPharmacyName(pharmacyCode) {
  if (!pharmacyCode) {
    return 'Apotik'
  }

  const normalizedCode = String(pharmacyCode).trim().toUpperCase()

  if (PHARMACY_LABELS[normalizedCode]) {
    return PHARMACY_LABELS[normalizedCode]
  }

  const shortCodeMatch = normalizedCode.match(/([A-Z])$/)
  if (shortCodeMatch) {
    return `Apotik ${shortCodeMatch[1]}`
  }

  return `Apotik ${normalizedCode}`
}