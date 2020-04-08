import * as Objects from "./Objects";
import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import {ArrayList, HashMap, List, MapEntry, ObjectPropertiesIterateType, ObjectPropertiesIterator} from "./Iterables";
import * as Pipeline from "./Pipeline";
import * as Types from "./Types";
import * as Preconditions from "./Preconditions";
import * as Comparators from "./Comparators";
import {Comparator, EqualsComparator, FunctionComparator, IsComparator, ObjectComparator} from "./Comparators";
import * as Functions from "./Functions";
import {Func, Func2, Predicate, Predicate2, truePredicate} from "./Functions";
import * as Algorithms from "./Algorithms";
import {SearchResult} from "./Algorithms";
import {IllegalArgumentException} from "./Exceptions";


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

export function putAt(array: Array<any>, ...indexes: Array<number>): Array<any> {
    let removed: Array<any> = [];
    let unremoved: Array<any> = [];
    Collects.forEach(array, (element: any, index: number) => {
        if (Collects.contains(indexes, index)) {
            removed.push(element);
        } else {
            unremoved.push(element);
        }
    });
    array.splice(0);
    array.push(...unremoved);
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
    return <Array<any>>Collects.reverse(array, false);
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
    let comparator = new ObjectComparator();
    return Algorithms.binarySearch(Collects.newArrayList(array), value, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(m, e1);
        e2 = Functions.mapping(m, e2);
        return comparator.compare(e1, e2);
    }), true).index;
}

export function sortedIndexOf(array: Array<any>, value: any): number {
    let result: SearchResult<any> = Algorithms.binarySearch(Collects.newArrayList(array), value, new ObjectComparator(), true);
    if (result.value == null) {
        return -1;
    }
    return result.index;
}


export function sortedLastIndex(array: Array<any>, value: any): number {
    return Algorithms.binarySearch(Collects.newArrayList(array), value, new ObjectComparator(), false).index;
}

export function sortedLastIndexBy(array: Array<any>, value: any, mapper: string | object | Array<any> | Function): number {
    let m = _buildArrayMapper(mapper);
    let comparator: ObjectComparator = new ObjectComparator();
    return Algorithms.binarySearch(Collects.newArrayList(array), value, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(m, e1);
        e2 = Functions.mapping(m, e2);
        return comparator.compare(e1, e2);
    }), false).index;
}

export function sortedLastIndexOf(array: Array<any>, value: any): number {
    let result: SearchResult<any> = Algorithms.binarySearch(Collects.newArrayList(array), value, new ObjectComparator(), false);
    if (result.value == null) {
        return -1;
    }
    return result.index;
}

export function sortedUniq(array: Array<any>): Array<any> {
    return Collects.newTreeSet(array, new ObjectComparator()).toArray([]);
}

export function sortedUniqBy(array: Array<any>, mapper: string | object | Array<any> | Function) {
    let comparator: ObjectComparator = new ObjectComparator();
    let m = _buildArrayMapper(mapper);
    return Collects.newTreeSet(array, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(m, e1);
        e2 = Functions.mapping(m, e2);
        return comparator.compare(e1, e2);
    })).toArray([]);
}

export function tail(array: Array<any>): Array<any> {
    let length = Objects.getLength(array);
    if (length < 2) {
        return [];
    }
    return Pipeline.of(array).filter((element: any, index: number) => {
        return index > 0;
    }).toArray();
}

export function take(array: Array<any>, n: number): Array<any> {
    return Pipeline.of(array).filter(truePredicate(), (element: any, index: number) => {
        return index >= n;
    }).toArray();
}

export function takeRight(array: Array<any>, n: number): Array<any> {
    return Pipeline.of(array).reverse(true).filter((element: any, index: number) => {
        return index < n;
    }).toArray();
}

export function takeWhile(array: Array<any>, predicate: string | object | Array<any> | Function): Array<any> {
    let _predicate = _buildArrayPredicate(predicate);
    return Pipeline.of(array).filter(_predicate, (element: any, index: number) => {
        return !Functions.test(_predicate, element, index);
    }).toArray();
}

export function takeRightWhile(array: Array<any>, predicate: string | object | Array<any> | Function): Array<any> {
    let _predicate = _buildArrayPredicate(predicate);
    return Pipeline.of(array).reverse(true).filter(_predicate, (element: any, index: number) => {
        return !Functions.test(_predicate, element, index);
    }).toArray();
}

export function union(array: Array<Array<any>>) {
    let set = Collects.newLinkedHashSet();
    Collects.forEach(array, (element: Array<any>) => {
        set.addAll(element);
    }, (element: Array<any>) => {
        return element != null && Types.isCollection(element);
    });
    return set.toArray();
}

export function unionBy(array: Array<Array<any>>, mapper: string | object | Array<any> | Function) {
    let comparator: ObjectComparator = new ObjectComparator();
    let m = _buildArrayMapper(mapper);
    let set = Collects.newTreeSet(null, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(m, e1);
        e2 = Functions.mapping(m, e2);
        comparator.compare(e1, e2);
    }));
    Collects.forEach(array, (element: Array<any>) => {
        set.addAll(element);
    }, (element: Array<any>) => {
        return element != null && Types.isCollection(element);
    });
    return set.toArray();
}


export function unionWith(array: Array<Array<any>>, comparator: Comparator<any> | Function | Func2<any, any, any>) {
    let _comparator: FunctionComparator<any> = Comparators.functionComparator(comparator);
    let set = Collects.newTreeSet(null, _comparator);
    Collects.forEach(array, (element: Array<any>) => {
        set.addAll(element);
    }, (element: Array<any>) => {
        return element != null && Types.isCollection(element);
    });
    return set.toArray();
}

