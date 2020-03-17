import * as Types from "../../main/Types";
import {ArrayList, HashMap, HashSet, LinkedList} from "../../main/Iterables";

/**
 * HelloWorld.test.ts
 */
describe("Types tests", ()=>{

    test("getType", ()=>{
        debugger;
        expect(Types.getType(null)).toBe(undefined);
        expect(Types.getType(undefined)).toBe(undefined);
        expect(Types.getType([])).toBe(Array);
        expect(Types.getType({})).toBe(Object);
        expect(Types.getType(0)).toBe(Number);
        expect(Types.getType(2)).toBe(Number);
        expect(Types.getType({test:function (e) {

            }})).toBe(Object);
        expect(Types.getType(function () {

        })).toBe(Function);
        expect(Types.getType(new Set())).toBe(Set);
        expect(Types.getType(new Map())).toBe(Map);
        expect(Types.getType(new HashMap())).toBe(HashMap);
        expect(Types.getType(new ArrayList())).toBe(ArrayList);
        expect(Types.getType(new LinkedList())).toBe(LinkedList);
        expect(Types.getType(new HashSet())).toBe(HashSet);
    });

    test("isFunction", ()=>{
        expect(Types.isFunction(null)).toBe(false);
        expect(Types.isFunction(undefined)).toBe(false);
        expect(Types.isFunction([])).toBe(false);
        expect(Types.isFunction({})).toBe(false);
        expect(Types.isFunction(0)).toBe(false);
        expect(Types.isFunction(2)).toBe(false);
        expect(Types.isFunction({test:function (e) {

            }})).toBe(false);
        expect(Types.isFunction(function () {

        })).toBe(true);
        expect(Types.isFunction(new Set())).toBe(false);
        expect(Types.isFunction(new Map())).toBe(false);
        expect(Types.isFunction(new HashMap())).toBe(false);
        expect(Types.isFunction(new ArrayList())).toBe(false);
        expect(Types.isFunction(new LinkedList())).toBe(false);
        expect(Types.isFunction(new HashSet())).toBe(false);
    });

});
