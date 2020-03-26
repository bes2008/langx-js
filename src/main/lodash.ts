import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {List} from "./Iterables";

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

export function compact(array: Array<any>) {
    Collects.filter(array, {
        test(element: any): boolean {
            return element ? true : false;
        }
    })
}

export function concat(array: Array<any>, ...a2) {
    let newArray: Array<any> = Array.from(array);
    Collects.forEach(a2, {
        accept(element: any) {
            newArray.push(element);
        }
    });
    return newArray;
}