import * as Types from "./Types";
import * as Objects from "./Objects";
import * as Preconditions from "./Preconditions";
import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import * as Booleans from "./Booleans";
import * as Pipeline from "./Pipeline";
import {emptyArrayList} from "./Collects";
import {UnsupportOperationException} from "./Exceptions";
import {Comparator, HashedComparator} from "./Comparators";
import {Delegatable} from "./Delegatables";
import {binarySearch, SearchResult} from "./Algorithms";

export abstract class AbstractIterator<E extends any> implements Iterator<E> {
    abstract next(...args: [] | [undefined]): IteratorResult<any>;

    return(value?: any): IteratorResult<any> {
        return {
            value: value,
            done: true
        };
    }

    throw(e?: any): IteratorResult<any> {
        if (Types.isError(e)) {
            throw e;
        }
        return {
            value: null,
            done: true
        }
    }
}

export class ObjectPropertiesIterator extends AbstractIterator<any> implements IterableIterator<any> {
    private readonly obj: Object;
    private keysIter: Iterator<any>;

    constructor(object: Object) {
        super();
        this.obj = object;
        this.keysIter = new ArrayList(Object.keys(object))[Symbol.iterator]();
    }

    [Symbol.iterator](): IterableIterator<any> {
        return this;
    }

    next(...args: [] | [undefined]): IteratorResult<any> {
        let keyResult: IteratorResult<any> = this.keysIter.next();
        return {
            value: this.obj[keyResult.value],
            done: keyResult.done
        };
    }

}

export class NullIterable implements Iterable<any> {
    [Symbol.iterator](): Iterator<any> {
        return new NullIterator();
    }
}

export class NullIterator extends AbstractIterator<any> {
    next(...args: [] | [undefined]): IteratorResult<any> {
        return {
            done: true,
            value: undefined
        };
    }
}

export class NoopIterator extends NullIterator {
}


export interface Collection<E extends any> extends Iterable<E> {
    add(e: E): boolean;

    addAll(c: Collection<E>): boolean;

    clear(): void;

    contains(e: E): boolean;

    containsAll(c: Collection<E>): boolean;

    [Symbol.iterator](): Iterator<E>;

    remove(e: E): E;

    removeAll(c: Collection<E>): boolean;

    retainAll(c: Collection<E>): boolean;

    size(): number;

    isEmpty(): boolean;

    toArray(array?: Array<E>): Array<E>;

    hashCode(): number;
}

export type LinearCollection = Collection<any> | Set<any> | Array<any>;

export abstract class AbstractCollection<E> implements Collection<E> {

    abstract add(e: E): boolean ;

    addAll(c: Collection<E>): boolean {
        let result: boolean = true;
        for (let e of c) {
            if (!this.add(e)) {
                result = false;
            }
        }
        return result;
    }

    abstract clear();

    abstract contains(e: E): boolean ;

    containsAll(c: Collection<E>): boolean {
        for (let e of c) {
            if (!this.contains(e)) {
                return false;
            }
        }
        return true;
    }

    removeAll(c: Collection<E>): boolean {
        let result: boolean = true;
        for (let e of c) {
            if (!this.remove(e)) {
                result = false;
            }
        }
        return result;
    }

    abstract retainAll(c: Collection<E>): boolean;


    abstract remove(e: E): E;

    abstract toArray(array?: Array<E>): Array<E>;

    isEmpty(): boolean {
        return this.size() == 0;
    }

    size(): number {
        return 0;
    }

    abstract [Symbol.iterator](): Iterator<E> ;

    hashCode(): number {
        return hashCode(this);
    }
}

export interface List<E> extends Collection<E> {
    get(index: number): E;

    set(index: number, e: E): E;

    removeByIndex(index:number);

    indexOf(e: E): number;

    lastIndexOf(e: E): number;

    subList(fromIndex: number, toIndex: number);
}

