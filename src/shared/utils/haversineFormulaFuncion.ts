export async function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; //km
  const dLat = await deg2rad(lat2 - lat1);
  const dLon = await deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(await deg2rad(lat1)) * Math.cos(await deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; //distance in km
}

export async function deg2rad(deg: number) {
  return deg * (Math.PI / 180);
}
