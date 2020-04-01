import * as Objects from "./Objects";
import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {List, MapEntry, ObjectPropertiesIterateType, ObjectPropertiesIterator, TreeSet} from "./Iterables";
import * as Pipeline from "./Pipeline";
import * as Types from "./Types";
import * as Preconditions from "./Preconditions";
import {Comparator, FunctionComparator} from "./Comparators";
import * as Functions from "./Functions";
import {Func2, Predicate, Predicate2, truePredicate} from "./Functions";


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
    return Collects.concat(array, a2);
}

export function difference(array: Array<any>, a2: Array<any>) {
    return Pipeline.of(array).filter({
        test(element: any) {
            return Collects.contains(a2, element, false);
        }
    }).toArray([]);
}

export function differenceBy(array: Array<any>, a2: Array<any>, mapper: Function) {
    if (Objects.isNull(mapper)) {
        return difference(array, a2);
    }
    if (Objects.isEmpty(a2)) {
        return Collects.toArray(array, []);
    }
    let list2: Iterable<any> | undefined = Collects.map(a2, mapper);
    return Pipeline.of(array).filter({
        test(element: any) {
            return Collects.contains(list2, mapper(element), false);
        }
    }).toArray();
}

export function differenceWith(array: Array<any>, values: Array<any>, comparator: Comparator<any> | Function | Func2<any, any, any>) {
    let predicate: Predicate2<any, any> = Functions.wrappedPredicate2(comparator);
    return Pipeline.of(array).filter({
        test(element: any) {
            return Collects.anyMatch(values, predicate);
        }
    }).toArray([]);
}

export function first(array: Array<any>): any {
    return Collects.findFirst(array, null);
}

export function head(array: Array<any>): any {
    return first(array);
}

export function indexOf(array: Array<any>, value: any, fromIndex?: number): number {
    fromIndex = (fromIndex == null || fromIndex < 0) ? 0 : Numbers.parseInt(fromIndex);
    if (fromIndex >= array.length) {
        return -1;
    }
    let index: number = Collects.newArrayList(array.slice(fromIndex)).indexOf(value);
    return index == -1 ? -1 : (fromIndex + index);
}

export function initial(array: Array<any>) {
    if (array.length >= 1) {
        array.splice(array.length - 1, 1);
    }
    return array;
}

export function lastIndexOf(array: Array<any>, value: any, fromIndex?: number): number {
    fromIndex = (fromIndex == null || fromIndex >= array.length) ? (array.length - 1) : fromIndex;
    if (fromIndex < 0) {
        return -1;
    }
    return Collects.newArrayList(array.slice(0, fromIndex + 1)).lastIndexOf(value);
}

export function drop(array: Array<any>, n: number): Array<any> {
    n = (n == null || n < 0) ? 1 : 0;
    Preconditions.checkTrue(Types.isArray(array));
    for (let i = 0; i < n; i++) {
        if (array.length > 0) {
            array.shift();
        }
    }
    return array;
}

export function dropRight(array: Array<any>, n: number): Array<any> {
    Preconditions.checkTrue(Types.isArray(array));
    n = (n == null || n < 0) ? 1 : 0;
    n = n > array.length ? array.length : n;
    array.splice(array.length - n, n);
    return array;
}

function _dropCountWhile(array: Array<any>, predicate:string|object|Array<any>|Function):number {
    Preconditions.checkTrue(Types.isArray(array));
    Preconditions.checkNonNull(predicate);
    let p:Function|Predicate2<any, any>|Predicate<any>;

    // [0] property
    // [1] value
    if(Types.isArray(predicate)){
        Preconditions.checkTrue((<Array<any>>predicate).length>=2);
        Preconditions.checkTrue(Types.isString(predicate[0]));
        let property = predicate[0];
        p = function (element) {
            return element[<string>property]==predicate[1];
        };
    }
    else
        // .property
    if(Types.isString(predicate)){
        let property = predicate;
        p = function (element) {
            return element[<string>property];
        };
    }
    else if(Functions.isPredicate(predicate)){
        p = <Predicate2<any, any>>predicate;
    }
    else if(Types.isSimpleObject(predicate)){
        p = function (element) {
            let match = true;
            for(let entry of new ObjectPropertiesIterator(predicate,ObjectPropertiesIterateType.KEY_VALUE)){
                if( element[entry.key]!==entry.value){
                    match =false;
                    break;
                }
            }
            return match;
        };
    }else{
        p = Functions.truePredicate();
    }

    let count = 0;
    let breakPredicate = function(element, index){
        let b = !Functions.callPredicate(p, element, index, array);
        if(!b){
            count++;
        }
        return b;
    };
    Collects.forEach(array, Functions.noopConsumer(), truePredicate(), breakPredicate);
    return count;
}

export function dropWhile(array: Array<any>, predicate:string|object|Array<any>|Function) {
    let count : number = _dropCountWhile(array, predicate);
    array.splice(0,count);
    return array;
}

export function dropRightWhile(array: Array<any>, predicate:string|object|Array<any>|Function){
    array = array.reverse();
    array = dropWhile(array, predicate);
    return array.reverse();
}


