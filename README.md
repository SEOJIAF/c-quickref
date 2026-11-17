# C quickref

A fast, search-first reference for C concepts. Type plain English — or half a
thought with a typo in it — and get the declaration, loop, or gotcha you need.

**Live: https://seojiaf.github.io/c-quickref/**

No build step, no dependencies, no network. Five static files.

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
  id: "my-concept",
  cat: "basics",              // must exist in CATS
  title: "Do the thing",
  desc: "One line explaining it.",
  tags: ["thing", "example", "synonyms"],
  code: c`
    int x = 1;
  `
}
```

`c` is a `String.raw` alias, so backslashes stay literal. Tags drive search:
add the words a person would actually type, not just the formal term.

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