export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
    protected length: number = 0;


    abstract add(e: E, index?: number): boolean;

    abstract get(index: number): E;

    abstract set(index: number, e: E): E;

    abstract subList(fromIndex: number, toIndex: number) ;

    contains(e: E): boolean {
        return this.indexOf(e) != -1;
    }

    size(): number {
        return this.length;
    }

    abstract lastIndexOf(e: E): number ;

    abstract indexOf(e: E): number;

    removeByIndex(index: number) {
        if(index<0|| index>=this.size()){
            return;
        }
    }


}

export class ArrayList<E> extends AbstractList<E> {
    private array: Array<E> = [];

    new(): ArrayList<E> {
        return new ArrayList<E>();
    };

    constructor(arraylist?: Collection<E> | Array<E> | Set<E> | Iterable<E> | IterableIterator<E>) {
        super();
        if (arraylist == null) {
            this.array = [];
        } else {
            if (Types.isArray(arraylist)) {
                this.array = <Array<E>>arraylist;
            } else {
                this.array = new Array<E>(...arraylist);
            }
        }
        this.length = this.array.length;
    }

    get(index: number): E {
        Preconditions.checkIndex(index >= 0 && index < this.length);
        return this.array[index];
    }

    set(index: number, e: E): E {
        let oldValue: E = this.get(index);
        this.array[index] = e;
        return oldValue;
    }

    indexOf(e: E): number {
        let e0;
        for (let i = 0; i < this.size(); i++) {
            e0 = this.get(i);
            if (e0 == e) {
                return i;
            }
        }
        return -1;
    }

    lastIndexOf(e: E): number {
        let e0;
        for (let i = this.size(); i >= 0; i--) {
            e0 = this.get(i);
            if (e0 == e) {
                return i;
            }
        }
        return -1;
    }

    subList(fromIndex: number, toIndex: number) {
        Preconditions.checkTrue(fromIndex >= toIndex);
        let result = new ArrayList();
        let i = fromIndex;
        while (i < toIndex) {
            result.add(this.get(i));
            i++;
        }
        return result;
    }

    add(e: E, index?: number): boolean {
        if (index == null || index >= this.length) {
            this.array.push(e);
        } else if (index < 0) {
            this.array.unshift(e);
        } else {
            this.array.splice(index, 0, e);
        }
        this.length++;
        return true;
    }

    clear(): void {
        if (this.length > 0) {
            this.array.splice(0);
        }
        this.length = 0;
    }

    remove(e: E): E {
        let newArray: Array<E> = [];
        for (let e0 of this.array) {
            if (e0 != e) {
                newArray.push(e0);
            }
        }
        this.array = newArray;
        this.length = this.array.length;
        return e;
    }

    retainAll(c: Collection<E>): boolean {
        let newArray: Array<E> = [];
        let containAll: boolean = true;
        for (let e of this.array) {
            if (c.contains(e)) {
                newArray.push(e);
            } else {
                containAll = false;
            }
        }
        this.array = newArray;
        this.length = this.array.length;
        return containAll;
    }

    toArray(array?: Array<E>): Array<E> {
        if (array == null) {
            return this.array;
        }
        array.concat(this.array);
        return array;
    }

    [Symbol.iterator](): Iterator<E> {
        return new ArrayListIterator(this);
    }


    removeByIndex(index: number) {
        if(index<0|| index>=this.size()){
            return;
        }
        this.array.splice(index,1);
        this.length--;
    }
}

export class ArrayListIterator<E extends any> extends AbstractIterator<E> {
    private index: number = 0;
    private array: ArrayList<E>;

    constructor(array: ArrayList<E>) {
        super();
        this.array = array;
    }

    next(...args: [] | [undefined]): IteratorResult<E> {
        if (this.index < this.array.size()) {
            return {
                value: this.array.get(this.index++),
                done: false
            };
        } else {
            return {
                done: true,
                value: null
            };
        }
    }

}

interface LinkedListNode<E extends any> {
    e: E;
    next: LinkedListNode<E>;
    prev: LinkedListNode<E>;
}

export class LinkedList<E> extends AbstractList<E> {
    first: LinkedListNode<E>;
    last: LinkedListNode<E>;

