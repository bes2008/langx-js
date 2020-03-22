import * as Booleans from "./Booleans";
import * as Types from "./Types";
import * as Numbers from "./Numbers";
import * as Objects from "./Objects";
import * as Functions from "./Functions";
import * as Emptys from "./Emptys";
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
    AbstractCollection,
    AbstractList, AbstractMap, AbstractSet,
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
    MapEntry, SimpleMapEntry,
    TreeMap,
    TreeSet
} from "./Iterables";
import * as Preconditions from "./Preconditions";
import {Comparator, ReverseComparator} from "./Comparators";
import exp = require("constants");


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

export function emptyLinkedHashSet(): LinkedHashSet<any> {
    return new LinkedHashSet<any>();
}

export function emptyTreeSet(comparator?: Comparator<any>): TreeSet<any> {
    return new TreeSet<any>(<Iterable<any>>Objects.unknownNull(), comparator);
}

export function emptyLinkedHashMap(): LinkedHashMap<any, any> {
    return new LinkedHashMap<any, any>();
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

export function newLinkedHashSet(iterable?: Iterable<any>): LinkedHashSet<any> {
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
                return !Objects.isNull(element);
            }
        })];
    } else {
        let list = [...iterable];
        let collection = <Collection<any>>iterable;
        collection.clear();
        collection.addAll(<Collection<any>>filter(list, (element) => {
            return !Objects.isNull(element);
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
            accept(entry: MapEntry<any, any>) {
                switch (mapperType) {
                    case FunctionType.FUNC:
                        let newEntry: MapEntry<any, any> = (<Func<MapEntry<any, any>, MapEntry<any, any>>>mapper).apply(entry);
                        newMap.put(newEntry.key, newEntry.value);
                        break;
                    case FunctionType.FUNC2: {
                        let newEntry2: MapEntry<any, any> = (<Func2<any, any, MapEntry<any, any>>>mapper).apply(entry.key, entry.value);
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
        forEach(iterable, (entry: MapEntry<any, any>) => {
            newMap.put(entry.key, entry.value);
        }, <Predicate2<any, any>>Objects.unknownNull(), breakPredicate);
        return newMap;
    } else {
        const newList = emptyArrayList();
        forEach(iterable, (element) => {
            newList.add(element);
        }, predicate, breakPredicate);
        return newList;
    }
}


export function findN(iterable: Iterable<any>, predicate: undefined | null | Predicate<any> | Predicate2<any, any> | Function, count: number): any {
    Preconditions.checkTrue(Numbers.isInteger(count) && count > 0);
    if (iterable == null) {
        return null;
    }
    if (predicate == null) {
        predicate = Functions.truePredicate();
    }
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
        });
        return newList;
    }
}

export function findFirst(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function | null | undefined): any {
    let list = asList(findN(iterable, predicate, 1));
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
    let matched: boolean = true;
    let nonPredicate = Functions.nonPredicateAny(predicate);
    forEach(iterable, () => {
        matched = false;
    }, nonPredicate, () => {
        return !matched;
    });
    return matched;
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
    });
    return unmatched;
}


