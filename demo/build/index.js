(() => {
  // dist/index.js
  function U(e, t, r) {
    if (!!t)
      for (let o in t)
        e[o] || Object.defineProperty(e, o, { value: t[o], writable: r, enumerable: true });
  }
  var D = class extends Function {
    constructor(t, r, o) {
      super();
      let i = t ? t.bind() : this;
      return U(i, r, false), U(i, o, true), Object.setPrototypeOf(i, new.target.prototype);
    }
  };
  var h = D;
  var g = {};
  var E = ["only", "full", "tap", "pull", "is", "to", "copy", "rnd"];
  var k = {};
  var _ = {};
  function I(e) {
    let t = typeof e;
    return e != null && (t === "function" || t === "object");
  }
  function C(e, t) {
    return t instanceof e;
  }
  function P(e, t) {
    if (!t)
      return e === false || e === 0 || !!e;
    for (let r of t(e))
      if (r != null)
        return true;
    return false;
  }
  function y(e, t, r, o) {
    let i = typeof t, u = r ? [] : void 0, f = _[e || i];
    if (f)
      for (let c of f) {
        if (!c.is(t, i))
          continue;
        let s = o ? c : c.name;
        if (u)
          u.push(s);
        else
          return s;
      }
    return o ? u : u ? (u.push(i), u) : i;
  }
  function H(e, t, r) {
    let o = k[e];
    return o ? r ? y(o.primitive, t, true).includes(e) : e === y(o.primitive, t) : I(e) ? C(e, t) : false;
  }
  function j(e, t, ...r) {
    let o = I(e), i = k[e];
    if (o && t > 0) {
      console.warn("Unable execute '" + E[t] + "' - unavailable for constructors");
      return;
    }
    if (e && !o && !i) {
      console.warn("Unable execute '" + E[t] + "' - unknown type '" + e + "'");
      return;
    }
    if (!e && t !== 1) {
      console.warn("Unable execute '" + E[t] + "' - missing type");
      return;
    }
    for (let u of r)
      if (o) {
        if (C(e, u))
          return u;
      } else {
        let f = y(i ? i.primitive : null, u, false, true);
        if ((!e || f && f.name === e) && (t !== 1 || f && f.full(u) || !f && P(u)))
          return t === 3 ? f.copy(u) : u;
      }
    if (t > 1)
      return i.create();
  }
  function Y(e, ...t) {
    let r = y(null, e, false, true);
    if (!r) {
      console.warn("Unable execute 'copy' unknown type '" + r.name + "'");
      return;
    }
    return r.copy(e, ...t);
  }
  function J(e, t, ...r) {
    let o = k[e];
    if (!o) {
      console.warn("Unable execute 'to'. Unknown type '" + e + "'");
      return;
    }
    let i = y(null, t, false, true);
    if (!i)
      return o.create();
    if (o.name === i.name)
      return t;
    let u = i.to[e] || i.to["*"];
    return u ? J(e, u(t, ...r), ...r) : o.create(t);
  }
  function Z(e, t, r) {
    let o = typeof t, i = k[e].to;
    if (o === "function")
      i["*"] = t;
    else if (o === "object" && Array.isArray(t))
      for (let u in t)
        i[t[u]] = r;
    else if (o === "object")
      for (let u in t)
        i[u] = t[u];
    else
      i[t] = r;
  }
  function N(e, t, ...r) {
    let o = y(null, e, false, true);
    if (o && o[t])
      return o[t](e, ...r);
  }
  function L(e, t, r, o) {
    if (!e)
      return;
    e = Array.from(e);
    let i = e.length;
    return e[Math.floor(g.Num.rnd(g.Num.frame(t || 0, 0, i), g.Num.frame(r || i, 0, i), o))];
  }
  g.type = new h((e) => y(null, e), { all: (e) => y(null, e, true), detail: (e) => g[y(null, e)], isFull: (e) => {
    let t = y(null, e, false, true);
    return t ? t.full(e) : P(e);
  }, isMapable: (e) => {
    let t = y(null, e, false, true);
    return t ? !!t.pairs : false;
  }, full: (...e) => j(null, 1, ...e), copy: (e, ...t) => Y(e, ...t), keys: (e) => N(e, "keys"), vals: (e) => N(e, "vals"), pairs: (e) => N(e, "pairs"), key: new h((e, t) => N(e, "get", t), { set: (e, t, r) => N(e, "set", t, r), rem: (e, t) => N(e, "rem", t), rnd: (e, t, r, o) => {
    let i = y(null, e, false, true);
    if (i.vals)
      e = i.vals(e);
    else if (typeof e != "string")
      return;
    return L(e, t, r, o);
  } }), define: (e, t, r, o) => {
    let { rank: i, create: u, is: f, full: c, copy: s, rnd: a, keys: m, vals: x, pairs: d, get: b, set: S, rem: O } = r || {}, M = "Jet type '" + e + "'";
    if (k[e])
      throw new Error(M + " is allready defined!!!");
    if (g[e])
      throw new Error(M + " is reserved!!!");
    if (!t)
      throw new Error(M + " missing constructor!!!");
    if ((m || x || d) && !(m && x && d))
      throw new Error(M + " keys, vals or pairs missing!!!");
    i = i || 0, u = u || ((...l) => new t(...l)), f = f || ((l) => C(t, l)), c = c || ((l) => P(l, x)), s = s || ((l) => l), a = a || u;
    let z = u(), A = typeof z;
    if (z == null)
      throw new Error(M + " 'create' didn't create anything");
    if (!f(z, A))
      throw new Error(M + " 'is' doesn't match the create output");
    let w = { is: (l, p) => p ? f(l, typeof l) : H(e, l), isFull: (l, p) => w.is(l, p) ? c(l) : false, to: new h((l, ...p) => J(e, l, ...p), { define: (l, p) => Z(e, l, p) }), only: (...l) => j(e, 0, ...l), full: (...l) => j(e, 1, ...l), tap: (...l) => j(e, 2, ...l), pull: (...l) => j(e, 3, ...l), copy: (l, ...p) => f(l, typeof l) ? s(l, ...p) : void 0, rnd: a };
    d && (b = b || ((l, p) => l[p]), S = S || ((l, p, v) => l[p] = v), O = O || ((l, p) => delete l[p]), w.keys = (l) => f(l, typeof l) ? m(l) : void 0, w.vals = (l) => f(l, typeof l) ? x(l) : void 0, w.pairs = (l) => f(l, typeof l) ? d(l) : void 0, w.key = new h((l, p) => f(l, typeof l) ? b(l, p) : void 0, { set: (l, p, v) => f(l, typeof l) ? S(l, p, v) : void 0, rem: (l, p) => f(l, typeof l) ? O(l, p) : void 0, rnd: (l, p, v, K) => f(l, typeof l) ? L(x(l), p, v, K) : void 0 }));
    let B = _[A] || (_[A] = []);
    return B.push(k[e] = { rank: i, name: e, constructor: t, primitive: A, is: f, create: u, full: c, copy: s, keys: m, vals: x, pairs: d, get: b, set: S, rem: O, to: {} }), B.sort((l, p) => p.rank - l.rank), g[e] = new h(u, w, o);
  } });
  var n = g;
  var $ = { prop: { add: function(e, t, r, o, i, u) {
    return u = n.Bol.tap(u, true), n.type.isMapable(t) ? n.Map.it(t, (f, c) => {
      let s = n.Str.isNumeric(c);
      n.Obj.prop.add(e, s ? f : c, s ? r : f, o, i, u);
    }) : (!e[t] || u) && Object.defineProperty(e, t, { value: r, writable: !!o, configurable: !!o, enumerable: !!i }), e;
  }, get: function(e, t) {
    if (t || (t = Array.from(Object.getOwnPropertyNames(e))), !n.type.isMapable(t))
      return e[t];
    let r = {};
    return n.Map.it(t, (o) => r[o] = e[o]), r;
  } }, json: { from: function(e, t) {
    if (n.type.isMapable(e))
      return e;
    try {
      return JSON.parse(n.Str.to(e));
    } catch (r) {
      if (t === true)
        throw r;
    }
  }, to: function(e, t) {
    let r = n.Num.only(t === true ? 2 : t);
    return JSON.stringify(n.type.isMapable(e) ? e : {}, null, r);
  } } };
  var q = n.type.define("Obj", Object, { rank: -6, is: (e, t) => t === "object", copy: (e) => Object.defineProperties({}, Object.getOwnPropertyDescriptors(e)), keys: (e) => Object.keys(e), vals: (e) => Object.values(e), pairs: (e) => Object.entries(e) }, $);
  n.Obj.to.define({ Fce: (e) => (t) => e, Symbol: (e) => Symbol(n.Obj.json.to(e)), Bol: (e) => n.Obj.isFull(e), Num: (e) => Object.values(e), Arr: (e) => Object.values(e), Str: (e) => n.Obj.json.to(e), Prom: async (e) => e, Err: (e) => n.Obj.json.to(e), RegExp: (e, t) => n.Map.melt(e, t ?? "|") });
  var G = n.type.define("Bol", Boolean, { rank: -4, is: (e, t) => t === "boolean", create: Boolean, rnd: (e) => Math.random() < (e || 0.5) });
  var Q = { x: function(e, t, r) {
    let o = t, i = n.Num.zoomIn(e, r), [u, f] = i;
    return o === "/" ? u / f : o === "*" ? u * f / Math.pow(i.zoom, 2) : (o === "+" ? u + f : o === "-" ? u - f : o === "%" ? u % f : NaN) / i.zoom;
  }, frame: function(e, t, r) {
    return e = r == null ? e : Math.min(e, r), t == null ? e : Math.max(e, t);
  }, round: function(e, t, r) {
    let o = Math.pow(10, t || 0);
    return Math[r == null ? "round" : r ? "ceil" : "floor"](e * o) / o;
  }, len: function(e, t) {
    let r = t, o = n.Str.to(e), i = o.length, u = o.indexOf("."), f = u >= 0;
    return r === false ? f ? i - u - 1 : 0 : !f || !r ? i : u;
  }, period: function(e, t, r) {
    let o = r - t;
    return (o + (e - t) % o) % o + t;
  }, toRatio: function(e, t, r) {
    let o = r - t;
    return o ? (e - t) / o : 0;
  }, fromRatio: function(e, t, r) {
    let o = r - t;
    return e * o + t;
  }, zoomIn: function(...e) {
    let t = Math.pow(10, Math.max(...e.map((r) => n.Num.len(r, false))));
    return n.Obj.prop.add(e.map((r) => Math.round(r * t)), "zoom", t);
  }, zoomOut: function(e) {
    return e.map((t) => t / e.zoom);
  }, diffusion: function(e, t, r, o) {
    var i = e * o;
    return n.Num.rnd(Math.max(t, e - i), Math.min(r, e + i));
  }, snap: function(e, t, r, o, i, u) {
    var f = e, c = t, s = r, a = o, m = s != null, x = a != null, d = i, b = u !== false;
    if (f == null || c == null || c <= 0 || !(m || x))
      return f;
    b && (f = n.Num.frame(f, s, a));
    var S = m ? f - s : a - f;
    return f = S % c ? (m ? s : a) + n.Num.round(S / c, 0, d == null ? null : d === m) * c * (m * 2 - 1) : f, b ? n.Num.frame(f, s, a) : f;
  }, whatpow: function(e, t) {
    return Math.log(n.Num.to(e)) / Math.log(n.Num.to(t));
  }, toHex: function(e) {
    var t = n.Num.to(Math.round(e)).toString(16);
    return t.length === 1 ? "0" + t : t;
  }, toLetter: function(e, t) {
    t = n.Str.to(t) || "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    let r = t.length;
    return (e >= r ? n.Num.toLetter(Math.floor(e / r) - 1) : "") + t[e % r];
  } };
  var W = n.type.define("Num", Number, { rank: -4, is: (e, t) => t === "number", create: Number, rnd: (e, t, r) => {
    var o = Math.random();
    return r ? o = Math.pow(o, 2) : r === false && (o = Math.sqrt(o)), n.Num.fromRatio(o, e || 0, t || e * 2 || 1);
  } }, Q);
  n.Num.to.define({ Fce: (e) => (t) => e, Bol: (e) => !!e, Arr: (e, t) => t ? [e] : Array(e), Prom: async (e) => e, Str: (e) => String(e) });
  var X = { isNumeric: function(e) {
    return !isNaN(Number(e));
  }, lower: function(e) {
    return n.Str.to(e).toLowerCase();
  }, upper: function(e) {
    return n.Str.to(e).toUpperCase();
  }, capitalize: function(e) {
    return e = n.Str.to(e), e.charAt(0).toUpperCase() + e.slice(1);
  }, delone: function(e) {
    let t = "", r = "aacdeeillnooorstuuuyrzAACDEEILLNOOORSTUUUYRZ", o = "\xE1\xE4\u010D\u010F\xE9\u011B\xED\u013A\u013E\u0148\xF3\xF4\xF6\u0155\u0161\u0165\xFA\u016F\xFC\xFD\u0159\u017E\xC1\xC4\u010C\u010E\xC9\u011A\xCD\u0139\u013D\u0147\xD3\xD4\xD6\u0154\u0160\u0164\xDA\u016E\xDC\xDD\u0158\u017D";
    for (let i of n.Str.to(e)) {
      let u = o.indexOf(i);
      t += u >= 0 ? r[u] : i;
    }
    return t;
  }, efface: function(e, t) {
    return n.Str.to(e).replace(t, "").replace(/[\s\n\r]+/g, " ").trim();
  }, simplify: function(e, t) {
    return n.Str.delone(n.Str.efface(n.Str.to(e), t).toLowerCase());
  }, sort: function(...e) {
    return e.map((t) => {
      let r = n.Str.to(t), o = n.Str.delone(r);
      return { l: o.toLowerCase(), d: o, s: r };
    }).sort((t, r) => {
      for (let o = 0; ; o++)
        for (let i in t) {
          let u = t[i].charCodeAt(o) || 0, f = r[i].charCodeAt(o) || 0;
          if (u !== f || !u)
            return u - f;
        }
    }).map((t) => t.s);
  }, fight: function(...e) {
    return n.Str.sort(...e)[0];
  }, carret: function(e, t) {
    let r = n.Str.to(e).length;
    return n.Num.frame(n.Num.tap(t, r), 0, r);
  }, splice: function(e, t, r, ...o) {
    e = n.Str.to(e);
    let i = n.Str.carret(e, t), u = n.Num.frame(r, 0, e.length - i);
    return e.slice(0, i) + n.Map.melt(o, "") + e.slice(i + u);
  }, hide: new h((e, t, r) => {
    if (!e)
      return e;
    for (var o = "", i = e, u = n.Str.hide[t] || t || "\u2022", f = r === false, c = 0; c < e.length; c++)
      o += f && (i[c] === `
` || i[c] === " ") ? i[c] : u.length - 1 ? n.type.key.rnd(u) : u;
    return o;
  }, { point: "\u2022", cross: "\xD7", flake: "\u2600", draft: "\u232D", power: "\u26A1", star: "\u2605", skull: "\u2620", card: "\u2660\u2665\u2666\u2663", notes: "\u2669\u266A\u266B\u266C\u266D\u266E\u266F", chess: "\u2654\u2655\u2656\u2657\u2658\u2659\u265A\u265B\u265C\u265D\u265E\u265F", block: "\u2596\u2597\u2598\u2599\u259A\u259B\u259C\u259D\u259E\u259F", bar: "\u2502\u2551 \u258C\u2590\u2588", iting: "\u2630\u2631\u2632\u2633\u2634\u2635\u2636\u2637", astro: "\u2648\u2649\u264A\u264B\u264C\u264D\u264E\u264F\u2650\u2651\u2652\u2653", die: "\u2680\u2681\u2682\u2683\u2684\u2685", runic: "\u16A0\u16A1\u16A2\u16A3\u16A4\u16A5\u16A6\u16A7\u16A8\u16A9\u16AA\u16AB\u16AC\u16AD\u16AE\u16AF\u16B0\u16B1\u16B3\u16B4\u16B5\u16B6\u16B7\u16B8\u16B9\u16BA\u16BB\u16BC\u16BD\u16BE\u16BF\u16C0\u16C1\u16C2\u16C3\u16C4\u16C5\u16C6\u16C7\u16C8\u16C9\u16CA\u16CB\u16CF\u16D0\u16D1\u16D2\u16D3\u16D4\u16D5\u16D6\u16D7\u16D8\u16D9\u16DA\u16DB\u16DC\u16DD\u16DE\u16DF\u16E0\u16E1\u16E2\u16E3\u16E4\u16E5\u16E6\u16E8\u16E9\u16EA\u16EE\u16EF\u16F0", dots: "\u2800\u2801\u2802\u2803\u2804\u2805\u2806\u2807\u2808\u2809\u280A\u280B\u280C\u280D\u280E\u280F\u2810\u2811\u2812\u2813\u2814\u2815\u2816\u2817\u2818\u2819\u281A\u281B\u281C\u281D\u281E\u281F\u2820\u2821\u2822\u2823\u2824\u2825\u2826\u2827\u2828\u2829\u282A\u282B\u282C\u282D\u282E\u282F\u2830\u2831\u2832\u2833\u2834\u2835\u2836\u2837\u2838\u2839\u283A\u283B\u283C\u283D\u283E\u283F\u2840\u2841\u2842\u2843\u2844\u2845\u2846\u2847\u2848\u2849\u284A\u284B\u284C\u284D\u284E\u284F\u2850\u2851\u2852\u2853\u2854\u2855\u2856\u2857\u2858\u2859\u285A\u285B\u285C\u285D\u285E\u285F\u2860\u2861\u2862\u2863\u2864\u2865\u2866\u2867\u2868\u2869\u286A\u286B\u286C\u286D\u286E\u286F\u2870\u2871\u2872\u2873\u2874\u2875\u2876\u2877\u2878\u2879\u287A\u287B\u287C\u287D\u287E\u287F\u2880\u2881\u2882\u2883\u2884\u2885\u2886\u2887\u2888\u2889\u288A\u288B\u288C\u288D\u288E\u288F\u2890\u2891\u2892\u2893\u2894\u2895\u2896\u2897\u2898\u2899\u289A\u289B\u289C\u289D\u289E\u289F\u28A0\u28A1\u28A2\u28A3\u28A4\u28A5\u28A6\u28A7\u28A8\u28A9\u28AA\u28AB\u28AC\u28AD\u28AE\u28AF\u28B0\u28B1\u28B2\u28B3\u28B4\u28B5\u28B6\u28B7\u28B8\u28B9\u28BA\u28BB\u28BC\u28BD\u28BE\u28BF\u28C0\u28C1\u28C2\u28C3\u28C4\u28C5\u28C6\u28C7\u28C8\u28C9\u28CA\u28CB\u28CC\u28CD\u28CE\u28CF\u28D0\u28D1\u28D2\u28D3\u28D4\u28D5\u28D6\u28D7\u28D8\u28D9\u28DA\u28DB\u28DC\u28DD\u28DE\u28DF\u28E0\u28E1\u28E2\u28E3\u28E4\u28E5\u28E6\u28E7\u28E8\u28E9\u28EA\u28EB\u28EC\u28ED\u28EE\u28EF\u28F0\u28F1\u28F2\u28F3\u28F4\u28F5\u28F6\u28F7\u28F8\u28F9\u28FA\u28FB\u28FC\u28FD\u28FE\u28FF" }), levenshtein: function(e, t, r) {
    var o = r === false ? [e, t] : [n.Str.simplify(e, r), n.Str.simplify(t, r)];
    if (o[0] === o[1])
      return 1;
    if (!o[0] || !o[1])
      return 0;
    var i = [o[0].length, o[1].length], u = [];
    i[1] > i[0] && (i.reverse(), o.reverse());
    for (var f = 0; f <= i[0]; f++) {
      for (var c = f, s = 0; s <= i[1]; s++)
        if (f === 0)
          u[s] = s;
        else if (s > 0) {
          var a = u[s - 1];
          o[0].charAt(f - 1) !== o[1].charAt(s - 1) && (a = Math.min(Math.min(a, c), u[s]) + 1), u[s - 1] = c, c = a;
        }
      f > 0 && (u[i[1]] = c);
    }
    return (i[0] - u[i[1]]) / parseFloat(i[0]);
  }, mutate: function(e, t) {
    for (var r = [], o = e.length / 2, i = e.length * 2, u = Math.abs(1e3 * (t || 1)); r.length < u; ) {
      var f = n.Str.rnd(o, i);
      r.push([f, n.Str.levenshtein(f, e)]);
    }
    return r.sort(function(c, s) {
      return s[1] - c[1];
    })[0][0];
  } };
  var V = n.type.define("Str", String, { rank: -4, is: (e, t) => t === "string", create: (e) => e == null ? "" : String(e), rnd: (e, t, r) => {
    let o = ["bcdfghjklmnpqrstvwxz", "aeiouy"], i = o[0].length / (o[0].length + o[1].length), u = n.Num.rnd(Math.max(e, 2), t, r), f = n.Bol.rnd(i), c = "";
    for (; c.length < u; )
      c += n.type.key.rnd(o[+(f = !f)]);
    return c;
  } }, X);
  n.Str.to.define({ Fce: (e) => (t) => e, Bol: (e) => !["0", "false", "null", "undefined", "NaN"].includes(e.toLowerCase()), Arr: (e, t) => e.split(t), Num: (e, t) => Number(t ? e : (e.match(n.RegExp.lib.num) || []).join("").replace(",", ".")), Obj: (e) => n.Obj.json.from(e), Prom: async (e) => e });
  var ee = n.type.define("Symbol", Symbol, { rank: -4, is: (e, t) => t === "symbol", create: Symbol, rnd: (...e) => Symbol(n.Str.rnd(...e)) });
  var te = { run: function(e, ...t) {
    return n.Fce.is(e) ? e(...t) : n.Map.of(e, (r) => n.Fce.run(r, ...t));
  }, measure: function(e, t, r) {
    let o = r || 100, i = [], u = {};
    for (var f = 1; f <= o; f++)
      for (let s of e) {
        let a = u[s.name];
        a || (u[s.name] = a = { fce: s.name, runtimeAvg: 0, runtimeSum: 0 }, i.push(a));
        let m = performance.now(), x = s.apply(this, t), d = performance.now() - m;
        a.runtimeSum += d, a.runtimeAvg = a.runtimeSum / f;
      }
    i.sort((s, a) => s.runtimeSum - a.runtimeSum);
    let c = i[0];
    for (let s of i) {
      let a = s.runtimeSum / c.runtimeSum - 1;
      a > 0 && (s.slowFactor = "+" + Math.round(a * 1e4) / 100 + "%");
    }
    return { repeated: o, ladder: i };
  } };
  var re = n.type.define("Fce", Function, { rank: -4, is: (e, t) => t === "function", create: Function, copy: (e) => Object.defineProperties({ [e.name]: (...t) => e(...t) }[e.name], Object.getOwnPropertyDescriptors(e)) }, te);
  n.Fce.to.define({ "*": (e, ...t) => e(...t), Prom: async (e, ...t) => await e(...t) });
  var ne = { lib: { line: /[^\n\r]+/g, number: /[0-9.,-]+/g, word: /[^\s\n\r]+/g, num: /-?[0-9]*[.,]?[0-9]+/, email: /(?:[a-z0-9!#$%&'*+/=?^_{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i, ip: /((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?))/i, domain: /([a-z0-9]+\.)+(cz|de|sk|au|com|eu|info|org|[a-z]+)/i, hexadecimal: /[0-9a-fA-F]{6,6}/ }, strip(e) {
    return e.toString().slice(1, -1);
  } };
  var oe = n.type.define("RegExp", RegExp, { rank: -4, is: (e, t) => e instanceof RegExp, create: RegExp, copy: (e) => RegExp(e.source) }, ne);
  var ie = { secToTime: function(e) {
    if (e = n.Num.to(e), e <= 0)
      return "";
    var t = Math.floor(e), r = t % 60, o = (t - r) % 3600, i = (t - o - r) / 3600;
    return o /= 60, (i ? i + ":" + (o < 10 ? "0" : "") : "") + (i || o ? o + ":" + (r < 10 ? "0" : "") : "") + r;
  } };
  var ue = n.type.define("Date", Date, { rank: -4, is: (e, t) => e instanceof Date, create: (e) => e ? new Date(e) : new Date(), rnd: (e) => Math.random() < (e || 0.5) }, ie);
  var fe = n.type.define("NaN", Number, { rank: -2, is: (e, t) => t === "number" && isNaN(e), create: (e) => NaN });
  n.NaN.to.define((e) => {
  });
  var le = n.type.define("Err", Error, { rank: -1, is: (e, t) => e instanceof Error, rnd: (...e) => new Error(n.Str.rnd(...e)) });
  var se = n.type.define("Prom", Promise, { rank: -1, is: (e, t) => e instanceof Promise, create: (e) => new Promise(n.Fce.only(e, (t) => t())) });
  n.Prom.to.define({ eng: (e, t) => n.eng(e, t) });
  var ce = { swap: function(e, t, r) {
    return e = n.Arr.tap(e), e[t] = e.splice(r, 1, e[t])[0], e;
  }, shuffle: function(e) {
    e = n.Arr.tap(e);
    for (var t = e.length - 1; t > 0; t--)
      n.Arr.swap(e, Math.floor(Math.random() * (t + 1)), t);
    return e;
  }, clean: function(e, t, r) {
    return e = n.Arr.tap(e), r = n.Fce.tap(r, (o) => o ?? void 0), t !== false ? e.filter(r) : n.Map.of(e, r);
  } };
  var ae = n.type.define("Arr", Array, { rank: -1, is: Array.isArray, copy: (e) => Array.from(e), keys: (e) => e.keys(), vals: (e) => e.values(), pairs: (e) => e.entries() }, ce);
  n.Arr.to.define({ Fce: (e) => (t) => e, Bol: (e) => n.Arr.isFull(e), Num: (e) => e.length, Str: (e, t) => n.Map.melt(e, t), Obj: (e) => Object.assign({}, e), Prom: async (e) => e, Err: (e, t) => n.Map.melt(e, t ?? " "), RegExp: (e, t) => n.Map.melt(e, t ?? "|") });
  var pe = n.type.define("Set", Set, { rank: -1, is: (e) => e instanceof Set, copy: (e) => new Set(e), keys: (e) => e.keys(), vals: (e) => e.values(), pairs: (e) => e.entries(), get: (e, t) => e.has(t) ? t : void 0, set: (e, t, r) => e.add(r) ? r : void 0, rem: (e, t) => e.delete(t) });
  n.Set.to.define({ "*": (e) => Array.from(e), Fce: (e) => (t) => e, Bol: (e) => n.Set.isFull(e), Obj: (e) => n.Obj.merge(e), Prom: async (e) => e });
  function T(e, t) {
    return n.type.isMapable(e) ? e : n.Str.isNumeric(t) ? [] : {};
  }
  function R(e, t, r, o, i) {
    let u = n.type.detail(e);
    if (o = o ? n.Arr.tap(o) : null, !u || !u.pairs)
      return o || e;
    t = n.Fce.tap(t), i = n.Arr.to(i, ".");
    let f = n.Fce.is(r), c = i.length, s = o || u();
    for (let [a, m] of u.pairs(e)) {
      i[c] = a;
      let x = i.join("."), d = r && n.type.isMapable(m);
      m = d ? R(m, t, r, o, x) : t(m, x), d && f && (m = r(m, x)), m !== void 0 && (o ? d || o.push(m) : u.key.set(s, a, m));
    }
    return s;
  }
  function F(e, ...t) {
    let r = /* @__PURE__ */ new Set();
    return t.map((o) => n.Map.it(o, (i, u) => r.add(u), e ? (i, u) => r.add(u) : true)), Array.from(r).sort((o, i) => i.localeCompare(o));
  }
  var me = { it: (e, t, r) => R(e, t, r, true), of: (e, t, r) => R(e, t, r), dig: function(e, t, r) {
    let o = n.Str.to(t, ".").split(".");
    for (let i of o)
      if ((e = n.type.key(e, i)) == null)
        return r;
    return e;
  }, put: function(e, t, r, o) {
    o = n.Bol.tap(o, true);
    let i = n.Str.to(t, ".").split("."), u = [], f = e = T(e, i[0]);
    for (let [c, s] of i.entries()) {
      if (r == null && (u[i.length - 1 - c] = [e, s]), !o && e[s] != null && !n.type.isMapable(e[s]))
        return f;
      c !== i.length - 1 ? e = n.type.key.set(e, s, T(e[s], i[c + 1])) : r == null ? n.type.key.rem(e, s) : n.type.key.set(e, s, r);
    }
    for (let [c, s] of u) {
      if (n.type.isFull(c[s]))
        break;
      n.type.key.rem(c, s);
    }
    return f;
  }, deflate: function(...e) {
    let t = {};
    return e.map((r) => n.Map.it(r, (o, i) => t[i] = o, true)), t;
  }, inflate: function(e) {
    let t = {};
    return n.Map.it(e, (r, o) => n.Map.put(t, o, r, true)), t;
  }, merge: function(...e) {
    return n.Map.inflate(n.Map.deflate(...e));
  }, clone: function(e, t) {
    return n.Map.of(e, (r) => r, t);
  }, audit: new h((...e) => F(false, ...e), { full: (...e) => F(true, ...e) }), match: function(e, t, r) {
    return r = n.Fce.tap(r), F(true, e, t).map((o) => {
      n.Map.put(e, o, r(n.Map.dig(e, o), n.Map.dig(t, o), o), true);
    }), e;
  }, compare: function(...e) {
    let t = /* @__PURE__ */ new Set();
    return F(false, ...e).map((r) => {
      if (new Set(e.map((o) => n.Map.dig(o, r))).size > 1) {
        let o = r.split(".");
        o.map((i, u) => t.add(o.slice(0, u + 1).join(".")));
      }
    }), Array.from(t);
  }, melt(e, t) {
    let r = "", o = n.Str.to(t);
    return n.type.isMapable(e) ? (n.Map.it(e, (i) => {
      i = n.Map.melt(i, o), r += i ? (r ? o : "") + i : "";
    }), r) : n.Str.to(e, o);
  } };
  var de = n.type.define("Map", Map, { rank: -1, is: (e) => e instanceof Map, copy: (e) => new Map(e), keys: (e) => e.keys(), vals: (e) => e.values(), pairs: (e) => e.entries(), get: (e, t) => e.get(t), set: (e, t, r) => e.set(t, r), rem: (e, t) => e.delete(t) }, me);
  var ct = n.type;
  var at = n.type.define("Complex", h);
  var pt = n;

  // demo/src/index.js
  window.jet = pt;
})();
//# sourceMappingURL=index.js.map
