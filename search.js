/* C quickref — search engine.
 * Plain JS, no dependencies. Works in the browser and in Node for tests.
 *
 * The goal: plain-English queries, word order ignored, plurals and typos
 * forgiven, and the most specific concept ranked first.
 */
(function (root, factory) {
  const api = factory();
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  else root.CSearch = api;
})(typeof self !== "undefined" ? self : this, function () {
  "use strict";

  /* Words that add nothing to a query. Never removed if the query is only stopwords. */
  const STOP = new Set([
    "how", "to", "do", "does", "did", "in", "into", "the", "a", "an", "of", "i",
    "my", "can", "is", "are", "what", "which", "way", "ways", "using", "use",
    "with", "c", "please", "tell", "me", "want", "why", "between", "difference",
    "differences", "vs", "versus", "work", "works", "working", "properly", "by",
    "from", "inside", "within", "when", "where", "it", "its", "that", "this",
    "and", "or", "not", "syntax", "example", "examples", "sample", "samples",
  ]);

  /* Query-side synonyms. They are alternatives, never extra required words. */
  const SYNONYMS = {
    declare: ["define", "create", "make", "init", "initialize", "initialise", "variable"],
    declaration: ["declare", "define"],
    define: ["declare", "create"],
    make: ["declare", "create", "define"],
    string: ["text", "chars"],
    char: ["character", "letter", "byte"],
    int: ["integer", "number", "whole"],
    float: ["decimal", "real"],
    double: ["decimal", "real"],
    bool: ["boolean"],
    loop: ["iterate", "repeat", "iteration", "looping"],
    loops: ["loop"],
    iterate: ["loop", "walk"],
    function: ["method", "procedure", "fn", "routine"],
    pointer: ["ptr", "address", "reference"],
    memory: ["alloc", "allocate", "heap", "malloc"],
    allocate: ["malloc", "memory", "alloc"],
    allocating: ["malloc", "alloc", "allocate", "memory"],
    allocation: ["malloc", "alloc", "allocate", "memory"],
    allocated: ["malloc", "alloc", "allocate", "memory"],
    malloc: ["alloc", "allocate", "heap"],
    calloc: ["allocate", "zero", "memory"],
    realloc: ["resize", "grow"],
    free: ["dealloc", "deallocate", "release", "delete"],
    print: ["output", "display", "printf", "puts", "show"],
    read: ["input", "scan", "get", "fgets", "stdin"],
    write: ["output", "fprintf", "save"],
    file: ["fopen", "stream", "io"],
    array: ["list", "buffer", "vector"],
    struct: ["structure", "record"],
    compile: ["build", "gcc", "make", "run"],
    run: ["execute", "compile"],
    convert: ["cast", "parse", "transform", "change"],
    compare: ["equal", "equality", "diff"],
    equal: ["compare", "comparison", "equals"],
    equals: ["equal", "compare"],
    copy: ["duplicate", "clone"],
    find: ["search", "locate", "index"],
    check: ["test", "verify", "validate"],
    error: ["fail", "failure", "handle"],
    null: ["nullptr", "zero", "nothing"],
    length: ["len", "size", "count"],
    delete: ["free", "remove"],
    add: ["append", "insert"],
    split: ["tokenize", "parse"],
    open: ["fopen"],
    close: ["fclose"],
    main: ["entry", "program"],
    format: ["specifier", "printf"],
    cast: ["convert", "conversion"],
    typedef: ["alias", "rename"],
    enum: ["enumeration", "constant"],
    macro: ["define", "preprocessor"],
    header: ["include"],
    recursion: ["recursive"],
    reverse: ["backwards", "backward"],
    overflow: ["bounds", "buffer", "wrap"],
    structs: ["struct"],
    strings: ["string"],
    pointers: ["pointer"],
    functions: ["function"],
    arrays: ["array"],
    chars: ["char"],
    uppercase: ["upper", "toupper", "capital", "capitals"],
    lowercase: ["lower", "tolower"],
    sort: ["qsort", "order", "arrange", "sorted"],
    random: ["rand", "srand", "randomness"],
    swap: ["exchange", "switch", "trade"],
    sleep: ["delay", "wait", "pause", "thread"],
  };

  /* A very small stemmer — enough for plurals and -ing forms. */
  function stem(word) {
    if (word.length <= 3) return word;
    if (word.endsWith("ies") && word.length > 4) return word.slice(0, -3) + "y";
    if (word.endsWith("sses")) return word.slice(0, -2);
    if (word.endsWith("ing") && word.length > 6) return word.slice(0, -3);
    if (word.endsWith("ed") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("es") && word.length > 4) return word.slice(0, -2);
    if (word.endsWith("s") && !word.endsWith("ss")) return word.slice(0, -1);
    return word;
  }

  function splitWords(text) {
    return String(text)
      .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
      .toLowerCase()
      .split(/[^a-z0-9_]+/)
      .flatMap((part) => part.split("_"))
      .filter(Boolean);
  }

  /* Translate symbols people actually type into words. */
  function prepare(query) {
    return String(query)
      .toLowerCase()
      .replace(/->/g, " arrow ")
      .replace(/\*/g, " pointer ")
      .replace(/\[\s*\]/g, " array ")
      .replace(/==/g, " equals ")
      .replace(/!=/g, " not equals ")
      .replace(/&&/g, " and ")
      .replace(/\|\|/g, " or ");
  }

  function normalizeText(text) {
    return splitWords(text).join(" ");
  }

  function countTokens(text) {
    const map = new Map();
    for (const token of splitWords(text)) {
      map.set(token, (map.get(token) || 0) + 1);
    }
    return map;
  }

  /* --- matching ------------------------------------------------------- */

  function subsequenceScore(q, t) {
    // t must contain q's characters in order, reasonably tightly packed.
    let qi = 0;
    let start = -1;
    let last = -1;
    let gaps = 0;
    for (let i = 0; i < t.length && qi < q.length; i++) {
      if (t[i] !== q[qi]) continue;
      if (start < 0) start = i;
      if (last >= 0) gaps += i - last - 1;
      last = i;
      qi++;
    }
    if (qi < q.length) return 0;

    const coverage = q.length / t.length;
    if (coverage < 0.55) return 0;

    const span = last - start + 1;
    const density = q.length / span;
    const score = 0.22 + 0.16 * density + 0.08 * coverage - 0.012 * gaps;
    return Math.max(0.16, Math.min(0.48, score));
  }

  function editDistance(a, b) {
    // Cheap bounded Levenshtein. Returns 3 when it exceeds 2.
    if (Math.abs(a.length - b.length) > 2) return 3;

    let prev = new Array(b.length + 1);
    let next = new Array(b.length + 1);
    for (let j = 0; j <= b.length; j++) prev[j] = j;

    for (let i = 1; i <= a.length; i++) {
      next[0] = i;
      let rowMin = next[0];
      for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        next[j] = Math.min(prev[j] + 1, next[j - 1] + 1, prev[j - 1] + cost);
        if (next[j] < rowMin) rowMin = next[j];
      }
      if (rowMin > 2) return 3;
      const swap = prev;
      prev = next;
      next = swap;
    }
    return prev[b.length];
  }

  function tokenScore(q, t) {
    if (q === t) return 1;

    if (t.startsWith(q)) {
      // Longer tokens still match, but a tight prefix wins.
      return 0.78 + 0.16 * (q.length / t.length);
    }

    if (q.length >= 4 && t.length >= 4 && q.startsWith(t)) {
      return 0.58 + 0.06 * (t.length / q.length);
    }

    if (q.length >= 3 && t.includes(q)) return 0.5;

    if (q.length >= 4 && t[0] === q[0]) {
      const sub = subsequenceScore(q, t);
      if (sub) return sub;

      if (q.length >= 5) {
        const d = editDistance(q, t);
        if (d === 1) return 0.46;
        if (d === 2 && q.length >= 7) return 0.3;
      }
    }

    return 0;
  }

  function bestInField(q, tokens) {
    let best = 0;
    for (const token of tokens.keys()) {
      const score = tokenScore(q, token);
      if (score > best) {
        best = score;
        if (best === 1) break;
      }
    }
    return best;
  }

  function buildIndex(concepts) {
    return concepts.map((concept, idx) => {
      const metaText = [concept.cat, ...(concept.tags || []), concept.aka || ""].join(" ");
      return {
        concept,
        idx,
        normTitle: normalizeText(concept.title),
        normMeta: normalizeText(metaText),
        titleTokens: countTokens(concept.title),
        metaTokens: countTokens(metaText),
        bodyTokens: countTokens(
          [concept.sum || "", concept.note || "", concept.code || ""].join(" ")
        ),
      };
    });
  }

  /* One group per meaningful query word. Synonyms are alternatives inside it. */
  function queryGroups(query) {
    let words = splitWords(prepare(query));
    if (!words.length) return [];

    const filtered = words.filter((word) => !STOP.has(word));
    if (filtered.length) words = filtered;

    const groups = [];

    for (const word of words) {
      const forms = new Map();

      const add = (form, weight) => {
        if (!form) return;
        if (form.length < 2 && !/^\d+$/.test(form)) return;
        const existing = forms.get(form);
        if (existing === undefined || weight > existing) forms.set(form, weight);
      };

      add(word, 1);

      const base = stem(word);
      if (base !== word) add(base, 0.97);

      // declaring -> declare, iterating -> iterate
      if (word.endsWith("ing") && word.length > 5) add(word.slice(0, -3) + "e", 0.96);
      if (word.endsWith("ed") && word.length > 4) add(word.slice(0, -2) + "e", 0.94);

      for (const synonym of SYNONYMS[word] || []) add(synonym, 0.9);

      // Also expand the cleaned-up forms: declaring -> declare -> define
      for (const form of [...forms.keys()]) {
        for (const synonym of SYNONYMS[form] || []) add(synonym, 0.87);
        if (form !== base && SYNONYMS[base]) {
          for (const synonym of SYNONYMS[base]) add(synonym, 0.86);
        }
      }

      if (forms.size) groups.push({ word, forms: [...forms.entries()] });
    }

    return groups;
  }

  function scoreMatch(form, entry) {
    const title = bestInField(form, entry.titleTokens) * 3.6;
    const meta = bestInField(form, entry.metaTokens) * 2.1;
    const body = bestInField(form, entry.bodyTokens) * 0.95;
    return Math.max(title, meta, body);
  }

  function scoreEntry(entry, groups, rawWords) {
    let total = (entry.concept.pop || 0) * 0.04;
    let matched = 0;

    for (const group of groups) {
      let best = 0;
      for (const [form, weight] of group.forms) {
        const score = scoreMatch(form, entry) * weight;
        if (score > best) best = score;
      }
      if (best > 0.08) {
        matched++;
        total += best;
      }
    }

    if (!matched) return null;

    const allMatched = matched === groups.length;

    if (allMatched) {
      const phrase = groups.length > 1 ? rawWords.join(" ") : "";

      if (phrase && entry.normTitle.includes(phrase)) total += 5;
      else if (phrase && entry.normMeta.includes(phrase)) total += 2;

      // Reward concepts whose title covers several query words.
      let titleHits = 0;
      for (const group of groups) {
        let best = 0;
        for (const [form, weight] of group.forms) {
          best = Math.max(best, bestInField(form, entry.titleTokens) * weight);
        }
        if (best >= 0.55) titleHits++;
      }
      total += titleHits * 0.6;
    }

    return {
      entry,
      concept: entry.concept,
      score: total,
      matched,
      total: groups.length,
      loose: !allMatched,
    };
  }

  function search(index, query, category) {
    const pool = category
      ? index.filter((entry) => entry.concept.cat === category)
      : index;

    let raw = splitWords(prepare(query));
    const filtered = raw.filter((word) => !STOP.has(word));
    if (filtered.length) raw = filtered;

    const groups = queryGroups(query);
    if (!raw.length || !groups.length) {
      return {
        items: pool.map((entry) => ({
          entry,
          concept: entry.concept,
          score: 0,
          matched: 0,
          total: 0,
          loose: false,
        })),
        loose: false,
        browse: true,
      };
    }

    const sortItems = (a, b) =>
      b.score - a.score ||
      (b.concept.pop || 0) - (a.concept.pop || 0) ||
      a.entry.idx - b.entry.idx;

    const exact = [];
    for (const entry of pool) {
      const scored = scoreEntry(entry, groups, raw);
      if (scored && !scored.loose) exact.push(scored);
    }

    if (exact.length) {
      exact.sort(sortItems);
      return { items: exact, loose: false, browse: false };
    }

    // Nothing matched every word. Show the closest concepts instead.
    const loose = [];
    for (const entry of pool) {
      const scored = scoreEntry(entry, groups, raw);
      if (scored) loose.push(scored);
    }

    loose.sort(
      (a, b) =>
        b.matched - a.matched ||
        b.score - a.score ||
        (b.concept.pop || 0) - (a.concept.pop || 0) ||
        a.entry.idx - b.entry.idx
    );

    return { items: loose.slice(0, 12), loose: true, browse: false };
  }

  return {
    buildIndex,
    search,
    tokenize: splitWords,
    prepare,
    stem,
    STOP,
  };
});
