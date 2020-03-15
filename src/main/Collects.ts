import * as Booleans from "./Booleans";
import * as Types from "./Types";
import * as Iterables from './Iterables';

import {ArrayList, HashSet, LikeJavaSet, LinkedList,} from "./Iterables";
import {Collection} from "./Iterables";

export function emptyArray():Array<any> {
    return [];
}

export function emptyList(forQuery?:any) {
    return Booleans.asBoolean(forQuery) ? emptyArrayList() : emptyLinkedList();
}

export function emptyArrayList():ArrayList<any> {
    return new ArrayList<any>();
}

export function emptyLinkedList():LinkedList<any> {
    return new LinkedList<any>();
}

export function asIterable(obj:any): Iterable<any> {
    return Iterables.asIterable(obj);
}

export function emptyHashSet():LikeJavaSet<any> {
    return new HashSet();
}


export function toArray(list?: Collection<any> | Array<any> |Set<any> | Iterable<any> | IterableIterator<any>):Array<any> {
    if(list==null){
        return [];
    }
    if(Types.isArray(list)){
        return <Array<any>>list;
    }
    return new Array(...list);
}