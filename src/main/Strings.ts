import {isEmpty} from "./Objects";

export function hashCode(str: string | String): number {
    if (isEmpty(str)) {
        return 0;
    }

    let hash = 0;
    for (let i: number = 0; i < str.length; i++) {
        hash = 31 * hash + str.charCodeAt(i);
    }
    return hash;
}