    constructor(c?: Collection<E> | Array<E> | Set<E> | Iterable<E> | IterableIterator<E>) {
        super();
        this.first = this.last = <LinkedListNode<E>>Objects.unknownNull()
        if (c != null) {
            this.addAll(new ArrayList(c))
        }
    }

    clear() {
        this.last = this.first = <LinkedListNode<E>>Objects.unknownNull();
        this.length = 0
    }

    get(index: number): E {
        let node: LinkedListNode<E> = this.getNode(index);
        if (node != null) {
            return node.e;
        }
        return <E>Objects.unknownNull();
    }

    indexOf(e: E): number {
        let i: number = 0;
        let node: LinkedListNode<E> = this.first;
        while (i < this.length) {
            if (node != null) {
                if (node.e != e) {
                    node = node.next;
                } else {
                    return i;
                }
            }
            i++;
        }
        return -1;
    }

    lastIndexOf(e: E): number {
        let i: number = this.length - 1;
        let node: LinkedListNode<E> = this.last;
        while (i >= 0) {
            if (node != null) {
                if (node.e != e) {
                    node = node.prev;
                } else {
                    return i;
                }
            }
            i++;
        }
        return -1;
    }

    [Symbol.iterator](): Iterator<E> {
        return new LinkedListIterator(this);
    }

    remove(e: E): E {
        let node: LinkedListNode<E> = this.first;
        while (node != null) {
            if (node.e == e) {
                this.removeNode(node);
            }
            node = node.next;
        }
        return e;
    }


    removeByIndex(index: number) {
        if(index<0|| index>=this.size()){
            return;
        }
        let node: LinkedListNode<E> = this.getNode(index);
        this.removeNode(node);
    }

    retainAll(c: Collection<E>): boolean {
        let node: LinkedListNode<E> = this.first;
        while (node != null) {
            if (!c.contains(node.e)) {
                this.removeNode(node);
            }
            node = node.next;
        }
        return false;
    }

    private removeNode(node: LinkedListNode<E>): void {
        Preconditions.checkNonNull(node);
        let prev: LinkedListNode<E> = node.prev;
        if (prev != null) {
            prev.next = node.next;
        }
        if (node.next != null) {
            node.next.prev = prev;
        }
        if (this.last == node) {
            this.last = prev;
        }
        if (this.first == node) {
            this.first = node.next
        }
        this.length--;
    }

    private getNode(index: number): LinkedListNode<E> {
        Preconditions.checkTrue(index >= 0 && index < this.length);
        let node;
        if (index < this.length >> 1) {
            // loop from the first node
            let i: number = 0;
            node = this.first;
            while (i < index) {
                node = node.next;
                i++;
            }
        } else {
            // loop from the last node
            let i: number = this.length - 1;
            node = this.last;
            while (i > index) {
                node = node.prev
                i--;
            }
        }
        return node;
    }

    set(index: number, e: E): E {
        let oldNode: LinkedListNode<E> = this.getNode(index);
        let oldValue = oldNode.e;
        if (oldNode != null) {
            oldNode.e = e;
        }
        return oldValue;
    }

    subList(fromIndex: number, toIndex: number) {
        if (fromIndex < 0) {
            fromIndex = 0;
        }
        if (fromIndex >= this.length) {
            return new LinkedList();
        }
        if (toIndex > this.length) {
            toIndex = this.length;
        }

        let node: LinkedListNode<E> = this.getNode(fromIndex);
        let array: ArrayList<E> = new ArrayList();
        array.add(node.e);
        fromIndex++;
        while (fromIndex < toIndex) {
            node = node.next;
            array.add(node.e);
        }
        return new LinkedList(array);
    }

