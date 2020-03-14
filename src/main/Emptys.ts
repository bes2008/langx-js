import * as Types from "./Types";
import {AbstractCollection, AbstractJavaMap, LikeJavaSet} from "./Iterables";
export function isNull(obj: any): boolean {
    return obj == undefined || obj == null;
}

export function isNotNull(obj: any): boolean {
    return !isNull(obj);
}

export function getLength(obj: any): number {
    if (isNull(obj)) {
        return 0;
    }

    // Array
    if(Types.isArray(obj)){
        return (<Array<any>>obj).length;
    }

    // JavaList, JavaSet
    if(Types.isJavaCollection(obj)){
        return (<AbstractCollection<any>>obj).size();
    }

    // Set
    if(Types.isSet(obj)){
        if(Types.isJsSet(obj)){
            return (<Set<any>>obj).size;
        }
        if(Types.isJavaSet(obj)){
            return (<LikeJavaSet<any>>obj).size();
        }
    }
    if(Types.isWeakSet(obj)){
        return 0;
    }

    if(Types.isMap(obj)){
        if(Types.isJsMap(obj)){
            return (<Map<any,any>>obj).size;
        }
        if(Types.isJavaMap(obj)){
            return (<AbstractJavaMap<any,any>>obj).size();
        }
    }

    if(Types.isSimpleObject(obj)){
        return 1;
    }

    return 1;
}

export function isEmpty(obj:any):boolean {
    return getLength(obj)==0;
}

export function isNotEmpty(obj:any): boolean {
    return !isEmpty(obj);
}