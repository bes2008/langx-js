import * as Collects from "../../main/Collects";
import * as logger from "../../main/logger";
import {List} from "../../main/Iterables";
/**
 * HelloWorld.test.ts
 */
describe("List Tests", ()=>{

    function testList(list:List<any>){
        list.addAll(Collects.newArrayList(["a","b","c","d","e"]));
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
        if(list.contains("a")){
            logger.info("has 'a'");
        }
        if(list.containsAll(Collects.newArrayList(["a","b"]))){
            logger.info("contains ['a', 'b']");
        }
        let alist:List<any> =  Collects.newArrayList(["a","b","k"]);
        if(!list.containsAll(alist)){
            logger.info("not contains ['a', 'b','k']");
        }
        list.removeAll(alist);
        expect(list.size()).toBe(3);
        expect(list.isEmpty()).toBe(false);
        list.retainAll(Collects.newArrayList(["c","d","m"]));
        expect(list.containsAll(Collects.newArrayList(["c","d"]))).toBe(true);
        expect(list.get(1)).toBe('d');
        expect(list.get(0)).toBe('c');
    }

    test("ArrayList Test", ()=>{
        testList(Collects.emptyArrayList());
    });

    test("LinkedList Test", ()=>{
        testList(Collects.emptyLinkedList());
    });
});