    add(e: E, index?: number): boolean {
        if (index == null || index >= this.length) {
            let newNode: LinkedListNode<E> = {
                e: e,
                prev: this.last,
                next: <LinkedListNode<E>>Objects.unknownNull()
            };

            if (this.last != null) {
                this.last.next = newNode;
            }
            this.last = newNode;
            if (this.first == null) {
                this.first = this.last;
            }
        } else if (index <= 0) {
            let newNode: LinkedListNode<E> = {
                e: e,
                prev: <LinkedListNode<E>>Objects.unknownNull(),
                next: this.first
            };
            if (this.first != null) {
                this.first.prev = newNode;
            }
            this.first = newNode;
            if (this.last == null) {
                this.last = this.first;
            }
        } else {
            let next: LinkedListNode<E> = this.getNode(index);
            let prev = next != null ? next.prev : <LinkedListNode<E>>Objects.unknownNull();

            let newNode: LinkedListNode<E> = {
                e: e,
                prev: prev,
                next: next
            };
            if (prev != null) {
                prev.next = newNode;
            }
            if (next != null) {
                next.prev = newNode;
            }
        }

        this.length++;
        return true;
    }

    toArray(array?: Array<E>): Array<E> {
        let arr = array == null ? [] : array;
        for (let element of this) {
            arr.push(element);
        }
        return arr
    }

}

export class LinkedListIterator<E extends any> extends AbstractIterator<any> {
    private node: LinkedListNode<E>;

    constructor(list: LinkedList<E>) {
        super();
        this.node = list.first;
    }

    next(...args: [] | [undefined]): IteratorResult<E> {
        if (this.node != null) {
            let n = this.node;
            this.node = n.next;
            return {
                value: n.e,
                done: false
            }
        }
        return {
            done: true,
            value: null
        }
    }

}

export interface LikeJavaSet<E extends any> extends Collection<E> {

}

export abstract class AbstractSet<E extends any> extends AbstractCollection<E> implements LikeJavaSet<E> {

}

export class HashSet<E> extends AbstractSet<E> {
    private map: HashMap<E, null>;

    constructor(list?: Collection<E> | Array<E> | Set<E> | Iterable<E> | IterableIterator<E>) {
        super();
        this.map = new HashMap<E, null>();
        if (list != null) {
            if (list instanceof AbstractCollection) {
                this.addAll(list);
            } else {
                for (let element of list) {
                    this.add(element);
                }
            }
        }
    }

    add(e?: E): boolean {
        if (e == null) {
            return false;
        }
        if (this.map.containsKey(e)) {
            return false;
        }
        this.map.put(e, null);
        return true;
    }

    size(): number {
        return this.map.size();
    }

    clear() {
        this.map.clear();
    }

    contains(e: E): boolean {
        return this.map.containsKey(e);
    }

    [Symbol.iterator](): Iterator<E> {
        return this.map.keySet()[Symbol.iterator]();
    }

    remove(e: E): E {
        this.map.remove(e);
        return e;
    }

    retainAll(c: Collection<E>): boolean {
        let removed: ArrayList<E> = new ArrayList<E>();
        for (let element of this.toArray()) {
            if (element != null && !c.contains(element)) {
                removed.add(element);
            }
        }
        this.removeAll(removed);
        return true;
    }

    toArray(array?: Array<E>): Array<E> {
        if (array == null) {
            return Collects.toArray(this.map.keySet());
        }
        array.push(...this.map.keySet());
        return array;
    }

}

export interface MapEntry<K, V> {
    key: K;
    value?: V;

    hashCode(): number;
}

export class MapEntryKeyComparator<K, V> implements Comparator<MapEntry<K, V>>, Delegatable<Comparator<K>> {
    private keyComparator: Comparator<K>;

    constructor(keyComparator?: Comparator<K>) {
        this.keyComparator = keyComparator == null ? new HashedComparator<K>() : keyComparator;
    }

    compare(e1: MapEntry<K, V>, e2: MapEntry<K, V>): number {
        return this.keyComparator.compare(e1.key, e2.key);
    }

    setDelegate(keyComparator: Comparator<K>): void {
        this.keyComparator = keyComparator == null ? new HashedComparator<K>() : keyComparator;
    }

    getDelegate(): Comparator<K> {
        return this.keyComparator;
    }
}

export class SimpleMapEntry<K, V> implements MapEntry<K, V> {
    key: K;
    value?: V;

    constructor(key: K, value?: V) {
        this.key = key;
        this.value = value;
    }

