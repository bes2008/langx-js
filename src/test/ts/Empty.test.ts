import * as Emptys from "../../main/Emptys";

/**
 * HelloWorld.test.ts
 */
describe("Emptys tests", ()=>{
    test('isNull', () => {
        expect(Emptys.isNull(null)).toBe(true);
        expect(Emptys.isNull(undefined)).toBe(true);
        expect(Emptys.isNull(3)).toBe(false);
    });
});



