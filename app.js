(() => {
  "use strict";

  const input = document.getElementById("q");
  const clearBtn = document.getElementById("clear");
  const chipsEl = document.getElementById("chips");
  const resultsEl = document.getElementById("results");
  const countEl = document.getElementById("count");
  const bannerEl = document.getElementById("banner");
  const emptyEl = document.getElementById("empty");
  const toastEl = document.getElementById("toast");
  const dock = document.getElementById("dock");

  const INDEX = CSearch.buildIndex(CONCEPTS);
  const QUERY_LIMIT = 30;
  const catCounts = new Map();
  for (const concept of CONCEPTS) {
    catCounts.set(concept.cat, (catCounts.get(concept.cat) || 0) + 1);
  }

  const state = {
    query: "",
    cat: null,
    items: [],
    loose: false,
    browse: true,
    selected: -1,
    expanded: false,
  };

  const codeCache = new WeakMap();
  let toastTimer = 0;
  let urlTimer = 0;
  let frame = 0;

  /* ------------------------------------------------------------- helpers */

  const ESC = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (ch) => ESC[ch]);
  }

  function escapeRe(value) {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  function slug(value) {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  }

  /* ------------------------------------------------------ syntax highlight */

  const KEYWORDS = new Set(
    ("auto break case const continue default do else enum extern for goto if inline " +
      "register restrict return sizeof static struct switch typedef union volatile while " +
      "_Alignas _Alignof _Atomic _Generic _Noreturn _Static_assert _Thread_local")
      .split(" ")
  );

  const TYPES = new Set(
    ("char double float int long short signed unsigned void _Bool _Complex _Imaginary " +
      "size_t ssize_t ptrdiff_t FILE bool true false NULL int8_t int16_t int32_t int64_t " +
      "uint8_t uint16_t uint32_t uint64_t time_t va_list")
      .split(" ")
  );

  const CODE_RE =
    /(\/\/[^\n]*|\/\*[\s\S]*?\*\/)|("(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*')|(^[ \t]*#[^\n]*)|([A-Za-z_]\w*)|(\d[\w.]*)/gm;

  function tok(cls, text) {
    return '<span class="tok-' + cls + '">' + escapeHtml(text) + "</span>";
  }

  function highlightC(code) {
    let out = "";
    let last = 0;

    for (const match of code.matchAll(CODE_RE)) {
      const full = match[0];
      out += escapeHtml(code.slice(last, match.index));

      if (match[1]) {
        out += tok("com", full);
      } else if (match[2]) {
        out += tok("str", full);
      } else if (match[3]) {
        out += tok("pre", full);
      } else if (match[4]) {
        let i = match.index + full.length;
        while (code[i] === " ") i++;
        if (KEYWORDS.has(full)) out += tok("kw", full);
        else if (TYPES.has(full)) out += tok("type", full);
        else if (code[i] === "(") out += tok("fn", full);
        else out += escapeHtml(full);
      } else if (match[5]) {
        out += tok("num", full);
      } else {
        out += escapeHtml(full);
      }

      last = match.index + full.length;
    }

    return out + escapeHtml(code.slice(last));
  }

  function codeHtml(concept) {
    let html = codeCache.get(concept);
    if (!html) {
      html = highlightC(concept.code);
      codeCache.set(concept, html);
    }
    return html;
  }

  /* -------------------------------------------------------------- marking */

  function highlightTerms(query) {
    const words = CSearch.tokenize(CSearch.prepare(query));
    const set = new Set();

    for (const word of words) {
      if (word.length < 2 || CSearch.STOP.has(word)) continue;
      set.add(word);
      const base = CSearch.stem(word);
      if (base.length >= 2) set.add(base);
    }

    return [...set].sort((a, b) => b.length - a.length);
  }

  function markText(text, terms) {
    let html = escapeHtml(text);
    if (!terms.length) return html;

    const pattern = terms.map(escapeRe).join("|");
    return html.replace(new RegExp("(" + pattern + ")", "gi"), "<mark>$1</mark>");
  }

  /* --------------------------------------------------------------- chips */

  function buildChips() {
    const frag = document.createDocumentFragment();

    const all = document.createElement("button");
    all.type = "button";
    all.className = "chip";
    all.dataset.cat = "";
    all.innerHTML = 'All <span class="n">' + CONCEPTS.length + "</span>";
    frag.appendChild(all);

    for (const cat of CATS) {
      const chip = document.createElement("button");
      chip.type = "button";
      chip.className = "chip cat-" + slug(cat);
      chip.dataset.cat = cat;
      chip.innerHTML = escapeHtml(cat) + ' <span class="n">' + (catCounts.get(cat) || 0) + "</span>";
      frag.appendChild(chip);
    }

    chipsEl.replaceChildren(frag);
    syncChips();
  }

  function syncChips() {
    for (const chip of chipsEl.querySelectorAll(".chip")) {
      const value = chip.dataset.cat || null;
      chip.setAttribute("aria-pressed", String(value === state.cat));
    }
  }

  /* ------------------------------------------------------------ rendering */

  function visibleCount() {
    if (state.browse || state.expanded) return state.items.length;
    return Math.min(QUERY_LIMIT, state.items.length);
  }

  function renderCard(item, index, terms) {
    const concept = item.concept;
    const cat = slug(concept.cat);

    return (
      '<article class="card cat-' + cat + '" data-i="' + index + '">' +
        '<div class="card-head">' +
          "<h2>" + markText(concept.title, terms) + "</h2>" +
          '<span class="pill">' + escapeHtml(concept.cat) + "</span>" +
        "</div>" +
        '<p class="sum">' + markText(concept.sum, terms) + "</p>" +
        '<div class="code">' +
          '<div class="code-bar">' +
            '<span class="lang">C</span>' +
            '<button class="copy" type="button" data-i="' + index + '" ' +
              'aria-label="Copy code for ' + escapeHtml(concept.title) + '">copy</button>' +
          "</div>" +
          "<pre><code>" + codeHtml(concept) + "</code></pre>" +
        "</div>" +
        (concept.note
          ? '<p class="note">' + markText(concept.note, terms) + "</p>"
          : "") +
      "</article>"
    );
  }

  function render() {
    const result = CSearch.search(INDEX, state.query, state.cat);
    state.items = result.items;
    state.loose = result.loose;
    state.browse = result.browse;

    const shown = visibleCount();
    const terms = state.browse ? [] : highlightTerms(state.query);

    const html = [];
    for (let i = 0; i < shown; i++) {
      html.push(renderCard(state.items[i], i, terms));
    }

    if (!state.browse && !state.expanded && state.items.length > shown) {
      html.push(
        '<button class="more" type="button">Show all ' +
          state.items.length + " results</button>"
      );
    }

    resultsEl.innerHTML = html.join("");
    setSelected(state.selected);
    updateMeta();
    updateEmpty();
    updateClear();
    syncChips();
  }

  function updateMeta() {
    const n = state.items.length;

    if (state.browse) {
      const where = state.cat ? " in " + escapeHtml(state.cat) : "";
      countEl.innerHTML = "<strong>" + n + "</strong> concept" + (n === 1 ? "" : "s") + where;
    } else {
      const shown = visibleCount();
      let text =
        "<strong>" + n + "</strong> " + (state.loose ? "closest match" : "match") +
        (n === 1 ? "" : "es") + " for “" + escapeHtml(state.query.trim()) + "”";
      if (shown < n) text += " <span class=\"meta-hint\">· showing the best " + shown + "</span>";
      countEl.innerHTML = text;
    }

    if (state.loose && n > 0) {
      bannerEl.hidden = false;
      bannerEl.innerHTML =
        "No exact match for <b>“" + escapeHtml(state.query.trim()) + "”</b> — showing the closest concepts. " +
        "Try fewer or different words.";
    } else {
      bannerEl.hidden = true;
    }
  }

  function updateEmpty() {
    const empty = state.items.length === 0;
    emptyEl.hidden = !empty;
    if (!empty) return;

    const scope = state.cat ? " in " + escapeHtml(state.cat) : "";

    emptyEl.innerHTML =
      "<h3>Nothing found</h3>" +
      "<p>No concept" + scope + " matches “" + escapeHtml(state.query.trim()) + "”.</p>" +
      '<div class="tries">' +
        (state.cat ? '<button class="try try-all" type="button">Search all categories</button>' : "") +
        ["declare char", "string", "for loop", "malloc", "struct pointer", "read a file"]
          .map((q) => '<button class="try" type="button" data-q="' + escapeHtml(q) + '">' + escapeHtml(q) + "</button>")
          .join("") +
      "</div>";
  }

  function updateClear() {
    clearBtn.hidden = input.value.length === 0;
  }

  /* ------------------------------------------------------------ selection */

  function setSelected(index) {
    const cards = resultsEl.querySelectorAll(".card");
    cards.forEach((card) => card.classList.remove("is-sel"));
    if (index < 0 || index >= cards.length) return;

    const card = resultsEl.querySelector('.card[data-i="' + index + '"]');
    if (card) card.classList.add("is-sel");
  }

  function moveSelection(delta) {
    const count = visibleCount();
    if (!count) return;

    if (state.selected < 0) {
      state.selected = delta > 0 ? 0 : count - 1;
    } else {
      state.selected = (state.selected + delta + count) % count;
    }

    setSelected(state.selected);
    const card = resultsEl.querySelector('.card[data-i="' + state.selected + '"]');
    if (card) card.scrollIntoView({ block: "nearest" });
  }

  /* --------------------------------------------------------------- copy */

  function fallbackCopy(text) {
    const area = document.createElement("textarea");
    area.value = text;
    area.setAttribute("readonly", "");
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    try {
      document.execCommand("copy");
    } catch {
      /* ignore */
    }
    area.remove();
  }

  async function copyIndex(index, button) {
    const item = state.items[index];
    if (!item) return;
    const concept = item.concept;

    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(concept.code);
      } else {
        fallbackCopy(concept.code);
      }
    } catch {
      fallbackCopy(concept.code);
    }

    toast("Copied <b>" + escapeHtml(concept.title) + "</b>");

    if (button) {
      button.classList.add("done");
      button.textContent = "copied";
      setTimeout(() => {
        button.classList.remove("done");
        button.textContent = "copy";
      }, 1200);
    }
  }

  function toast(html) {
    clearTimeout(toastTimer);
    toastEl.innerHTML = html;
    toastEl.classList.add("show");
    toastTimer = setTimeout(() => toastEl.classList.remove("show"), 1700);
  }

  /* ---------------------------------------------------------------- state */

  function update() {
    if (frame) cancelAnimationFrame(frame);
    frame = requestAnimationFrame(() => {
      frame = 0;
      render();
    });
  }

  function setQuery(value) {
    state.query = value;
    state.selected = -1;
    state.expanded = false;
    update();
    scheduleUrl();
  }

  function setCategory(cat) {
    state.cat = cat;
    state.selected = -1;
    state.expanded = false;
    update();
    scheduleUrl();
  }

  function scheduleUrl() {
    clearTimeout(urlTimer);
    urlTimer = setTimeout(() => {
      const params = new URLSearchParams();
      if (state.query.trim()) params.set("q", state.query.trim());
      if (state.cat) params.set("cat", state.cat);
      const search = params.toString();
      try {
        history.replaceState(null, "", location.pathname + (search ? "?" + search : ""));
      } catch {
        /* file:// and some browsers refuse; that is fine */
      }
    }, 250);
  }

  /* --------------------------------------------------------------- events */

  input.addEventListener("input", () => {
    updateClear();
    setQuery(input.value);
  });

  clearBtn.addEventListener("click", () => {
    input.value = "";
    setQuery("");
    input.focus();
    updateClear();
  });

  chipsEl.addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    const cat = chip.dataset.cat || null;
    setCategory(state.cat === cat ? null : cat);

    if (window.matchMedia("(pointer: fine)").matches) {
      input.focus({ preventScroll: true });
    }
  });

  resultsEl.addEventListener("click", (event) => {
    const copyButton = event.target.closest(".copy");
    if (copyButton) {
      copyIndex(Number(copyButton.dataset.i), copyButton);
      return;
    }

    const more = event.target.closest(".more");
    if (more) {
      state.expanded = true;
      render();
    }
  });

  emptyEl.addEventListener("click", (event) => {
    if (event.target.closest(".try-all")) {
      setCategory(null);
      input.focus();
      return;
    }

    const button = event.target.closest(".try");
    if (!button) return;

    state.cat = null;
    input.value = button.dataset.q;
    setQuery(input.value);
    input.focus();
    updateClear();
  });

  document.addEventListener("keydown", (event) => {
    const typing = event.target === input;
    const mod = event.metaKey || event.ctrlKey;

    if ((event.key === "/" && !typing && !mod) || (mod && event.key.toLowerCase() === "k")) {
      event.preventDefault();
      input.focus();
      input.select();
      return;
    }

    if (event.key === "Escape") {
      if (typing) {
        if (input.value) {
          input.value = "";
          setQuery("");
          updateClear();
        } else {
          input.blur();
        }
      } else if (state.query) {
        input.value = "";
        setQuery("");
        updateClear();
      } else if (state.selected >= 0) {
        state.selected = -1;
        setSelected(-1);
      }
      return;
    }

    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      if (typing || event.target === document.body || event.target === resultsEl) {
        event.preventDefault();
        moveSelection(event.key === "ArrowDown" ? 1 : -1);
      }
      return;
    }

    if (event.key === "Enter" && !event.shiftKey && !mod) {
      const tag = event.target.tagName;
      if (tag === "BUTTON" || tag === "A" || tag === "INPUT" && event.target.type === "search") {
        if (tag === "INPUT") {
          event.preventDefault();
          if (state.items.length) copyIndex(state.selected >= 0 ? state.selected : 0);
        }
        return;
      }
      if (state.items.length) {
        event.preventDefault();
        copyIndex(state.selected >= 0 ? state.selected : 0);
      }
    }
  });

  window.addEventListener(
    "scroll",
    () => dock.classList.toggle("scrolled", window.scrollY > 6),
    { passive: true }
  );

  /* ---------------------------------------------------------------- boot */

  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q") || "";
  const initialCat = params.get("cat");

  input.value = initialQuery;
  state.query = initialQuery;
  state.cat = CATS.includes(initialCat) ? initialCat : null;

  buildChips();
  render();

  if (!initialQuery && window.matchMedia("(pointer: fine)").matches) {
    input.focus({ preventScroll: true });
  }
})();