    hashCode(): number {
        return (this.key == null ? 0 : Objects.hashCode(this.key)) ^
            (this.value == null ? 0 : Objects.hashCode(this.value));
    }

}


export interface LikeJavaMap<K extends any, V extends any> extends Iterable<MapEntry<any, any>> {
    clear(): void;

    containsKey(key: K): boolean;

    containsValue(value: V): boolean;

    get(key: K): V;

    keySet(): LikeJavaSet<K>;

    values(): Collection<V>;

    entrySet(): LikeJavaSet<MapEntry<K, V>>;

    put(key: K, value: V): V | undefined;

    putAll(map: LikeJavaMap<K, V>): void;

    remove(key: K): V | undefined;

    isEmpty(): boolean;

    size(): number;

    [Symbol.iterator](): Iterator<MapEntry<any, any>>;

    hashCode(): number;
}

export abstract class AbstractMap<K extends any, V extends any> implements LikeJavaMap<K, V> {
    abstract size(): number;

    isEmpty(): boolean {
        return this.size() == 0;
    }

    abstract clear(): void;

    abstract containsKey(key: K): boolean;

    abstract containsValue(value: V): boolean;

    abstract get(key: K): V;

    abstract keySet(): LikeJavaSet<K>;

    abstract values(): Collection<V>;

    abstract entrySet(): LikeJavaSet<MapEntry<K, V>>;

    abstract put(key?: K, value?: V): V | undefined;

    putAll(map: LikeJavaMap<K, V>): void {
        if (map != null) {
            for (let entry of map) {
                this.put(entry.key, entry.value);
            }
        }
    }

    abstract remove(key: K): V | undefined;

    abstract [Symbol.iterator](): Iterator<MapEntry<any, any>>;

    hashCode(): number {
        return hashCode(this);
    }
}

export class TreeMap<K extends any, V extends any> extends AbstractMap<K, V> {
    private readonly list: ArrayList<MapEntry<K, V>> = new ArrayList<MapEntry<K, V>>();
    private readonly map: HashMap<K, V> = new HashMap<K, V>();
    private comparator: MapEntryKeyComparator<K, V> = <MapEntryKeyComparator<K, V>>Objects.unknownNull();


    constructor(map?: LikeJavaMap<K, V> | Map<K, V>, comparator?: Comparator<K>) {
        super();
        if (map != null) {
            if (map instanceof Map) {
                this.comparator = new MapEntryKeyComparator<K, V>(comparator);
                for (let entry of map.entries()) {
                    this.put(entry[0], entry[1]);
                }
            } else if (map instanceof AbstractMap) {
                if (map instanceof TreeMap) {
                    this.comparator = new MapEntryKeyComparator<K, V>((<TreeMap<K, V>>map).getComparator());
                }
                if (this.comparator == null) {
                    this.comparator = new MapEntryKeyComparator<K, V>(new HashedComparator());
                }
                this.putAll(map);
            }
        }
        if (this.comparator == null) {
            this.comparator = new MapEntryKeyComparator<K, V>(new HashedComparator());
        }
    }

    getComparator(): Comparator<K> {
        return this.comparator.getDelegate();
    }

    [Symbol.iterator](): Iterator<MapEntry<any, any>> {
        return this.list[Symbol.iterator]();
    }

    clear(): void {
        this.list.clear();
        this.map.clear();
    }

    containsKey(key: K): boolean {
        return this.map.containsKey(key);
    }

    containsValue(value: V): boolean {
        return this.map.containsValue(value);
    }

    entrySet(): LikeJavaSet<MapEntry<K, V>> {
        return <LikeJavaSet<MapEntry<K, V>>>new MapInnerEntrySet(this.map, this.list);
    }

    get(key: K): V {
        return this.map.get(key);
    }

    keySet(): LikeJavaSet<K> {
        return new MapInnerKeySet(this, Pipeline.of(this.list).map((item: MapEntry<K, V>) => {
            return item.key;
        }).toList());
    }

