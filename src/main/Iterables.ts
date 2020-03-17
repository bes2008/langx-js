import * as Types from "./Types";
import * as Objects from "./Objects";
import * as Preconditions from "./Preconditions";
import * as Numbers from "./Numbers";
import * as Collects from "./Collects";
import * as Booleans from "./Booleans";
import * as Pipeline from "./Pipeline";

export interface LikeJavaIterator<E extends any> extends Iterator<E> {
    hasNext(): boolean;
}

export abstract class AbstractLikeJavaIterator<E extends any> implements LikeJavaIterator<E> {
    abstract hasNext(): boolean;

    abstract next(...args): IteratorYieldResult<E> | IteratorReturnResult<any> ;

    return(value?: any): IteratorYieldResult<any> | IteratorReturnResult<any> {
        return {
            value: value,
            done: true
        };
    }

    throw(e?: any): IteratorYieldResult<any> | IteratorReturnResult<any> {
        if (Types.isError(e)) {
            throw e;
        }
        return {
            value: null,
            done: this.hasNext()
        }
    }
}

export class ObjectPropertiesIterator extends AbstractLikeJavaIterator<any> implements LikeJavaIterator<any>, IterableIterator<any> {
    private readonly obj: Object;
    private keys: Array<string>;
    private index: number = -1;

    constructor(object: Object) {
        super();
        this.obj = object;
        this.keys = Object.keys(object);
    }

    [Symbol.iterator](): IterableIterator<any> {
        return this;
    }

    hasNext(): boolean {
        return this.index < this.keys.length - 1;
    }

    next(...args: [] | [undefined]): IteratorYieldResult<any> | IteratorReturnResult<any> {
        if (this.hasNext()) {
            this.index++;
            return {
                value: this.obj[this.keys[this.index]],
                done: this.hasNext()
            }
        }
        return {
            value: Objects.unknownNull(),
            done: false
        };
    }


}

export class NullIterable implements Iterable<any> {
    [Symbol.iterator](): Iterator<any> {
        return new NullIterator();
    }
}

export class NullIterator extends AbstractLikeJavaIterator<any> {
    next(...args: [] | [undefined]): IteratorYieldResult<any> | IteratorReturnResult<any> {
        return {
            done: true,
            value: undefined
        };
    }

    hasNext(): boolean {
        return false;
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

    iterator(): LikeJavaIterator<E>;

    remove(e: E): E;

    removeAll(c: Collection<E>): boolean;

    retainAll(c: Collection<E>): boolean;

    size(): number;

    isEmpty(): boolean;

    toArray(array?: Array<E>): Array<E>;

    hashCode():number;
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

    abstract iterator(): LikeJavaIterator<E>;

    abstract remove(e: E): E;

    abstract toArray(array?: Array<E>): Array<E>;

    isEmpty(): boolean {
        return this.size() == 0;
    }

    size(): number {
        return 0;
    }

    [Symbol.iterator](): Iterator<E> {
        return this.iterator();
    }

    hashCode(): number {
        return hashCode(this)
    }
}

export interface List<E> extends Collection<E> {
    get(index: number): E;

    set(index: number, e: E): E;

    indexOf(e: E): number;

    lastIndexOf(e: E): number;

    subList(fromIndex: number, toIndex: number);
}

export abstract class AbstractList<E> extends AbstractCollection<E> implements List<E> {
    protected length: number = 0;

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
        Preconditions.checkIndex(index < 0 || index >= this.length);
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

