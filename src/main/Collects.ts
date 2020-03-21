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
    LikeJavaSet,
    LinearCollection,
    LinkedHashMap,
    LinkedHashSet,
    LinkedList,
    List,
    MapEntry,
    TreeMap,
    TreeSet
} from "./Iterables";
import * as Preconditions from "./Preconditions";
import {Comparator} from "./Comparators";


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

export function emptyHashSet(): HashSet<any> {
    return new HashSet<any>();
}

export function emptyTreeSet(comparator?: Comparator<any>): TreeSet<any> {
    return new TreeSet<any>(<Iterable<any>>Objects.unknownNull(), comparator);
}

export function emptyHashMap(): HashMap<any, any> {
    return new HashMap<any, any>();
}

export function emptyTreeMap(comparator?: Comparator<any>): TreeMap<any, any> {
    return new TreeMap<any, any>(<Map<any, any>>Objects.unknownNull(), comparator);
}

export function newArrayList(iterable?: Iterable<any>): ArrayList<any> {
    return new ArrayList(iterable);
}

export function newLinkedList(iterable?: Iterable<any>): LinkedList<any> {
    return new LinkedList<any>(iterable);
}

export function newHashSet(iterable?: Iterable<any>): HashSet<any> {
    return new HashSet<any>(iterable);
}

export function newLinkedHashSet(iterable?: Iterable<any>): HashSet<any> {
    return new LinkedHashSet<any>(iterable);
}

export function newTreeSet(iterable?: Iterable<any>, comparator?: Comparator<any>): HashSet<any> {
    return new TreeSet<any>(iterable, comparator);
}

export function newHashMap(map?: Map<any, any> | LikeJavaMap<any, any>): HashMap<any, any> {
    return new HashMap<any, any>(map);
}

export function newLinkedHashMap(map?: Map<any, any> | LikeJavaMap<any, any>): LinkedHashMap<any, any> {
    return new LinkedHashMap<any, any>(map);
}

export function newTreeMap(map?: Map<any, any> | LikeJavaMap<any, any>, keyComparator?: Comparator<any>): TreeMap<any, any> {
    return new TreeMap<any, any>(map, keyComparator);
}

