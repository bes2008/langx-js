import * as Types from "./Types";
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
    if(Types.isArray(obj)){
        return (<Array<any>>obj).length;
    }

    if(Types.isWeakSet(obj)){

    }
    return 1;
}

export function isEmpty(obj:any):boolean {
    return getLength(obj)==0;
}

export function isNotEmpty(obj:any): boolean {
    return !isEmpty(obj);
}