import * as Emptys from "./Emptys";

export function isNull(obj: any): boolean {
    return Emptys.isNull(obj);
}

export function isNotNull(obj: any) {
    return Emptys.isNotNull(obj);
}

export function isEmpty(obj: any): boolean {
    return Emptys.isEmpty(obj);
}

export function isNotEmpty(obj:any) {
    return Emptys.isNotEmpty(obj);
}

export function unknownNull(): unknown {
    return <unknown>null;
}