    add(e: E): boolean {
        this.array.push(e);
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

    iterator(): LikeJavaIterator<E> {
        return new ArrayListIterator(this);
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
}

export class ArrayListIterator<E> extends AbstractLikeJavaIterator<E> {
    private index: number = -1;
    private array: ArrayList<E>;

    constructor(array: AbstractList<E> | Array<E>) {
        super();
        this.array = new ArrayList(array);
    }

    hasNext(): boolean {
        return this.index < this.array.size() - 1;
    }

    next(...args: [] | [undefined]): IteratorYieldResult<E> | IteratorReturnResult<E> {
        if (this.hasNext()) {
            this.index++;
            return {
                done: !this.hasNext(),
                value: this.array.get(this.index)
            }
        } else {
            return {
                done: true,
                value: <E>Objects.unknownNull()
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
        while (i < (this.length - 1) && node.e != e) {
            node = node.next;
            i++;
        }
        if (node.e == e) {
            return i;
        }
        return -1;
    }

    lastIndexOf(e: E): number {
        let i: number = 0;
        let node: LinkedListNode<E> = this.last;
        while (i > 0 && node.e != e) {
            node = node.next;
            i--;
        }
        if (node.e == e) {
            return i;
        }
        return -1;
    }

    iterator(): LikeJavaIterator<E> {
        return new LinkedListIterator(this);
    }

    remove(e: E): E {
        let node: LinkedListNode<E> = this.first;
        while (node.next != null) {
            if (node.e == e) {
                let prev: LinkedListNode<E> = node.prev;
                if (prev != null) {
                    prev.next = node.next;
                }
                node.next.prev = prev;
                this.length--;
                node = node.next;
            }
        }
        if (node != null) {
            if (node.e == e) {
                let prev: LinkedListNode<E> = node.prev;
                if (prev != null) {
                    prev.next = node.next;
                }
                this.length--;
            }
        }
        return e;
    }

    retainAll(c: Collection<E>): boolean {
        let node: LinkedListNode<E> = this.first;
        while (node.next != this.last) {
            if (!c.contains(node.e)) {
                let prev: LinkedListNode<E> = node.prev;
                if (prev != null) {
                    prev.next = node.next;
                }
                node.next.prev = prev;
                this.length--;
                node = node.next;
            }
        }
        if (node != null) {
            if (!c.contains(node.e)) {
                let prev: LinkedListNode<E> = node.prev;
                if (prev != null) {
                    prev.next = node.next;
                }
                this.length--;
            }
        }
        return false;
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

    add(e: E): boolean {
        let newNode: LinkedListNode<E> = {
            e: e,
            prev: this.last,
            next: <LinkedListNode<E>>Objects.unknownNull()
        };
        if (this.last == null) {
            this.first = this.last = newNode;
        } else {
            this.last.next = newNode;
        }
        this.length++;
        return true;
    }

    toArray(array?: Array<E>): Array<E> {
        let arr = array == null ? [] : array;
        let iter: LikeJavaIterator<E> = this.iterator();
        while (iter.hasNext()) {
            arr.push(iter.next().value)
        }
        return arr
    }

}

export class LinkedListIterator<E extends any> extends AbstractLikeJavaIterator<any> {
    private node: LinkedListNode<E>;
    private list: LinkedList<E>;

    constructor(list: LinkedList<E>) {
        super();
        this.list = list;
        this.node = <LinkedListNode<E>>Objects.unknownNull();
    }

    hasNext(): boolean {
        if (this.list.isEmpty()) {
            return false;
        }

        if (this.node == null) {
            return true;
        }

        if (this.node != this.list.last) {
            return true;
        }

        return false;
    }

    next(...args: [] | [undefined]): IteratorYieldResult<E> | IteratorReturnResult<any> {
        if (this.hasNext()) {
            if (this.node == null) {
                this.node = this.list.first;
                return {
                    done: !this.hasNext(),
                    value: this.node.e
                }
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
            this.addAll(new ArrayList(list));
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
        return false;
    }

    iterator(): LikeJavaIterator<E> {
        return this.map.keySet().iterator();
    }

    remove(e: E): E {
        this.map.remove(e);
        return e;
    }

    retainAll(c: Collection<E>): boolean {
        return false;
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
    hashCode():number;
}

export class SimpleMapEntry<K,V> implements MapEntry<K, V>{
    key: K;
    value?: V;

    constructor(key:K, value?:V) {
        this.key = key;
        this.value = value;
    }

    hashCode(): number {
        return (this.key == null ? 0 :   Objects.hashCode(this.key)) ^
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

    iterator(): Iterator<MapEntry<any, any>>;

    hashCode():number;
}

export abstract class AbstractMap<K extends any, V extends any> implements LikeJavaMap<K, V> {
    abstract size(): number;

    isEmpty(): boolean {
        return this.size() == 0;
    }

    abstract clear(): void;
    abstract clear(): void;

    abstract containsKey(key: K): boolean;

    abstract containsValue(value: V): boolean;

    abstract get(key: K): V;

    abstract keySet(): LikeJavaSet<K>;

    abstract values(): Collection<V>;

    abstract entrySet(): LikeJavaSet<MapEntry<K, V>>;

    abstract put(key?: K, value?: V): V | undefined;

    abstract putAll(map: LikeJavaMap<K, V>): void;

    abstract remove(key: K): V | undefined;

    abstract iterator(): Iterator<MapEntry<any, any>>;

    [Symbol.iterator](): Iterator<MapEntry<any, any>> {
        return this.iterator();
    }

    hashCode(): number {
        return hashCode(this);
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
            list.clear();
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
        return Pipeline.of(this.array).flatMap().toSet();
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
        return Pipeline.of(this.array).flatMap({
            apply(entry: MapEntry<K, V>): K {
                return entry.key;
            }
        }).toSet();
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
            let iter = map.entrySet().iterator();
            while (iter.hasNext()) {
                let entry: MapEntry<K, V> = iter.next().value
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
                test(k: K) {
                    return k == key;
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


    iterator(): Iterator<MapEntry<any, any>> {
        return this.entrySet().iterator();
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
    if (Types.isCollection(obj) || obj instanceof AbstractLikeJavaIterator || obj instanceof AbstractMap || Types.isFunction(obj[Symbol.iterator])) {
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

export class IteratorIterable<E extends any> extends AbstractLikeJavaIterator<E> implements Iterable<E> {
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

export function hashCode(iterable:Iterable<any>) :number{
        let hashCode:number=0;
        for(let element of iterable){
            hashCode+=Objects.hashCode(element);
        }
        return hashCode;
}