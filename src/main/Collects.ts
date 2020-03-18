import * as Booleans from "./Booleans";
import * as Types from "./Types";
import * as Numbers from "./Numbers";
import * as Objects from "./Objects";
import * as Functions from "./Functions";
import {
    Consumer,
    Consumer2,
    ConsumerType,
    Func,
    Func2,
    FunctionType,
    Predicate,
    Predicate2,
    PredicateType
} from "./Functions";
import * as Iterables from "./Iterables";
import {
    AbstractList,
    ArrayList,
    Collection,
    HashMap,
    HashSet,
    LikeJavaMap,
    LikeJavaSet, LinearCollection,
    LinkedList,
    List,
    MapEntry
} from "./Iterables";
import * as Preconditions from "./Preconditions";


export function emptyArray(): Array<any> {
    return [];
}

export function emptyList(forQuery?: any) {
    return Booleans.asBoolean(forQuery) ? emptyArrayList() : emptyLinkedList();
}

export function emptyArrayList(): ArrayList<any> {
    return new ArrayList<any>();
}

export function emptyLinkedList(): LinkedList<any> {
    return new LinkedList<any>();
}

export function asIterable(obj: any): List<any> {
    return Iterables.asIterable(obj);
}

export function emptyHashSet(): LikeJavaSet<any> {
    return new HashSet<any>();
}

export function newList(iterable?: Iterable<any>): List<any> {
    return new ArrayList(iterable);
}

export function cleanNulls(iterable: LinearCollection): Collection<any> | Array<any> {
    if (Types.isArray(iterable)) {
        return [...filter(iterable, {
            test: function (element: any) {
                return !Objects.isEmpty(element);
            }
        })];
    } else {
        let list = [...iterable];
        let collection = <Collection<any>>iterable;
        collection.clear();
        collection.addAll(<Collection<any>>filter(list, (element) => {
            return !Objects.isEmpty(element);
        }));
        return collection;
    }
}

export function toSet(iterable: Iterable<any>): HashSet<any> {
    return new HashSet<any>([...iterable]);
}

export function toList(iterable: Iterable<any>): List<any> {
    return new ArrayList([...iterable]);
}

export function toArray(list?: Collection<any> | Array<any> | Set<any> | Iterable<any> | IterableIterator<any>): Array<any> {
    if (list == null) {
        return [];
    }
    if (Types.isArray(list)) {
        return <Array<any>>list;
    }
    return new Array(...list);
}

export function forEach(iterable: Iterable<any>, consumer: Consumer<any> | Consumer2<number, any> | Function): void {
    Preconditions.checkNonNull(iterable);
    let consumerType: ConsumerType = Functions.judgeConsumerType(consumer);
    Preconditions.checkTrue(consumerType != ConsumerType.UNKNOWN, "illegal consumer");

    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        for (let entry of map) {
            switch (consumerType) {
                case ConsumerType.CONSUMER:
                    (<Consumer<MapEntry<any, any>>>consumer).accept(entry);
                    break;
                case ConsumerType.CONSUMER2: {
                    (<Consumer2<any, any>>consumer).accept(entry.getKey(), entry.getValue());
                    break;
                }
                case ConsumerType.FUNCTION:
                    (<Function>consumer).call({}, entry);
                    break;
            }
        }
    } else {
        let index = 0;
        for (let element of iterable) {
            switch (consumerType) {
                case ConsumerType.CONSUMER:
                    (<Consumer<any>>consumer).accept(element);
                    break;
                case ConsumerType.CONSUMER2:
                    (<Consumer2<number, any>>consumer).accept(index, element);
                    break;
                case ConsumerType.FUNCTION:
                    (<Function>consumer).call({}, element, index);
                    break;
            }
            index++;
        }
    }

}


