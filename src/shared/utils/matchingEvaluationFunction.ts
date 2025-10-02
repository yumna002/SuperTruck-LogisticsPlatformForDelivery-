import { driverNowLocation } from "src/common/providers/global-cache/globalCache.provider";
import { OrderObj } from "src/common/types/orderObj.interface";
import { GoogleMapsService } from "src/integrations/google-maps/google-maps.service";

const maxDummy=1e16;

export async function calcEdgeEvaluationValue(order:OrderObj, driverId:number, driverRate:number,googleMapsService:GoogleMapsService) {
    //distance, rate of driver, ifDriverRejectThisOrderBefore
    if(order.rejectedDrivers.includes(driverId)){
        return maxDummy;
    }

    const distanceWeight=0.5,rateWeight=0.5;

    const [lat,lng] = driverNowLocation.get(driverId) ?? [[-1, -1], -1];
    if(lat==-1){
        throw new Error('in matching evaluation');
    }
    const origin = lat.toString()+","+lng.toString(); // (lat,lng)
    const destination = order.order.fromAddress.latitude.toString()+","+order.order.fromAddress.longitude.toString(); // end (lat,lng)

    const response = await googleMapsService.getTimeAndDistace(origin,destination);

    const leg = response.routes[0].legs[0];
    const distance=leg.distance.value/1000; //in km

    //const distance=3;

    let value =distanceWeight * distance + rateWeight * (5 - driverRate);

    return value;
}
