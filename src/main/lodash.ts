import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {List} from "./Iterables";

export function chunk(array: Array<any>, size?: number): Array<Array<any>> {
    let size0 = (size == null) ? 1 : Numbers.parseInt(size);
    let list: List<List<any>> = Collects.partitionBy(array, {
        apply(index: number, element: any) {
            return Numbers.parseInt(index / element) + (index % size0 == 0 ? 1 : 0)
        }
    });
    let result: Array<Array<any>> = [];
    Collects.forEach(list, {
        accept(ls: List<any>) {
            result.push(Collects.toArray(ls));
        }
    });

    return result;
}

export function compact(array: Array<any>) {
    Collects.filter(array, {
        test(element: any): boolean {
            return element ? true : false;
        }
    })
}

export function concat(array:Array<any>, ...a2 ) {
    let newArray:Array<any> = Array.from(array);
    Collects.forEach(a2,{
        accept(element: any) {
            newArray.push(element);
        }
    });
    return newArray;
}