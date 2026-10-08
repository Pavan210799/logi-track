// Rough road distance in km between two points that have latitude and longitude
export function getDistanceKm(from, to) {
  const northSouthKm = (to.latitude - from.latitude) * 111
  const eastWestKm = (to.longitude - from.longitude) * 111 * Math.cos((from.latitude * Math.PI) / 180)
  const straightKm = Math.sqrt(northSouthKm * northSouthKm + eastWestKm * eastWestKm)

  // Roads are about 30% longer than a straight line
  return Math.round(straightKm * 1.3)
}

// State name from a number plate like 'KA-01-AB-1234'
const plateStates = {
  KA: 'Karnataka',
  TN: 'Tamil Nadu',
  TS: 'Telangana',
  KL: 'Kerala',
  AP: 'Andhra Pradesh',
}

export function stateOfPlate(registrationNumber) {
  return plateStates[registrationNumber.slice(0, 2)] || 'Other'
}