export function removeIf(iterable: Iterable<any>, predicate: Predicate<any> | Predicate2<any, any> | Function) {
    if (predicate == null) {
        return iterable;
    }
    // step 1: find all will not removed
    let newCollection = filter(iterable, Functions.nonPredicateAny(predicate));
    // step 2: clear all and fill all will not removed
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

export function distinct(iterable: Iterable<any>, comparator?: Comparator<any>): LikeJavaSet<any> {
    return newTreeSet(iterable, comparator);
}

export function reverse(iterable: Iterable<any>, newOne?: boolean) {
    if(newOne==null){
        newOne = true;
    }
    if (Types.isArray(iterable)) {
        return newOne ? [...iterable].reverse() : (<Array<any>>iterable).reverse();
    }
    if(iterable instanceof AbstractList){
        let list:AbstractList<any> = <AbstractList<any>>iterable;
        let array:Array<any>=[...list].reverse();
        if(newOne){
            return new ArrayList(array);
        }
        list.clear();
        for(let element of array){
            list.add(element);
        }
        return list;
    }
    if (iterable instanceof Set) {
        let set: Set<any> = <Set<any>>iterable;
        let array = [...iterable].reverse();
        if (newOne) {
            return new Set<any>(array);
        }

        set.clear();
        for (let element of array) {
            set.add(element);
        }
        return set;
    }
    if(iterable instanceof AbstractSet){
        let set:AbstractSet<any> = <AbstractSet<any>>iterable;
        let array:Array<any>=[...set].reverse();
        if(newOne){
            if(iterable instanceof TreeSet){
                return new TreeSet(array,new ReverseComparator((<TreeSet<any>>iterable).getComparator()));
            }
            return new LinkedHashSet(array);
        }
        set.clear();
        if(set instanceof TreeSet){
            let treeSet = <TreeSet<any>>set;
            treeSet.setComparator(new ReverseComparator(treeSet.getComparator()));
        }
        for(let element of array){
            set.add(element);
        }
        return set;
    }
    if (iterable instanceof Map) {
        let map: Map<any, any> = <Map<any, any>>iterable;
        let entryArray:Array<[any,any]> = Array.from(map.entries()).reverse();
        if (newOne) {
            return new Map<any, any>(entryArray);
        }
        map.clear();
        for (let [key, value] of entryArray) {
            map.set(key, value);
        }
        return map;
    }
    if(iterable instanceof AbstractMap){
        let map:AbstractMap<any, any> =<AbstractMap<any, any>>iterable;
        let entryArray:Array<MapEntry<any, any>> = [...map].reverse();
        if(newOne){
            let newMap:AbstractMap<any, any>;
            if(iterable instanceof TreeMap){
                newMap =new TreeMap(null, new ReverseComparator((<TreeMap<any,any>>iterable).getComparator()));
            }else {
                newMap = new LinkedHashMap();
            }
            for (let entry of entryArray){
                newMap.put(entry.key,entry.value);
            }
            return newMap;
        }
        map.clear();
        if(iterable instanceof TreeMap){
            let treeMap:TreeMap<any, any> = <TreeMap<any,any>>iterable;
            treeMap.setComparator(new ReverseComparator(treeMap.getComparator()));
        }
        for (let entry of entryArray){
            map.put(entry.key,entry.value);
        }
        return map;
    }
    return iterable;
}

export function count(iterable:Iterable<any>):number {
    return Emptys.getLength(iterable);
}


export function contains(iterable:Iterable<any>, element:any):boolean {
    if(Emptys.isEmpty(iterable)){
        return false;
    }
    return anyMatch(iterable,(e)=>{
        return Objects.equals(e, element, false);
    });
}

export function addAll(iterable:Iterable<any>, appendment:Iterable<any>):void {
    Preconditions.checkNonNull(iterable);
    Preconditions.checkNonNull(appendment);
    if(iterable instanceof Array){
        let array:Array<any> =<Array<any>>iterable;
        array.splice(array.length, 0, ...appendment);
        return;
    }
    if(iterable instanceof Set){
        let set:Set<any> = <Set<any>>iterable;
        for(let element of appendment){
            set.add(element);
        }
        return;
    }
    if(iterable instanceof AbstractCollection){
        (<AbstractCollection<any>>iterable).addAll(appendment);
        return;
    }
    if(iterable instanceof AbstractMap){
        let map:AbstractMap<any, any> = <AbstractMap<any, any>>iterable;
        for(let entry of appendment){
            if(entry instanceof Array){
                Preconditions.checkTrue((<Array<any>>entry).length>=2);
                map.put(entry[0],entry[1])
            }else if(entry instanceof SimpleMapEntry){
                map.put(entry.key, entry.value);
            }
        }
        return;
    }
    if(iterable instanceof Map){
        let map:Map<any,any> = <Map<any,any>>iterable;
        for(let entry of appendment){
            if(entry instanceof Array){
                Preconditions.checkTrue((<Array<any>>entry).length>=2);
                map.set(entry[0],entry[1])
            }else if(entry instanceof SimpleMapEntry){
                map.set(entry.key, entry.value);
            }
        }
        return;
    }
}

/**
 * Judge every element in {judgement} will in the {iterable}
 * @param iterable
 * @param judgement
 */
export function containsAll(iterable:Iterable<any>, judgement:Iterable<any>):boolean{
    if(Emptys.isEmpty(iterable)){
        return false;
    }
    Preconditions.checkNonNull(judgement);
    return allMatch(judgement,(element)=>{
        return contains(iterable, element);
    });
}

export function containsAny(iterable:Iterable<any>, judgement:Iterable<any>):boolean{
    if(Emptys.isEmpty(iterable)){
        return false;
    }
    Preconditions.checkNonNull(judgement);
    return anyMatch(judgement,(element)=>{
        return contains(iterable, element);
    });
}

export function containsNone(iterable:Iterable<any>, judgement:Iterable<any>):boolean {
    if(Emptys.isEmpty(iterable)){
        return true;
    }
    return noneMatch(judgement,(element)=>{
        return contains(iterable, element);
    });
}