import { getDefByInst } from "../defs/base.js";
import jet from "../defs";

export const each = (any, fce, deep)=>{
    let isPending = true;
    const stop = _=>{ isPending = false; }

    const dprun = jet.isRunnable(deep);

    const exe = (value, path, skipDeep=false, isRoot=false)=>{
        const def = getDefByInst(value);
        const de = def.entries;
        if (!de || (!deep && !isRoot)) { return fce(value, path, def, stop); }
        if (dprun && !skipDeep) { return deep(value, path, def, stop, value=>{ exe(value, path, true); }); }

        for (let [key, child] of de(value)) {
            if (isPending) { exe(child, (path ? path+"." : "") + String.jet.dotEscape(String(key))); }
            if (!isPending) { break; }
        };
    }
    
    exe(any, "", true, true);
};

export const reducer = reductor=>{
    let i=0, next;
    return next = (...input)=>reductor(next, i++, ...input);
}

export const dig = (any, path, reductor)=>{
    if (!Array.isArray(path)) { path = String.jet.dotSplit(String.jet.to(path)); }

    const end = path.length-1;
    return reducer((next, index, parent)=>{
        return reductor(next, parent, path[index], index === end);
    })(any);
}

export const digOut = (any, path, def)=>{
    if (!Array.isArray(path)) { path = String.jet.dotSplit(String.jet.to(path)); }
    if (!path.length) { return any; }

    for (let p of path) { if (null == (any = jet.get(any, p, false))) { return def; }}
    return any;
};

export const digIn = (any, path, val, force=true)=>{

    const step = (next, parent, key, isEnd)=>{
        let df = getDefByInst(parent);
        if (!df || !df.entries) {
            if (!force) { return parent; }
            parent = String.jet.isNumeric(key) ? [] : {};
            df = getDefByInst(parent);
        }
        const v = isEnd ? val : next(df.get(parent, key, false));
        if (v != null) { df.set(parent, key, v, false); return parent; }
        df.rem(parent, key);
        if (df.isFull(parent)) { return parent; }
    };

    return dig(any, path, step);
}

export const deflate = (any, includeMapable=false)=>{
    const flat = {};
    const add = (v, p)=>{ flat[p] = v; };
    const deep = (v, p, def, stop, next)=>{ add(v, p); next(v); };
    each(any, add, includeMapable ? deep : true);
    if (includeMapable) { flat[""] = any; }
    return flat;
}

export const inflate = (flat, includeMapable=true)=>{
    const r = {};
    for (const e of Object.keys(flat).sort()) {
        if (!includeMapable && jet.isMapable(flat[e])) { continue; }
        digIn(r, "to."+e, flat[e], true);
    }
    return r.to;
};

 const _assign = (overwriteArray, to, ...any)=>{
    const flat = deflate(to, true);

    const add = (val, path)=>{ to = digIn(to, path, val); }
    const acumulate = (val, path, def, stop, next)=>{
        if (!flat[path]) { add(flat[path] = def.create(), path); }
        if (Array.isArray(val) && Array.isArray(flat[path])) { flat[path].push(...val); }
        else { next(val); }
    }

    for (const a of any) { each(a, add, !!overwriteArray || acumulate); }

    return to;
};

export const assign = (to, from, overwriteArray=true)=>_assign(overwriteArray, to, from);
export const merge = (...any)=>_assign(false, {}, ...any);

export const compare = (a, b, changeList=false)=>{
    if (a === b) { return changeList ? [] : true; }

    const res = [];
    const flat = deflate(a);

    each(b, (val, path, def, stop)=>{
        if (flat[path] !== val) { res.push(path); }
        delete flat[path];
        if (!changeList && res.length) { stop(); }
    }, true);

    for (let path in flat) {
        if (!changeList && res.length) { break; }
        res.push(path);
    }

    return changeList ? res : !res.length;
}

export const melt = (any, comma)=>{
    let j = "", c = String.jet.to(comma);
    if (!jet.isMapable(any)) { return String.jet.to(any, c); }
    each(any, v=>{ j += v ? (j?c:"")+v : ""; }, true);
    return j;
}

export const run = (any, ...args)=>{
    if (jet.isRunnable(any)) { return any(...args); }
    if (!jet.isMapable(any)) { return undefined; }
    const res = [];
    each(any, f=>{ res.push(jet.isRunnable(f) ? f(...args) : undefined); }, true);
    return res;
}

export const enumFactory = (enums, {before, after, def}={})=>(raw, ...args)=>{
    const input = before ? before(raw, ...args) : raw;
    const output = enums.includes(input) ? input : def;
    
    return after ? after(output, ...args) : output;
}

export const json = {
    from: (json, throwErr=false)=>{
        if (jet.isMapable(json)) { return json; }
        try { return JSON.parse(String.jet.to(json)); } catch(e) { if (throwErr === true) { throw e } }
    },
    to: (obj, prettyPrint=false)=>{
        const spacing = Number.jet.only(prettyPrint === true ? 2 : prettyPrint);
        return JSON.stringify(jet.isMapable(obj) ? obj : {}, null, spacing);
    }
}