export function asIterable(obj: any): List<any> {
    return Iterables.asIterable(obj);
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

export function asSet(iterable: Iterable<any>, comparator?: Comparator<any>): LikeJavaSet<any> {
    if (comparator == null) {
        return newLinkedHashSet(iterable);
    }
    return newTreeSet(iterable, comparator);
}

export function asList(iterable: Iterable<any>): List<any> {
    return new ArrayList(iterable);
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

function _consumeMapEntry(entry: MapEntry<any, any>, consumerType: ConsumerType, consumer: Consumer<any> | Consumer2<number, any> | Function): void {
    switch (consumerType) {
        case ConsumerType.CONSUMER:
            (<Consumer<MapEntry<any, any>>>consumer).accept(entry);
            break;
        case ConsumerType.CONSUMER2: {
            (<Consumer2<any, any>>consumer).accept(entry.key, entry.value);
            break;
        }
        case ConsumerType.FUNCTION:
            (<Function>consumer).call({}, entry);
            break;
    }
}

function _judgePredicateConsumeMapEntry(entry: MapEntry<any, any>, consumePredicateType: PredicateType, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function): boolean {
    let consumeable: boolean = true;
    switch (consumePredicateType) {
        case PredicateType.PREDICATE:
            consumeable = (<Predicate<any>>consumePredicate).test(entry);
            break;
        case PredicateType.PREDICATE2:
            consumeable = (<Predicate2<any, any>>consumePredicate).test(entry.key, entry.value);
            break;
        case PredicateType.FUNCTION:
            consumeable = (<Function>consumePredicate).call({}, entry);
    }
    return consumeable;
}

function _judgeBreakConsumeMapEntry(entry: MapEntry<any, any>, breakPredicateType: PredicateType, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): boolean {
    let breakable: boolean = false;
    switch (breakPredicateType) {
        case PredicateType.PREDICATE:
            breakable = (<Predicate<any>>breakPredicate).test(entry);
            break;
        case PredicateType.PREDICATE2:
            breakable = (<Predicate2<any, any>>breakPredicate).test(entry.key, entry.value);
            break;
        case PredicateType.FUNCTION:
            breakable = (<Function>breakPredicate).call({}, entry);
    }
    return breakable;
}


function _consumeListItem(index: number, element: any, consumerType: ConsumerType, consumer: Consumer<any> | Consumer2<number, any> | Function): void {
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
}

function _judgePredicateConsumeListItem(index: number, element: any, consumePredicateType: PredicateType, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function): boolean {
    let consumeable: boolean = true;
    switch (consumePredicateType) {
        case PredicateType.PREDICATE:
            consumeable = (<Predicate<any>>consumePredicate).test(element);
            break;
        case PredicateType.PREDICATE2:
            consumeable = (<Predicate2<any, any>>consumePredicate).test(index, element);
            break;
        case PredicateType.FUNCTION:
            consumeable = (<Function>consumePredicate).call({}, element, index);
    }
    return consumeable;
}

function _judgeBreakConsumeListItem(index: number, element: any, breakPredicateType: PredicateType, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): boolean {
    let breakable: boolean = false;
    switch (breakPredicateType) {
        case PredicateType.PREDICATE:
            breakable = (<Predicate<any>>breakPredicate).test(element);
            break;
        case PredicateType.PREDICATE2:
            breakable = (<Predicate2<any, any>>breakPredicate).test(index, element);
            break;
        case PredicateType.FUNCTION:
            breakable = (<Function>breakPredicate).call({}, element, index);
    }
    return breakable;
}


export function forEach(iterable: Iterable<any>, consumer: Consumer<any> | Consumer2<number, any> | Function, consumePredicate?: Predicate<any> | Predicate2<any, any> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): void {
    Preconditions.checkNonNull(iterable);
    let consumePredicateType = Functions.judgePredicateType(consumePredicate);
    let consumerType: ConsumerType = Functions.judgeConsumerType(consumer);
    let breakPredicateType = Functions.judgePredicateType(breakPredicate);
    Preconditions.checkTrue(consumerType != ConsumerType.UNKNOWN, "illegal consumer");

    let isMap = Types.isMap(iterable);
    if (isMap) {
        let map;
        if (Types.isJavaMap(iterable)) {
            map = <LikeJavaMap<any, any>>iterable;
        } else if (Types.isJsMap(iterable)) {
            map = new HashMap(<Map<any, any>>iterable);
        }
        for (let entry of map) {
            if (_judgePredicateConsumeMapEntry(entry, consumePredicateType, consumePredicate)) {
                _consumeMapEntry(entry, consumerType, consumer);
            }
            if (_judgeBreakConsumeMapEntry(entry, breakPredicateType, breakPredicate)) {
                break;
            }
        }
    } else {
        let index = 0;
        for (let element of iterable) {
            if (_judgePredicateConsumeListItem(index, element, consumePredicateType, consumePredicate)) {
                _consumeListItem(index, element, consumerType, consumer);
            }
            if (_judgeBreakConsumeListItem(index, element, breakPredicateType, breakPredicate)) {
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
        const newMap: LikeJavaMap<any, any> = new HashMap<any, any>();
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
        forEach(iterable, mapConsumer);
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


export function filter(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function, breakPredicate?: Predicate<any> | Predicate2<any, any> | Function): Iterable<any> {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let newMap: LikeJavaMap<any, any> = new HashMap();
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
        forEach(iterable, mapConsumer, <Predicate2<any, any>>Objects.unknownNull(), breakPredicate);
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
        forEach(iterable, listConsumer, <Predicate2<any, any>>Objects.unknownNull(), breakPredicate);
        return newList;
    }
}


export function firstN(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function, count: number): any {
    Preconditions.checkNonNull(iterable);
    Preconditions.checkTrue(count > 0 || Numbers.isInteger(count));
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let isMap = Types.isMap(iterable);
    if (isMap) {
        let newMap: LikeJavaMap<any, any> = new HashMap();
        forEach(iterable, {
            accept(entry: MapEntry<any, any>) {
                newMap.put(entry.key, entry.value);
            }
        }, predicate, {
            test(entry: MapEntry<any, any>) {
                return newMap.size() >= count;
            }
        });
        return newMap;
    } else {
        const newList = emptyArrayList();
        forEach(iterable, {
            accept(index: number, element: any) {
                newList.add(element);
            }
        }, predicate, {
            test(index: number, element: any) {
                return newList.size() >= count;
            }
        })
        return newList;
    }
}

export function first(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): any {
    let list = asList(firstN(iterable, predicate, 1));
    if (list.isEmpty()) {
        return null;
    }
    return list.get(0);
}

export function flatMap(list: Array<LinearCollection> | Collection<LinearCollection> | Set<LinearCollection>, mapper?: Func<any, any> | Func2<any, any, any> | Function): List<any> {
    let array: Array<any> = [];
    for (let collection of list) {
        if (collection != null) {
            array = array.concat([...collection]);
        }
    }
    const list0: List<any> = newArrayList(array);
    if (mapper != null) {
        return <List<any>>map(list0, mapper);
    }
    return list0;
}

export function anyMatch(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function): boolean {
    Preconditions.checkNonNull(iterable);
    let predicateType = Functions.judgePredicateType(predicate);
    Preconditions.checkTrue(predicateType != PredicateType.UNKNOWN, "illegal predicate");
    let matched: boolean = false;
    forEach(iterable, () => {
        matched = true;
    }, predicate, () => {
        return matched;
    });
    return matched;

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
    let unmatched: boolean = true;
    forEach(iterable, () => {
        unmatched = false;
    }, predicate, () => {
        return !unmatched;
    })
    return unmatched;
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


export function limit(iterable: Iterable<any>, limit: number): List<any> {
    Preconditions.checkTrue(limit >= 0);
    let list = iterable instanceof AbstractList ? <List<any>>iterable : newArrayList(iterable);
    if (list.size() <= limit) {
        return list;
    }
    return list.subList(0, limit);
}

export function skip(iterable: Iterable<any>, skip: number) {
    Preconditions.checkTrue(skip >= 0);
    let list = iterable instanceof AbstractList ? <List<any>>iterable : newArrayList(iterable);
    if (list.size() <= skip) {
        return emptyArrayList();
    }
    return list.subList(skip, list.size());
}