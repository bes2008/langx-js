import * as Objects from "./Objects";
import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {ArrayList, List, ObjectPropertiesIterateType, ObjectPropertiesIterator} from "./Iterables";
import * as Pipeline from "./Pipeline";
import * as Types from "./Types";
import * as Preconditions from "./Preconditions";
import * as Comparators from "./Comparators";
import {Comparator, FunctionComparator, ObjectComparator} from "./Comparators";
import * as Functions from "./Functions";
import {Func, Func2, Predicate, Predicate2, truePredicate} from "./Functions";
import * as Algorithms from "./Algorithms";
import {SearchResult} from "./Algorithms";


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

export function differenceBy(array: Array<any>, a2: Array<any>, mapper: string | object | Array<any> | Function): Array<any> {
    if (Objects.isNull(mapper)) {
        return difference(array, a2);
    }
    if (Objects.isEmpty(a2)) {
        return Collects.toArray(array, []);
    }
    let m: Function = <Function>_buildArrayMapper(mapper);
    let list2: Iterable<any> | undefined = Collects.map(a2, m);
    return Pipeline.of(array).filter({
        test(element: any, index: number) {
            return Collects.contains(list2, Functions.mapping(m, element, index), false);
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


function _buildArrayPredicate(predicate: string | object | Array<any> | Function): Function | Predicate2<any, any> | Predicate<any> {
    Preconditions.checkNonNull(predicate);
    let p: Function | Predicate2<any, any> | Predicate<any>;

    // [0] property
    // [1] value
    if (Types.isArray(predicate)) {
        Preconditions.checkTrue((<Array<any>>predicate).length >= 2);
        Preconditions.checkTrue(Types.isString(predicate[0]));
        let property = predicate[0];
        p = function (element) {
            return element[<string>property] == predicate[1];
        };
    } else
        // .property
    if (Types.isString(predicate)) {
        let property = predicate;
        p = function (element) {
            return element[<string>property];
        };
    } else if (Functions.isPredicate(predicate)) {
        p = <Predicate2<any, any>>predicate;
    } else if (Types.isSimpleObject(predicate)) {
        p = function (element) {
            let match = true;
            for (let entry of new ObjectPropertiesIterator(predicate, ObjectPropertiesIterateType.KEY_VALUE)) {
                if (element[entry.key] !== entry.value) {
                    match = false;
                    break;
                }
            }
            return match;
        };
    } else {
        p = Functions.truePredicate();
    }
    return p;
}


function _buildArrayMapper(mapper: string | object | Array<any> | Function): Function | Func<any, any> | Func2<any, any, any> {
    Preconditions.checkNonNull(mapper);
    let m: Function | Func<any, any> | Func2<any, any, any>;

    // [0] property
    // [1] value
    if (Types.isArray(mapper)) {
        let properties: Array<any> = <Array<any>>mapper;
        Preconditions.checkTrue(properties.length >= 1);
        m = function (element) {
            let obj = {};
            for (let property of properties) {
                obj[property] = element[property];
            }
            return obj;
        }
    } else
        // .property
    if (Types.isString(mapper)) {
        let property = mapper;
        m = function (element) {
            return element[<string>property];
        };
    } else if (Functions.isPredicate(mapper)) {
        m = <Function>mapper;
    } else if (Types.isSimpleObject(mapper)) {
        m = Functions.noopFunction();
    } else {
        m = Functions.noopFunction();
    }
    return m;
}


function _dropCountWhile(array: Array<any>, predicate: string | object | Array<any> | Function): number {
    Preconditions.checkTrue(Types.isArray(array));
    predicate = _buildArrayPredicate(predicate);

    let count = 0;
    let breakPredicate = function (element, index) {
        let b = !Functions.callPredicate(predicate, element, index, array);
        if (!b) {
            count++;
        }
        return b;
    };
    Collects.forEach(array, Functions.noopConsumer(), truePredicate(), breakPredicate);
    return count;
}

export function dropWhile(array: Array<any>, predicate: string | object | Array<any> | Function) {
    let count: number = _dropCountWhile(array, predicate);
    array.splice(0, count);
    return array;
}

export function dropRightWhile(array: Array<any>, predicate: string | object | Array<any> | Function) {
    array = array.reverse();
    array = dropWhile(array, predicate);
    return array.reverse();
}

export function fill(array: Array<any>, value: any, fromIndex: number, toIndex: number): Array<any> {
    Preconditions.checkTrue(Types.isArray(array));
    toIndex = toIndex == null || toIndex > array.length ? array.length : toIndex;
    fromIndex = fromIndex == null || fromIndex < 0 ? 0 : fromIndex;
    fromIndex = fromIndex > toIndex ? toIndex : fromIndex;
    while (fromIndex < toIndex) {
        array[fromIndex] = value;
    }
    return array;
}


export function findIndex(array: Array<any>, predicate: string | object | Array<any> | Function): number {
    predicate = _buildArrayPredicate(predicate);
    let index = -1;
    Collects.forEach(array, function (element, i) {
        index = i;
    }, <Function>predicate, {
        test(i: any) {
            return index !== -1;
        }
    });
    return index;
}

export function findLastIndex(array: Array<any>, predicate?: string | object | Array<any> | Function): number {
    predicate = _buildArrayPredicate(predicate ? predicate : truePredicate());
    let index = -1;
    Pipeline.of(array).reverse().forEach(function (element, i) {
        index = i;
    }, <Function>predicate, {
        test(i: any) {
            return index !== -1;
        }
    });
    if (index !== -1) {
        index = array.length - 1 - index;
    }
    return index;
}

export function first(array: Array<any>): any {
    return nth(array, 0);
}

export function flatten(array: Array<any> | any): Array<any> {
    let newArray: Array<any> = [];
    array = Collects.asList(array).toArray();
    Collects.forEach(array, (element) => {
        Collects.addAll(newArray, Collects.asList(element));
    });
    return newArray;
}

export function flattenDeep(array: Array<any> | any): Array<any> {
    let newArray: Array<any> = [];
    array = Collects.asList(array).toArray();
    Collects.forEach(array, (element) => {
        Collects.addAll(newArray, flattenDeep(element));
    });
    return newArray;
}

export function flattenDepth(array: Array<any> | any, depth?: number, currentDepth?: number) {
    depth = depth == null || !depth || depth < 1 ? 1 : depth;
    let current = (currentDepth == null || !currentDepth || currentDepth < -1) ? 0 : currentDepth;
    array = Collects.asList(array).toArray();
    if (current < depth) {
        let newArray: Array<any> = [];
        Collects.forEach(array, (element) => {
            current++;
            Collects.addAll(newArray, flattenDepth(element, depth, current));
        });
        return newArray;
    }
    return array;
}

export function fromPairs(pairs: Array<Array<any>>): object {
    let obj = {};
    Collects.forEach(pairs, {
        accept(pair: Array<any>) {
            obj[pair[0]] = pair[1];
        }
    }, (pair: Array<any>) => {
        return Types.isArray(pair) && pair.length >= 2 && Objects.isObjectKeyType(Types.getType(pair[0]));
    });
    return obj;
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

export function intersection(...arrays: Array<any>) {
    if (arrays.length < 1) {
        return [];
    }
    let pipeline = Pipeline.of(arrays.shift());
    while (arrays.length > 0 && !pipeline.isEmpty()) {
        let arr2: Array<any> = arrays.shift();
        pipeline = pipeline.intersection(arr2);
    }
    return pipeline.toArray();
}

export function intersectionBy(arrays: Array<Array<any>>, mapper: string | object | Array<any> | Function) {
    if (arrays.length < 1) {
        return [];
    }
    let m: Function = <Function>_buildArrayMapper(mapper);

    let pipeline = Pipeline.of(arrays.shift());
    while (arrays.length > 0 && !pipeline.isEmpty()) {
        let array: Array<any> = <Array<any>>arrays.shift();
        if (array != null) {
            let arr2 = Collects.map(array, m);
            pipeline = pipeline.filter({
                test(element: any) {
                    return Collects.contains(arr2, Functions.mapping(m, element));
                }
            });
        } else {
            return [];
        }
    }
    return pipeline.toArray();
}


export function intersectionWith(arrays: Array<Array<any>>, comparator: Comparator<any> | Func2<any, any, any> | Function) {
    if (arrays.length < 1) {
        return [];
    }
    let _comparator: Comparator<any> = Comparators.functionComparator(comparator);

    let pipeline = Pipeline.of(arrays.shift());
    while (arrays.length > 0 && !pipeline.isEmpty()) {
        let array: Array<any> = <Array<any>>arrays.shift();
        if (array != null) {
            pipeline = pipeline.filter({
                test(element: any) {
                    return Collects.anyMatch(array, {
                        test(element2: any) {
                            return _comparator.compare(element, element2) == 0;
                        }
                    })
                }
            });
        } else {
            return [];
        }
    }
    return pipeline.toArray();
}

export function join(array: Array<any>, separator?: string): string {
    let str = "";
    separator = separator == null || !Types.isString(separator) ? "," : separator;
    Collects.forEach(array, (element: any, index: number) => {
        str = str + (index == 0 ? "" : separator) + element.toString();
    }, (element: any, index: number) => {
        return element != null;
    });
    return str;
}

export function last(array: Array<any>): any {
    return nth(array, array.length - 1);
}

export function lastIndexOf(array: Array<any>, value: any, fromIndex?: number): number {
    fromIndex = (fromIndex == null || fromIndex >= array.length) ? (array.length - 1) : fromIndex;
    if (fromIndex < 0) {
        return -1;
    }
    return Collects.newArrayList(array.slice(0, fromIndex + 1)).lastIndexOf(value);
}

export function nth(array: Array<any>, n: number): any {
    let list: List<any> = Collects.asList(array);
    if (n < 0) {
        n = list.size() - 1 + n;
    }
    if (n >= list.size() || n < 0) {
        return null;
    }
    return list.get(n);
}

export function put(array: Array<any>, ...values: any): Array<any> {
    let list: List<any> = Collects.asList(Collects.asIterable(values));
    Collects.removeIf(array, (element: any) => {
        return list.contains(element);
    });
    return array;
}

export function putAll(array: Array<any>, values: Array<any>): Array<any> {
    return put(array, ...values);
}

export function putAllBy(array: Array<any>, values: Array<any>, mapper: string | object | Array<any> | Function): Array<any> {
    let m: Function = <Function>_buildArrayMapper(mapper);
    let list: List<any> = <List<any>>Collects.map(values, m);
    Collects.removeIf(array, (element: any, index: number) => {
        return list.contains(Functions.mapping(m, element, index));
    });
    return array;
}

export function putAllWith(array: Array<any>, values: Array<any>, comparator: Comparator<any> | Func2<any, any, any> | Function): Array<any> {
    let _comparator: Comparator<any> = Comparators.functionComparator(comparator);
    Collects.removeIf(array, (element: any) => {
        Collects.anyMatch(values, (value: any) => {
            return _comparator.compare(element, value) == 0;
        })
    });
    return array;
}

export function putAt(array: Array<any>, ...indexes:Array<number>):Array<any> {
    let removed:Array<any> =[];
    let unremoved:Array<any> =[];
    Collects.forEach(array,(element:any, index:number)=>{
       if(Collects.contains(indexes,index)){
           removed.push(element);
       }else{
           unremoved.push(element);
       }
    });
    array.splice(0);
    array.push(unremoved);
    return removed;
}

export function remove(array: Array<any>, predicate: string | object | Array<any> | Function): Array<any> {
    let removed: Array<any> = [];
    let _predicate = _buildArrayPredicate(predicate);
    for (let i = 0; i < array.length;) {
        let element = array[i];
        if (Functions.test(_predicate, element, i)) {
            removed.push(element);
            array.slice(i, 1);
        } else {
            i++;
        }
    }
    return removed;
}

export function reverse(array: Array<any>): Array<any> {
    return array.reverse();
}

export function slice(array: Array<any>, start?: number, end?: number): Array<any> {
    end = end == null || !Types.isNumber(end) || end < 0 || end >= array.length ? array.length : end;
    start = start == null || !Types.isNumber(start) || start < 0 ? 0 : start;
    if (start > end || start >= array.length) {
        return array;
    }
    return array.slice(start, end);
}

export function sortedIndex(array: Array<any>, value: any): number {
    return Algorithms.binarySearch(Collects.newArrayList(array), value, new ObjectComparator(), true).index;
}

export function sortedIndexBy(array: Array<any>, value: any, mapper: string | object | Array<any> | Function): number {
    let m = _buildArrayMapper(mapper);
    return Algorithms.binarySearch(Collects.newArrayList(array), value, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(e1);
        e2 = Functions.mapping(e2);
        return new ObjectComparator().compare(e1, e2);
    }), true).index;
}

export function sortedIndexOf(array: Array<any>, value: any): number {
    let result:SearchResult<any> =  Algorithms.binarySearch(Collects.newArrayList(array), value, new ObjectComparator(), true);
    if(result.value==null){
        return  -1;
    }
    return result.index;
}