export function map(iterable: Iterable<any>, mapper: Func<any, any> | Func2<any, any, any> | Function): undefined | List<any> | LikeJavaMap<any, any> {
    Preconditions.checkNonNull(iterable);
    let mapperType = Functions.judgeFuncType(mapper);
    Preconditions.checkTrue(mapperType != FunctionType.UNKNOWN, "illegal mapper");


    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        const newMap: LikeJavaMap<any, any> = new HashMap<any, any>();
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        const mapConsumer: Consumer<any> = {
            accept(entry: any) {
                switch (mapperType) {
                    case FunctionType.FUNC:
                        let newEntry: MapEntry<any, any> = (<Func<MapEntry<any, any>, MapEntry<any, any>>>mapper).apply(entry);
                        newMap.put(newEntry.key, newEntry.value);
                        break;
                    case FunctionType.FUNC2: {
                        let newEntry2: MapEntry<any, any> = (<Func2<any, any, MapEntry<any, any>>>mapper).apply(entry.getKey(), entry.getValue());
                        newMap.put(newEntry2.key, newEntry2.value);
                        break;
                    }
                    case FunctionType.FUNCTION:
                        let newEntry3: MapEntry<any, any> = (<Function>mapper).call({}, entry);
                        newMap.put(newEntry3.key, newEntry3.value);
                        break;
                }
            }
        };
        forEach(map, mapConsumer);
        return newMap;
    } else {
        let list = emptyArrayList();
        const listConsumer: Consumer2<number, any> = {
            accept(index: number, element: any) {
                switch (mapperType) {
                    case FunctionType.FUNC:
                        list.add((<Func<any, any>>mapper).apply(element));
                        break;
                    case FunctionType.FUNC2:
                        list.add((<Func2<any, any, any>>mapper).apply(index, element));
                        break;
                    case FunctionType.FUNCTION:
                        list.add((<Function>mapper).call({}, element, index));
                        break;
                }
            }
        };
        forEach(iterable, listConsumer);
        return list;
    }
}


export function filter(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): Iterable<any> {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        let newMap: LikeJavaMap<any, any> = new HashMap();
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        const mapConsumer: Consumer<any> = {
            accept(entry: MapEntry<any, any>) {
                switch (predicateType) {
                    case PredicateType.PREDICATE:
                        if ((<Predicate<any>>predicate).test(entry)) {
                            newMap.put(entry.key, entry.value);
                        }
                        break;
                    case PredicateType.PREDICATE2: {
                        if ((<Predicate2<any, any>>predicate).test(entry.key, entry.value)) {
                            newMap.put(entry.key, entry.value);
                        }
                        break;
                    }
                    case PredicateType.FUNCTION:
                        if ((<Function>predicate).call({}, entry)) {
                            newMap.put(entry.key, entry.value);
                        }
                        break;
                }
            }
        };
        forEach(map, mapConsumer);
        return newMap;
    } else {
        const newList = emptyArrayList();
        const listConsumer: Consumer2<number, any> = {
            accept(index: number, element: any) {
                switch (predicateType) {
                    case PredicateType.PREDICATE:
                        if ((<Predicate<any>>predicate).test(element)) {
                            newList.add(element);
                        }
                        break;
                    case PredicateType.PREDICATE2: {
                        if ((<Predicate2<any, any>>predicate).test(index, element)) {
                            newList.add(element);
                        }
                        break;
                    }
                    case PredicateType.FUNCTION:
                        if ((<Function>predicate).call({}, element)) {
                            newList.add(element);
                        }
                        break;
                }
            }
        };
        forEach(iterable, listConsumer);
        return newList;
    }
}


export function firstN(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function, count: number): any {
    Preconditions.checkNonNull(iterable);
    Preconditions.checkTrue(count < 0 || !Numbers.isInteger(count));
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        let newMap: LikeJavaMap<any, any> = new HashMap();
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        for (let entry of map) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(entry)) {
                        newMap.put(entry.getKey(), entry.getValue());
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(entry.getKey(), entry.getValue())) {
                        newMap.put(entry.getKey(), entry.getValue());
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, entry)) {
                        newMap.put(entry.getKey(), entry.getValue());
                    }
                    break;
            }
            if (newMap.size() == count) {
                break;
            }
        }
        return newMap;
    } else {
        const newList = emptyArrayList();
        let index = 0;
        for (let element of iterable) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(element)) {
                        newList.add(element);
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(index, element)) {
                        newList.add(element);
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, element)) {
                        newList.add(element);
                    }
                    break;
            }
            index++;
            if (index == count) {
                break;
            }
        }
        return newList;
    }
}

export function first(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): any {
    let list = firstN(iterable, predicate, 1).toList();
    if (list.isEmpty()) {
        return null;
    }
    return list.get(0);
}

export function flatMap(list: Array<LinearCollection> | Collection<LinearCollection> | Set<LinearCollection>, mapper?: Func<any, any> | Func2<any, any, any> | Function): List<any> {
    let array: Array<any> = [];
    for (let collection of list) {
        array = array.concat([...collection]);
    }
    const list0: List<any> = newList(array);
    if (mapper != null) {
        return <List<any>>map(list0, mapper);
    }
    return list0;
}

export function anyMatch(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        let matched: boolean = false;
        for (let entry of map) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(entry)) {
                        matched = true;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(entry.getKey(), entry.getValue())) {
                        matched = true;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, entry)) {
                        matched = true;
                    }
                    break;
            }
            if (matched) {
                break;
            }
        }
        return matched;
    } else {
        let matched: boolean = false;
        let index: number = 0;
        for (let element of iterable) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(element)) {
                        matched = true;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(index, element)) {
                        matched = true;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, element)) {
                        matched = true;
                    }
                    break;
            }
            if (matched) {
                break;
            }
            index++;
        }

        return matched;
    }

}

