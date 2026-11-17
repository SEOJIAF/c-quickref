# C quickref

A fast, search-first reference for C concepts. Type plain English — or half a
thought with a typo in it — and get the declaration, loop, or gotcha you need.

**Live: https://seojiaf.github.io/c-quickref/**

355 cards across 18 categories, from `hello, world` to C11 threads, POSIX
files, sanitizers, and the classic undefined-behavior traps. No build step, no
dependencies, no network. Five static files.

## What is covered

| Area | Examples |
| --- | --- |
| Language | types, qualifiers, operators, scope, declarations, literals |
| Strings | `mem*`, `str*`, splitting, trimming, UTF-8, wide strings |
| Control | loops, switch, `goto`, `setjmp`/`longjmp`, early returns |
| Arrays | initializers, VLAs, 2D arrays, sorting, shuffling, binary search |
| Functions | varargs, callbacks, function-pointer tables, `inline`, `noreturn` |
| Pointers | arithmetic, casts, const, `nullptr`, function/array pointers |
| Memory | allocation, ownership, leaks, arenas, alignment, layout |
| Structs | padding, bitfields, flexible arrays, unions, opaque types, lists |
| Preprocessor | macros, stringize/paste, X macros, conditionals, include paths |
| Files | `fopen` modes, binary I/O, seeking, CSV, buffering, errors |
| Stdlib | conversions, `rand`, `exit`, environment, `system`, search/sort |
| Math | roots, powers, rounding, trig, NaN/infinity, `-lm` |
| Time | `time_t`, `struct tm`, `strftime`, monotonic clocks, benchmarking |
| Threads | C11 threads, mutexes, condition variables, atomics, TLS, pthreads |
| POSIX | `getopt`, directories, `stat`, `mmap`, fork/exec, pipes, signals |
| Tooling | GCC/Clang flags, ASan/UBSan, gdb, Valgrind, make, static analysis |
| Gotchas | overflow, aliasing, bounds, format bugs, injection, leaks |

Content was cross-checked against [cppreference's C reference](https://en.cppreference.com/w/c),
[Beej's Guide to C](https://beej.us/guide/bgc/), the
[comp.lang.c FAQ](https://c-faq.com/), and POSIX man pages. POSIX-only and
implementation-specific features are labeled in the card notes.

## Run it

Open `index.html` directly:

```sh
xdg-open index.html   # or just double-click it
```

Or serve it locally:

```sh
python3 -m http.server 8000
# http://localhost:8000
```

## Search

Search is fuzzy on purpose:

- `declare char` and `declaring chars` both find **Declare a char**
- `string` finds **Declare a string**
- `how to do for loop in C`, `loops`, and `for loop` all find **for loop**
- plurals, word order, and small typos are tolerated
- stopwords like *how*, *to*, *in*, *a* are ignored

If nothing matches exactly, the closest results are shown with a notice rather
than an empty page.

## Keys

| Key | Action |
| --- | --- |
| `/` or `Ctrl/Cmd+K` | Focus search |
| `↑` / `↓` | Move between results |
| `Enter` | Copy the selected snippet |
| `Esc` | Clear search / blur |

Each card also has its own copy button. Search state is kept in the URL
(`?q=...&cat=...`), so a result is linkable.

## Files

| File | Purpose |
| --- | --- |
| `index.html` | Page shell |
| `style.css` | Theme and layout |
| `data.js` | The content — categories and concept cards |
| `search.js` | Fuzzy search engine (also loads in Node) |
| `app.js` | Rendering, keyboard, copy, URL state, highlighting |

## Adding a concept

Append an entry to `CONCEPTS` in `data.js`:

```js
{
  title: "Do the thing",
  cat: "Basics",              // must be one of CATS
  tags: ["thing", "example", "synonyms"],
  aka: "how do i do the thing", // natural-language query
  sum: "One line explaining it.",
  code: c`
    int x = 1;
  `,
  note: "Optional gotcha or clarification.",
  pop: 5                       // optional ranking nudge, 0–10
}
```

`c` is a `String.raw` alias, so backslashes stay literal. `tags` and `aka`
drive search: add the words a person would actually type, not just the formal
term. Avoid backticks and `${` inside `code` — they would terminate the
template literal.

If you add a new category to `CATS`, also give it a color in `style.css`
(`.cat-<name> { --cat: #rrggbb; }`).

## Checking search

`search.js` exports `CSearch` in the browser and via `module.exports` in Node,
so queries can be tested without a browser:

```sh
node -e '
const fs = require("fs");
const src = fs.readFileSync("data.js","utf8") + "\n" +
            fs.readFileSync("search.js","utf8") +
            "\nreturn { CONCEPTS, CSearch: globalThis.CSearch };";
const run = new Function("module", src);
const { CONCEPTS, CSearch } = run(undefined);
const index = CSearch.buildIndex(CONCEPTS);
console.log(CSearch.search(index, "declare char").items.slice(0,3).map((r) => r.concept.title));
'
```