    put(key: K, value?: V): V | undefined {
        if (key == null) {
            return value;
        }
        let newEntry: MapEntry<K, V> = new SimpleMapEntry(key, value);
        let searchResult: SearchResult<MapEntry<K, V>> = binarySearch(this.list, newEntry, this.comparator, 0, this.list.size() - 1);
        let oldValue: V;
        if (searchResult.value != null) {
            let entry: MapEntry<K, V> = searchResult.value;
            oldValue = entry.value == null ? <V>Objects.unknownNull() : entry.value;
            entry.value = value;
        } else {
            oldValue = <V>Objects.unknownNull();
            this.list.add(newEntry, searchResult.index);
        }
        this.map.put(key, value);
        return oldValue;
    }

    remove(key: K): V | undefined {
        let newEntry: MapEntry<K, V> = new SimpleMapEntry(key, <V>Objects.unknownNull());
        let searchResult: SearchResult<MapEntry<K, V>> = binarySearch(this.list, newEntry, this.comparator, 0, this.list.size() - 1);
        let value:V=<V>Objects.unknownNull();
        if(searchResult.value!=null){
            value = <V>this.map.remove(key);
            this.list.removeByIndex(searchResult.index);
        }
        return value;
    }

    size(): number {
        return this.list.size();
    }

    values(): Collection<V> {
        return Pipeline.of(this.list).map((entry: MapEntry<K, V>) => {
            return entry.value;
        }).toList();
    }

}


export class HashMap<K extends any, V extends any> extends AbstractMap<K, V> {
    private length: number = 0;
    private array: Array<List<MapEntry<K, V>>> = [];
    private readonly MAX_SLOT: number = 48;

    constructor(map?: LikeJavaMap<K, V> | Map<K, V>) {
        super();
        if (map != null) {
            if (this instanceof Map) {
                for (let [key, value] of <Map<K, V>>map) {
                    this.put(key, value);
                }
            } else {
                this.putAll(<LikeJavaMap<K, V>>map);
            }
        }
    }

    clear(): void {
        for (let list of this.array) {
            if (list != null) {
                list.clear();
            }
        }
        this.length = 0;
    }

    containsKey(key: K): boolean {
        let entries: List<MapEntry<K, V>> = this.getKeySlotList(key);
        return Collects.anyMatch(entries, {
            test(entry: MapEntry<K, V>) {
                return entry.key == key;
            }
        });
    }

    private getKeySlot(key: K): number {
        let keyHash: number = Numbers.parseInt(Objects.hashCode(key));
        return keyHash % this.MAX_SLOT;
    }

    private getKeySlotList(key: K): List<MapEntry<K, V>> {
        let keySlot: number = this.getKeySlot(key);
        if (this.array[keySlot] == null) {
            this.array[keySlot] = new LinkedList<MapEntry<K, V>>();
        }
        return this.array[keySlot];
    }

    containsValue(value: V): boolean {
        return Collects.anyMatch(this.values(), {
            test(v: V) {
                return v == value;
            }
        });
    }

    entrySet(): LikeJavaSet<MapEntry<K, V>> {
        return <LikeJavaSet<MapEntry<K, V>>>new MapInnerEntrySet(this, Pipeline.of(this.array).flatMap().toList());
    }

    get(key: K): V {
        const list: List<MapEntry<K, V>> = this.getKeySlotList(key);
        return Pipeline.of(list).first({
            test: function (entry: MapEntry<K, V>) {
                return key == entry.key;
            }
        });
    }


    keySet(): LikeJavaSet<K> {
        return new MapInnerKeySet(this, Pipeline.of(this.array).flatMap({
            apply(entry: MapEntry<K, V>): K {
                return entry.key;
            }
        }).toList());
    }

    put(key: K, value?: V): V | undefined {
        if (key == null) {
            return undefined;
        }

        let list: List<MapEntry<K, V>> = this.getKeySlotList(key);
        let oldEntry: MapEntry<K, V> = Pipeline.of(list).first({
            test: function (entry: MapEntry<K, V>) {
                return key == entry.key;
            }
        });
        if (oldEntry == null) {
            list.add(new SimpleMapEntry(key, value));
            this.length++;
            return undefined;
        } else {
            oldEntry.value = value;
            return oldEntry.value;
        }
    }