export function allMatch(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        let matched: boolean = true;
        for (let entry of map) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if (!(<Predicate<any>>predicate).test(entry)) {
                        matched = false;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if (!(<Predicate2<any, any>>predicate).test(entry.getKey(), entry.getValue())) {
                        matched = false;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if (!(<Function>predicate).call({}, entry)) {
                        matched = false;
                    }
                    break;
            }
            if (!matched) {
                break;
            }
        }
        return matched;
    } else {
        let matched: boolean = true;
        let index: number = 0;
        for (let element of iterable) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if (!(<Predicate<any>>predicate).test(element)) {
                        matched = false;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if (!(<Predicate2<any, any>>predicate).test(index, element)) {
                        matched = false;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if (!(<Function>predicate).call({}, element)) {
                        matched = false;
                    }
                    break;
            }
            if (!matched) {
                break;
            }
            index++;
        }

        return matched;
    }
}


export function noneMatch(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        if (Types.isJsMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else {
            map = new HashMap(<Map<any, any>>iterable);
        }
        let matched: boolean = true;
        for (let entry of map) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(entry)) {
                        matched = false;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(entry.getKey(), entry.getValue())) {
                        matched = false;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, entry)) {
                        matched = false;
                    }
                    break;
            }
            if (!matched) {
                break;
            }
        }
        return matched;
    } else {
        let matched: boolean = true;
        let index: number = 0;
        for (let element of iterable) {
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    if ((<Predicate<any>>predicate).test(element)) {
                        matched = false;
                    }
                    break;
                case PredicateType.PREDICATE2: {
                    if ((<Predicate2<any, any>>predicate).test(index, element)) {
                        matched = false;
                    }
                    break;
                }
                case PredicateType.FUNCTION:
                    if ((<Function>predicate).call({}, element)) {
                        matched = false;
                    }
                    break;
            }
            if (!matched) {
                break;
            }
            index++;
        }

        return matched;
    }
}


export function removeIf(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function) {
    if (predicate == null) {
        return iterable;
    }
    let predicateType = Functions.judgePredicateType(predicate);
    let p: Predicate2<number, any> = {
        test(index: number, element: any) {
            let unremoved: boolean = false;
            switch (predicateType) {
                case PredicateType.PREDICATE:
                    unremoved = !(<Predicate<any>>predicate).test(element);
                    break;
                case PredicateType.PREDICATE2: {
                    unremoved = !(<Predicate2<any, any>>predicate).test(index, element);
                    break;
                }
                case PredicateType.FUNCTION:
                    unremoved = !(<Function>predicate).call({}, element);
                    break;
            }
            return unremoved;
        }
    };
    let newCollection = filter(iterable, p);
    if (Types.isArray(iterable)) {
        let array: Array<any> = <Array<any>>iterable;
        // clear all
        array.splice(0)
        array.push(...iterable);
    } else if (Types.isJsSet(iterable)) {
        let set: Set<any> = <Set<any>>iterable;
        set.clear();
        forEach(newCollection, {
            accept(element: any) {
                set.add(element);
            }
        });
    } else if (Types.isJsMap(iterable)) {
        let map: Map<any, any> = <Map<any, any>>iterable;
        map.clear();
        for (let entry of newCollection) {
            map.set(entry.key, entry.value);
        }
    } else if (Types.isJavaCollection(iterable)) {
        let collection: Collection<any> = <Collection<any>>iterable;
        collection.clear();
        collection.addAll(<Collection<any>>newCollection);
    } else if (Types.isJavaMap(iterable)) {
        let map: LikeJavaMap<any, any> = <LikeJavaMap<any, any>>iterable;
        map.clear();
        map.putAll(<LikeJavaMap<any, any>>newCollection);
    }
    return iterable;
}


export function limit(iterable:Iterable<any>, limit:number):List<any> {
    Preconditions.checkTrue(limit>=0);
    let list = iterable instanceof AbstractList ? <List<any>>iterable: newList(iterable);
    if(list.size()<=limit){
        return list;
    }
    return list.subList(0,limit);
}

export function skip(iterable:Iterable<any>, skip:number) {
    Preconditions.checkTrue(skip>=0);
    let list = iterable instanceof AbstractList ? <List<any>>iterable: newList(iterable);
    if(list.size()<=skip){
        return emptyArrayList();
    }
    return list.subList(skip, list.size());
}