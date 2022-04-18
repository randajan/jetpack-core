import jet from "../jet";

export default jet.define("Set", Set, {
    copy:x=>new Set(x),
    keys:x=>x.keys(),
    vals:x=>x.values(),
    entries:x=>x.entries(),
    get:(x,k)=>x.has(k)?k:undefined,
    set:(x,k,v)=>x.add(v)?v:undefined,
    rem:(x,k)=>x.delete(k),
    to:{
        "*":set=>Array.from(set),
        Function:set=>_=>set,
        Boolean:set=>set.jet.isFull(),
        Object:set=>jet.merge(set),
        Promise:async set=>set,
    }
});