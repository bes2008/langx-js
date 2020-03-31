import * as Types from "../../main/Types";
import * as Collects from "../../main/Collects";
import {ArrayList, HashMap, HashSet, LinkedList} from "../../main/Iterables";
import * as Pipeline from "../../main/Pipeline";
import * as Objects from "../../main/Objects";

/**
 * HelloWorld.test.ts
 */
describe("Collects tests", () => {

    test("cleanNulls", () => {
        debugger;
        let arrayList = Collects.asIterable(['a', '1', null, "x", new Date(), null, new Date().getTime(), "abc"]);
        expect(Pipeline.of(arrayList).cleanNulls().asList().size()).toBe(6);
        expect(Pipeline.of(arrayList).cleanNulls().findFirst()).toBe("a");
        expect(Pipeline.of(arrayList).anyMatch((item) => {
            return Objects.isNull(item);
        })).toBe(true);
        expect(Pipeline.of(arrayList).cleanNulls().allMatch((item) => {
            return Objects.isNotNull(item);
        })).toBe(true);
    });
});