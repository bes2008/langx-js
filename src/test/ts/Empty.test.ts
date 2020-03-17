import * as Emptys from "../../main/Emptys";

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
        expect(Emptys.isEmpty({})).toBe(false);
        expect(Emptys.isEmpty(0)).toBe(true);
        expect(Emptys.isEmpty(2)).toBe(false);
        expect(Emptys)
    });

});



