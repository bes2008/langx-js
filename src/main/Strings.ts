import {hasOwnEnumerableProperty, isEmpty} from "./Objects";

export function hashCode(str: string | String): number {
    if (isEmpty(str)) {
        return 0;
    }
    if (hasOwnEnumerableProperty(str, "hash")) {
        return str["hash"];
    }

    let hash = 0;
    for (let i: number = 0; i < str.length; i++) {
        hash = 31 * hash + str.charCodeAt(i);
    }
    str["hash"] = hash;
    return hash;
}
