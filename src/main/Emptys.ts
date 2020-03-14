import * as Types from "./Types";
export function isNull(obj: any): boolean {
    return obj == undefined || obj == null;
}

export function isNotNull(obj: any): boolean {
    return !this.isNull(obj);
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