    putAll(map: LikeJavaMap<K, V>): void {
        if (map != null) {
            for (let entry of map.entrySet()) {
                this.put(entry.key, entry.value);
            }
        }
    }

    remove(key: K): V | undefined {
        if (key == null) {
            return undefined;
        }

        let list: List<MapEntry<K, V>> = this.getKeySlotList(key);
        let oldEntry: MapEntry<K, V> = Pipeline.of(list).first({
            test: function (entry: MapEntry<K, V>) {
                return key == entry.key;
            }
        });
        if (oldEntry == null) {
            return undefined;
        } else {
            let result = oldEntry.value;
            Collects.removeIf(list, {
                test(entry: MapEntry<K, V>) {
                    return entry.key == key;
                }
            });
            this.length--;
            return result;
        }
    }

    size(): number {
        return this.length;
    }

    values(): Collection<V> {
        return Pipeline.of(this.array).flatMap({
            apply(entry: MapEntry<K, V>): V {
                return entry.value == null ? <V>Objects.unknownNull() : entry.value;
            }
        }).toList();
    }


    [Symbol.iterator](): Iterator<MapEntry<any, any>> {
        return new ArrayList(this.entrySet())[Symbol.iterator]();
    }
}

class MapInnerEntrySet<K, V extends any> extends AbstractSet<MapEntry<K, V>> {
    private readonly map: LikeJavaMap<K, V>;
    private readonly entries: List<MapEntry<K, V>>;

    constructor(map: LikeJavaMap<K, V>, entries: List<MapEntry<K, V>>) {
        super();
        this.map = map;
        this.entries = entries;
    }

    [Symbol.iterator](): Iterator<MapEntry<K, V>> {
        return this.entries[Symbol.iterator]();
    }

    add(e: MapEntry<K, V>): boolean {
        let size0 = this.map.size();
        this.map.put(e.key, e.value == null ? <V>Objects.unknownNull() : e.value);
        if (this.map.size() - size0 > 0) {
            this.entries.add(e);
            return true;
        }
        return false;
    }

    clear() {
        this.map.clear();
        this.entries.clear();
    }

    contains(e: MapEntry<K, V>): boolean {
        return this.entries.contains(e);
    }

    remove(e: MapEntry<K, V>): MapEntry<K, V> {
        this.entries.remove(e);
        this.map.remove(e.key);
        return e;
    }

    retainAll(c: Collection<MapEntry<K, V>>): boolean {
        return false;
    }

    toArray(array?: Array<MapEntry<K, V>>): Array<MapEntry<K, V>> {
        return this.entries.toArray(array);
    }

    size(): number {
        return this.entries.size();
    }

}

class MapInnerKeySet<E> extends AbstractSet<E> {
    private readonly map: LikeJavaMap<E, any>;
    private readonly keys: List<E>;

    constructor(map: LikeJavaMap<E, any>, keys: List<E>) {
        super();
        this.map = map;
        this.keys = keys;
    }

    [Symbol.iterator](): Iterator<E> {
        return this.keys[Symbol.iterator]();
    }

    add(e: E): boolean {
        throw new UnsupportOperationException();
    }

    clear() {
        this.keys.clear();
        this.map.clear();
    }

    contains(e: E): boolean {
        return this.map.containsKey(e);
    }

    remove(e: E): E {
        this.map.remove(e);
        return this.keys.remove(e);
    }

    retainAll(c: Collection<E>): boolean {
        let removed: Array<E> = [];
        for (let key of this.keys) {
            if (!c.contains(key)) {
                removed.push(key);
            }
        }
        for (let key of removed) {
            this.remove(key);
        }
        return true;
    }

    toArray(array?: Array<E>): Array<E> {
        return this.keys.toArray(array);
    }


}

export function isIterator(obj: any): boolean {
    if (obj != null) {
        if (!Objects.hasProperty(obj, "next")) {
            return false;
        }
        if (Types.isFunction(obj["next"])) {
            let throwType = Types.getType(obj["throw"]);
            let returnType = Types.getType(obj["return"]);
            if (throwType != Function || throwType != undefined) {
                return false;
            }
            if (returnType != Function || returnType != undefined) {
                return false;
            }
            return true;
        }
    }
    return false;
}

