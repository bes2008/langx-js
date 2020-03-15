import {ArrayList, Collection} from "./Iterables";
import * as Collects from "./Collects";
import {emptyArrayList} from "./Collects";
import {Consumer, Consumer2} from "./Functions";

export class Stream<E extends any> {
    private readonly collection:Collection<E>;

    new(list?: Collection<E> | Array<E> |Set<E> | Iterable<E> | IterableIterator<E>){
        return new Stream(list);
    }
    constructor(list?: Collection<E> | Array<E> |Set<E> | Iterable<E> | IterableIterator<E>) {
        if(list==null){
            this.collection = emptyArrayList();
        }else{
            this.collection = new ArrayList(Collects.toArray(list));
        }
    }

    forEach(consumer:Consumer<E> | Consumer2<number,E> | Function):void{
    }
}

export class Pipeline<E extends any> extends Stream<E>{

}

export function of (list?: Collection<any> | Array<any> |Set<any> | Iterable<any> | IterableIterator<any>) {
    return new Stream(list);
}

Stream["of"]=of;
