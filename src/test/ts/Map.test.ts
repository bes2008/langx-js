import * as Collects from "../../main/Collects";
import * as logger from "../../main/logger";
import {LikeJavaMap, List} from "../../main/Iterables";

/**
 * HelloWorld.test.ts
 */
describe("Map Tests", () => {

    function testMap(map: LikeJavaMap<string, any>) {
        debugger;

        Collects.forEach(Collects.newList(["a", "b", "c", "d", "e"]), (element) => {
            map.put(element, null);
        });
        Collects.forEach(map, (entry) => {
            logger.info(entry);
        });
        Collects.forEach(map.keySet(), (key) => {
            logger.info(key);
        });
        Collects.forEach(map.values(), (value) => {
            logger.info(value);
        });
        expect(map.size()).toBe(5);
        map.put("f", null);
        expect(map.size()).toBe(6);
        map.remove("f");
        expect(map.size()).toBe(5);
        map.remove("f");
        expect(map.size()).toBe(5);
        if (map.containsKey("a")) {
            logger.info("has 'a'");
        }
        let alist: List<any> = Collects.newList(["a", "b", "k"]);
        debugger
        Collects.removeIf(map, {
            test(key: string, value: any) {
                return alist.contains(key);
            }
        });
        expect(map.size()).toBe(3);
        expect(map.isEmpty()).toBe(false);
    }
    test("TreeMap Test", () => {
        testMap(Collects.emptyTreeMap());
    });
    test("HashMap Test", () => {
        testMap(Collects.emptyHashMap());
    });


});