export function isIterable(obj: any): boolean {
    if (obj == null) {
        return false;
    }
    if (Types.isCollection(obj) || obj instanceof AbstractMap || Types.isFunction(obj[Symbol.iterator])) {
        return true;
    }
    return false;
}

export function propertiesAsIterable(object: any) {
    if (Types.isSimpleObject(object)) {
        object[Symbol.iterator] = function (): IterableIterator<any> {
            return new ObjectPropertiesIterator(object);
        }
    }
    return asIterable(object);
}


export function asIterable(object: any): ArrayList<any> {
    if (object == null) {
        return Collects.emptyArrayList();
    }

    if (isIterable(object)) {
        return new ArrayList(object);
    } else {
        if (isIterator(object)) {
            return new ArrayList(new IteratorIterable(<Iterator<any>>object));
        }
    }
    return new ArrayList([object]);
}

export class IteratorIterable<E extends any> extends AbstractIterator<E> implements Iterable<E> {
    private iter: Iterator<E>;
    private iterResult: IteratorYieldResult<E> | IteratorReturnResult<E>;
    private index: number = -1; // the lastIndex had been read
    private firstReadByHasNextMethod: boolean = false;

    constructor(iterator: Iterator<E>) {
        super();
        Preconditions.checkNonNull(iterator);
        this.iter = iterator;
        this.iterResult = <IteratorReturnResult<E>>Objects.unknownNull();
    }

    hasNext(): boolean {
        // read unstart
        if (this.iterResult == null && this.index == -1) {
            try {
                this.firstReadByHasNextMethod = true;
                // read first
                this.iterResult = this.iter.next();
            } catch (e) {
                return false;
            }
        }
        // had read some values
        if (this.index >= 0) {
            if (this.iterResult != null) {
                return Booleans.asBoolean(this.iterResult.done);
            } else {
                return false;
            }
        }
        return false;
    }

    next(...args): IteratorYieldResult<E> | IteratorReturnResult<any> {
        if (this.firstReadByHasNextMethod && this.index == 0 && this.iterResult != null) {
            return this.iterResult;
        }
        this.index++;
        this.iterResult = this.iter.next();
        return this.iterResult;
    }

    [Symbol.iterator](): Iterator<E> {
        return this;
    }
}

export function hashCode(iterable: Iterable<any>): number {
    let hashCode: number = 0;
    for (let element of iterable) {
        hashCode += Objects.hashCode(element);
    }
    return hashCode;
}

export class CompositeIterator<E extends any> extends AbstractIterator<E> {
    private readonly iterators: List<Iterator<E>> = emptyArrayList();
    private iter: Iterator<Iterator<E>> = <Iterator<Iterator<E>>>Objects.unknownNull();
    private currentIter: Iterator<E> = <Iterator<E>>Objects.unknownNull();
    private running: boolean = false;
    private finished: boolean = false;

    constructor(iterators?: List<Iterator<E>>) {
        super();
        if (iterators != null) {
            this.iterators.addAll(iterators);
        }
    }

    addIterator(iterator: Iterator<E>): void {
        if (!this.running && !this.finished) {
            this.iterators.add(iterator);
        }
    }


    next(...args: [] | [undefined]): IteratorResult<E> {
        if (!this.running) {
            this.iter = this.iterators[Symbol.iterator]();
            this.running = true;
        }
        if (this.currentIter == null && !this.finished) {
            let getSubIteratorResult: IteratorResult<Iterator<E>> = this.iter.next();
            if (!getSubIteratorResult.done) {
                this.currentIter = getSubIteratorResult.value;
            } else {
                this.currentIter = <Iterator<E>>Objects.unknownNull();
                this.finished = true;
            }
        }

        if (this.currentIter != null && !this.finished) {
            return this.currentIter.next();
        }
        return {
            done: true,
            value: null
        };
    }


}
