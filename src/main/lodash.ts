import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {List} from "./Iterables";
import * as Pipeline from "./Pipeline";

export function chunk(array: Array<any>, size?: number): Array<Array<any>> {
    let size0: number = size == null ? 1 : Numbers.parseInt(size);
    let result: Array<Array<any>> = [];
    let tmp: Array<any>;
    Collects.forEach(array, {
        accept(index: number, element: any) {
            let newArray: boolean = index % size0 == 0;
            if (newArray) {
                tmp = [];
                result.push(tmp);
            }
            tmp.push(element);
        }
    });
    return result;
}

export function compact(array: Array<any>): Array<any> {
    return Pipeline.of(array).filter({
        test(element: any): boolean {
            return element ? true : false;
        }
    }).toArray();
}

export function concat(array: Array<any>, ...a2): Array<any> {
    let newArray: Array<any> = Array.from(array);
    Collects.forEach(a2, {
        accept(element: any) {
            newArray.push(element);
        }
    });
    return newArray;
}

export function first(array: Array<any>): any {
    return Collects.findFirst(array, null);
}

export function head(array: Array<any>): any {
    return first(array);
}

export function indexOf(array: Array<any>, value: any, fromIndex?: number): number {
    fromIndex = (fromIndex == null || fromIndex<0)? 0 : Numbers.parseInt(fromIndex);
    if (fromIndex >= array.length) {
        return -1;
    }
    let index:number = Collects.newArrayList(array.slice(fromIndex)).indexOf(value);
    return index == -1 ? -1 : (fromIndex + index);
}

export function initial(array: Array<any>) {
    if(array.length>=1){
        array.splice(array.length-1,1);
    }
    return array;
}

export function lastIndexOf(array:Array<any>, value:any, fromIndex?:number):number {
    fromIndex=( fromIndex==null || fromIndex>=array.length) ? (array.length-1) : fromIndex;
    if(fromIndex<0){
        return -1;
    }
    return Collects.newArrayList(array.slice(0,fromIndex+1)).lastIndexOf(value);
}