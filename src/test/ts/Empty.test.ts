import * as Emptys from "../../main/Emptys";
import {ArrayList, HashMap, HashSet, LinkedList} from "../../main/Iterables";

/**
 * HelloWorld.test.ts
 */
describe("Emptys tests", ()=>{

    test('isNull', () => {
        debugger;
        expect(Emptys.isNull(null)).toBe(true);
        expect(Emptys.isNull(undefined)).toBe(true);
        expect(Emptys.isNull(3)).toBe(false);
        expect(Emptys.isNull({})).toBe(false);
    });

    test("isEmpty", ()=>{
        expect(Emptys.isEmpty(null)).toBe(true);
        expect(Emptys.isEmpty(undefined)).toBe(true);
        expect(Emptys.isEmpty([])).toBe(true);
        expect(Emptys.isEmpty({})).toBe(true);
        expect(Emptys.isEmpty(0)).toBe(true);
        expect(Emptys.isEmpty(2)).toBe(false);
        expect(Emptys.isEmpty({test:function (e) {

            }})).toBe(false);
        expect(Emptys.isEmpty(function () {

        })).toBe(false);
        expect(Emptys.isEmpty(new Set())).toBe(true);
        expect(Emptys.isEmpty(new Map())).toBe(true);
        expect(Emptys.isEmpty(new HashMap())).toBe(true);
        expect(Emptys.isEmpty(new ArrayList())).toBe(true);
        expect(Emptys.isEmpty(new LinkedList())).toBe(true);
        expect(Emptys.isEmpty(new HashSet())).toBe(true);
    });

});