export function uniq(array: Array<any>) {
    return Collects.newTreeSet(array, new IsComparator()).toArray([]);
}

export function uniqBy(array: Array<any>, mapper: string | object | Array<any> | Function) {
    let m = _buildArrayMapper(mapper);
    let comparator: ObjectComparator = new ObjectComparator();
    return Collects.newTreeSet(array, new FunctionComparator((e1: any, e2: any) => {
        e1 = Functions.mapping(m, e1);
        e2 = Functions.mapping(m, e2);
        comparator.compare(e1, e2);
    })).toArray([]);
}

export function uniqWith(array: Array<any>, comparator: Comparator<any> | Function | Func2<any, any, any>) {
    let _comparator: FunctionComparator<any> = Comparators.functionComparator(comparator);
    return Collects.newTreeSet(array, _comparator).toArray([]);
}

export function unzip(arrays: Array<Array<any>>): Array<Array<any>> {
    if (Objects.isEmpty(arrays)) {
        return [];
    }
    let length = -1;
    Collects.forEach(arrays, function (array: Array<any>) {
        throw new IllegalArgumentException("the length of every array is not equals");
    }, function (array: Array<any>) {
        if (!Types.isArray(array)) {
            return true;
        }
        let l = Objects.getLength(array);
        if (length != -1 && l !== length) {
            return true;
        }
        length = l;
    });
    let result: Array<Array<any>> = [];
    for (let i = 0; i < length; i++) {
        let temp: Array<any> = [];
        Collects.forEach(arrays, (array: Array<any>) => {
            temp.push(array[i]);
        });
        result.push(temp);
    }
    return result;
}


export function unzipWith(arrays: Array<Array<any>>, mapper: Function | Func2<any, any, any>): Array<any> {
    arrays = unzip(arrays);
    let result: Array<any> = [];
    Collects.forEach(arrays, (array: Array<any>) => {
        if (array.length > 0) {
            let tmp: any = array[0];
            for (let i = 1; i < array.length; i++) {
                tmp = Functions.mapping(mapper, tmp, array[i]);
            }
            result.push(tmp);
        } else {
            result.push([]);
        }
    });
    return result;
}

export function without(array: Array<any>, values: Array<any>) {
    let vs = Collects.newArrayList(values);
    Collects.removeIf(array, (element: any) => {
        return vs.contains(element);
    }, true);

}

export function xor(...arrays: Array<any>): Array<any> {
    let map: HashMap<any, any> = Collects.newLinkedHashMap();
    Pipeline.of(arrays).flatMap().forEach((element: any) => {
        let count = map.get(element);
        if (count == null) {
            map.put(element, 1);
        } else {
            map.put(element, ++count);
        }
    });
    let result: Array<any> = [];
    Collects.forEach(map, (entry: MapEntry<any, any>) => {
        if (entry.value == 1) {
            result.push(entry.key);
        }
    });
    return result;
}

export function xorBy(arrays: Array<Array<any>>, mapper: string | object | Array<any> | Function): Array<any> {
    let m = _buildArrayMapper(mapper);
    let mappedValueToOriginalValueMap: HashMap<any, any> = Collects.newLinkedHashMap();
    let map: HashMap<any, any> = Collects.newLinkedHashMap();
    Pipeline.of(arrays).flatMap().forEach((element: any) => {
        let mappedValue = Functions.mapping(m, element);
        if (!mappedValueToOriginalValueMap.containsKey(mappedValue)) {
            mappedValueToOriginalValueMap.put(mappedValue, element);
        }
        let count = map.get(mappedValue);
        if (count == null) {
            map.put(mappedValue, 1);
        } else {
            map.put(mappedValue, ++count);
        }
    });
    let result: Array<any> = [];
    Collects.forEach(map, (entry: MapEntry<any, any>) => {
        if (entry.value == 1) {
            result.push(mappedValueToOriginalValueMap.get(entry.key));
        }
    });
    return result;
}

export function xorWith(arrays: Array<Array<any>>, comparator: Comparator<any> | Func2<any, any, any> | Function): Array<any> {
    let _comparator: FunctionComparator<any> = Comparators.functionComparator(comparator);
    // mappedValue is the first occurs value
    let mappedValueToCountMap: HashMap<any, any> = Collects.newLinkedHashMap();
    Pipeline.of(arrays).flatMap().forEach((element: any) => {
        let mappedValue: any = Collects.findFirst(mappedValueToCountMap.keySet(), (mappedValue0: any) => {
            if (_comparator.compare(element, mappedValue0) == 0) {
                return mappedValue0;
            }
        });
        if (mappedValue == null) {
            mappedValueToCountMap.put(element, 1);
        } else {
            let count = mappedValueToCountMap.get(mappedValue);
            mappedValueToCountMap.put(mappedValue, ++count);
        }
    });
    let result: Array<any> = [];
    Collects.forEach(mappedValueToCountMap, (entry: MapEntry<any, any>) => {
        if (entry.value == 1) {
            result.push(entry.key);
        }
    });
    return result;
}

export function zip(...arrays: Array<any>): Array<Array<any>> {
    if (Objects.isEmpty(arrays)) {
        return [];
    }
    let length = -1;
    Collects.forEach(arrays, function (array: Array<any>) {
        throw new IllegalArgumentException("the length of every array is not equals");
    }, function (array: Array<any>) {
        if (!Types.isArray(array)) {
            return true;
        }
        let l = Objects.getLength(array);
        if (length != -1 && l !== length) {
            return true;
        }
        length = l;
    });
    let result: Array<Array<any>> = [];
    for (let i = 0; i < length; i++) {
        let temp: Array<any> = [];
        Collects.forEach(arrays, (array: Array<any>) => {
            temp.push(array[i]);
        });
        result.push(temp);
    }
    return result;
}