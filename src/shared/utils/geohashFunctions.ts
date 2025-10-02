import * as geohash from 'ngeohash';
import { geohashConstants } from 'src/common/constants/geohash.constant';



export async function geohashEncode(lat: number, lon: number): Promise<string> {
    //encode latitude and longitude to a geohash string
    return await geohash.encode(lat, lon, geohashConstants.precision);
}

export async function geohashDecode(hash: string): Promise<{ latitude: number; longitude: number; }> {
    //decode a geohash string to latitude and longitude
    const { latitude, longitude } = await geohash.decode(hash);
    return { latitude, longitude };
}

export async function getNeighbors(hash: string): Promise<string[]> {
    //get all 8 neighbors of a geohash
    const neighbors: string[]=[];
    neighbors.push(await getSpecificNeighbor(hash,'n'));
    neighbors.push(await getSpecificNeighbor(hash,'s'));
    neighbors.push(await getSpecificNeighbor(hash,'e'));
    neighbors.push(await getSpecificNeighbor(hash,'w'));
    neighbors.push(await getSpecificNeighbor(hash,'ne'));
    neighbors.push(await getSpecificNeighbor(hash,'nw'));
    neighbors.push(await getSpecificNeighbor(hash,'se'));
    neighbors.push(await getSpecificNeighbor(hash,'sw'));
    return neighbors;
}

export async function getSpecificNeighbor(hash: string, direction: string): Promise<string> {
    //get a neighbor in a specific direction ('n', 's', 'e', 'w', 'ne', 'nw', 'se', 'sw')
    return await geohash.neighbor(hash, direction);
}
