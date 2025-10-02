import { Injectable } from "@nestjs/common";
import { OrderObj } from "src/common/types/orderObj.interface";



@Injectable()
export class PriorityQueue<T> { //using min-heap
  private heap: T[] = [];

  constructor(
    private readonly compare: (a: T, b: T) => boolean, 
  ) {}


  push(item: T) { //add element
    this.heap.push(item);
    this.heapifyUp(this.size()-1);
  }

  pop(): T | undefined { //get the top element then delete it 
    if (this.empty()) return undefined;

    //swap root with last element and remove last
    [this.heap[0], this.heap[this.size() - 1]] = [this.heap[this.size() - 1], this.heap[0]];
    const top = this.heap.pop();

    this.heapifyDown(0);

    return top;
  }

  top(): T | undefined { //get the top element
    return this.heap[0];
  }

  empty(): boolean {
    if(this.heap.length==0)return true;
    else return false;
  }

  size(): number {
    return this.heap.length;
  }

  private heapifyUp(index: number) {
    while(index>0){
      let parent=Math.floor((index-1)/2);
      if(this.compare(this.heap[index], this.heap[parent])){
        [this.heap[index],this.heap[parent]]=this.swap(this.heap[index],this.heap[parent]);
        index=parent;
      }
      else{
        break;
      }
    }
  }

  private heapifyDown(index: number) {
    let n=this.size();
    while(true){
      let left=2*index+1,right=2*index+2;
      let smallest=index;

      if(left<n && this.compare(this.heap[left], this.heap[smallest])){
        smallest=left;
      }
      if(right<n && this.compare(this.heap[right], this.heap[smallest])){
        smallest=right;
      }

      if(smallest!==index){
        [this.heap[index],this.heap[smallest]]=this.swap(this.heap[index],this.heap[smallest]);
        index=smallest;
      }
      else{
        break;
      }
    }
  }

  private swap(a: T, b:T): [T,T] {
    return [b, a];
  }
}
