import { OrderObj } from "src/common/types/orderObj.interface";
import { SendOrderRequestDto } from "src/modules/orders/dto/sendOrderRequest.dto";
import { Order } from "src/modules/orders/entities/order.entity";
import { calcEdgeEvaluationValue } from "../utils/matchingEvaluationFunction";
import { Repository } from "typeorm";
import { Driver } from "src/modules/drivers/entities/driver.entity";
import { NotFoundException } from "@nestjs/common";
import { I18nKeys } from "src/common/i18n/i18n-keys";
import { GoogleMapsService } from "src/integrations/google-maps/google-maps.service";



export class HungarianAlgorithm { //munkres algorithm
    cost: number[][]=[[]]; //rows:orders, columns:drivers
    n: number;
    inf: number=1e18;
    maxDummy: number=1e16;

    constructor() {}


    async initMatrix(orders:OrderObj[], drivers:number[], driverRepo: Repository<Driver>,googleMapsService:GoogleMapsService) {
        console.log('hi 1');
        let r=orders.length,c=drivers.length;
        if(r>c){ //number of order > drivers
            for(let i=0;i<r-c;i++){
                drivers.push(-1);
            }
        }
        else if(c>r){ //number of drivers > orders
            for(let i=0;i<c-r;i++){
                orders.push({
                    numberOfAttempts: 0,
                    timeStamp: new Date(),
                    orderId: -1,
                    order: new Order,
                    sendOrderRequestDto:new SendOrderRequestDto,
                    geoHash: "",
                    rejectedDrivers: []
                });
            }
        }
console.log('hi 2');
        this.n=Math.max(c,r);

console.log('hi 3=> n= ',this.n);
        for(let i=0;i<this.n;i++){
            for(let j=0;j<this.n;j++){
                if(orders[i].orderId==-1)this.cost[i][j]=this.maxDummy;
                else if(drivers[j]==-1)this.cost[i][j]=this.maxDummy;
                else{
                    const driver=await driverRepo.findOneBy({id:drivers[j]});
                    if(!driver){
                        throw new NotFoundException(I18nKeys.exceptionMessages.notFoundException);
                    }
                    this.cost[i][j]=await calcEdgeEvaluationValue(orders[i],drivers[j],driver.rate,googleMapsService);
                }
            }
        }

        console.log('const= ');
        console.log(this.cost);

        console.log('hi 4');
    }

    async ckmin(a, b) {
        if (a.value > b) {
            a.value = b;
            return true;
        }
        return false;
    }

    async runAlgorithm() {
        let assignment = new Array(this.n + 1).fill(-1);
        let h = new Array(this.n).fill(0); //johnson potentials

        console.log('abeer1');

        const inf = this.inf;//Number.MAX_SAFE_INTEGER;

        for (let j_cur = 0; j_cur < this.n; j_cur++) {
            let w_cur = this.n; //unvisited worker with min distance
            assignment[w_cur] = j_cur;

            let dist = new Array(this.n + 1).fill(inf);
            dist[this.n] = 0;
            let vis = new Array(this.n + 1).fill(false);
            let prv = new Array(this.n + 1).fill(-1);

            console.log('abeer2');

            while (assignment[w_cur] !== -1) {
                let min_dist = inf;
                vis[w_cur] = true;
                let w_next = -1;

                console.log('abeer3');

                for (let w = 0; w < this.n; w++) {
                    if (!vis[w]) {
                    console.log('12121212121');
                    console.log('w_cur= ',w_cur);
                    console.log('w= ',w);
                    console.log('assignment[w_cur]= ',assignment[w_cur]);
                    let edge = this.cost[assignment[w_cur]][w] - h[w];
                    console.log('maybe heer');
                    if (w_cur !== this.n) {
                        console.log('heer');
                        edge -= this.cost[assignment[w_cur]][w_cur] - h[w_cur];
                        console.log('orrr');
                        if (edge < 0) throw new Error("Assertion failed: edge >= 0");
                        console.log('wayy');
                    }
                    console.log('abeer4');
                    let distObj = { value: dist[w] };
                    if (await this.ckmin(distObj, dist[w_cur] + edge)) prv[w] = w_cur;
                    dist[w] = distObj.value;

                    console.log('abeer5');

                    let minObj = { value: min_dist };
                    if (await this.ckmin(minObj, dist[w])) w_next = w;
                    min_dist = minObj.value;
                    }
                    console.log('abeer6');
                }
                w_cur = w_next;
                console.log('abeer7');
            }
            console.log('abeer8');

            for (let w = 0; w < this.n; w++) {
                dist[w] = Math.min(dist[w], dist[w_cur]);
                h[w] += dist[w];
            }
            console.log('abeer9');

            while (w_cur !== this.n) {
                assignment[w_cur] = assignment[prv[w_cur]];
                w_cur = prv[w_cur];
            }
            console.log('abeer10');
        }

        return assignment;
    }

    async solve(orders:OrderObj[], drivers:number[], driverRepo: Repository<Driver>,googleMapsService:GoogleMapsService) {
        let result: [OrderObj,number][]=[]; //[order,driver]

        await this.initMatrix(orders,drivers, driverRepo,googleMapsService);
        const assignment=await await this.runAlgorithm();

        let totalAssignmentCost=0;

        for(let i=0;i<this.n;i++){
            const r=assignment[i],c=i; //r:order, c:driver
            if(this.cost[r][c]===this.maxDummy){
                if(orders[r].orderId==-1)continue; //mock order
                //add the order back to queue
                orders[r].numberOfAttempts++;
                result.push([orders[r],-1]);
                continue;
            }
            totalAssignmentCost+=this.cost[r][c];
            //assign this order to this driver
            result.push([orders[r],drivers[c]]);
        }

        return result;
    }
}
