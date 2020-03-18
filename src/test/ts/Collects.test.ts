import * as Collects from "../../main/Collects";
import * as logger from "../../main/logger";
import {ArrayList} from "../../main/Iterables";
/**
 * HelloWorld.test.ts
 */
describe("Collects Tests", ()=>{

    test("ArrayList Test", ()=>{
        debugger;
        let list:ArrayList<string> = Collects.emptyArrayList();
        list.addAll(Collects.newList(["a","b","c","d","e"]));
        Collects.forEach(list, (element)=>{
            logger.info(element);
        });
        debugger;
        expect(list.size()).toBe(5);
        list.add("f");
        expect(list.size()).toBe(6);
        list.remove("f");
        expect(list.size()).toBe(5);
        list.remove("f");
        expect(list.size()).toBe(5);
    });


});