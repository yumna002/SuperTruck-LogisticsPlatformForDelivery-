import { OrderObj } from "src/common/types/orderObj.interface";



export function compare(a:OrderObj, b:OrderObj): boolean {
    if (a.numberOfAttempts !== b.numberOfAttempts) {
      return a.numberOfAttempts < b.numberOfAttempts; //smaller attempts first (multiply it by -1 if you want bigger first)
    }
    return a.timeStamp.getTime() < b.timeStamp.getTime(); //earlier timestamp first
}
