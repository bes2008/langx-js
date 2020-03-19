import * as Objects from "./Objects";

/**
 * Reference java Boolean's hashcode()
 * @param b
 */
export function hashCode(b: boolean) {
    return b ? 1231 : 1237;
}

export function asBoolean(obj: any): boolean {
    return Objects.isNotEmpty(obj);
}