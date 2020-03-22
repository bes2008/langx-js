import * as Types from "../../main/Types";
import * as Collects from "../../main/Collects";
import {ArrayList, HashMap, HashSet, LinkedList} from "../../main/Iterables";
import * as Pipeline from "../../main/Pipeline";

/**
 * HelloWorld.test.ts
 */
describe("Collects tests", ()=> {

    test("cleanNulls", () => {
        debugger;
        let arrayList = Collects.asIterable([null,'a','1',null,"x",new Date(), new Date().getTime(),"abc"]);
        expect(Pipeline.of(arrayList).cleanNulls().asList().size()).toBe(6);
        expect(Pipeline.of(arrayList).cleanNulls().first()).toBe("a");
    });
});