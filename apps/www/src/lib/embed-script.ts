const embedCss = `
:host {
  all: initial;
}

/* Mirrors the hosted blog page (app/b/[siteSlug]) so the embed and the blog read as one publication. */
.booom-root {
  --booom-paper: #fdfdfc;
  --booom-ink: #1d1c1a;
  --booom-soft: #4a4844;
  --booom-muted: #75726c;
  --booom-rule: #e6e4df;
  --booom-serif: "Newsreader", Georgia, "Times New Roman", serif;
  --booom-sans: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  display: block;
  container-type: inline-size;
  font-family: var(--booom-sans);
  color: var(--booom-ink);
  -webkit-font-smoothing: antialiased;
}

.booom-root[data-theme="dark"] {
  --booom-paper: #161615;
  --booom-ink: #ecebe7;
  --booom-soft: #c9c7c1;
  --booom-muted: #96938c;
  --booom-rule: #2c2b29;
}

.booom-card {
  background: var(--booom-paper);
  border: 1px solid var(--booom-rule);
  border-radius: 12px;
  padding: 28px 28px 0;
}

.booom-header {
  padding-bottom: 20px;
}

.booom-site {
  margin: 0;
  font-family: var(--booom-serif);
  font-size: 30px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.01em;
  color: var(--booom-ink);
}

.booom-description {
  margin: 8px 0 0;
  font-family: var(--booom-serif);
  font-style: italic;
  font-size: 17px;
  line-height: 1.5;
  color: var(--booom-soft);
}

.booom-list {
  border-top: 1px solid var(--booom-rule);
}

.booom-item {
  display: grid;
  gap: 2px 24px;
  padding: 18px 0;
  border-bottom: 1px solid var(--booom-rule);
  color: inherit;
  text-decoration: none;
}

.booom-item:focus-visible {
  outline: 2px solid var(--booom-ink);
  outline-offset: 2px;
}

.booom-meta {
  font-size: 13px;
  line-height: 1.4;
  color: var(--booom-muted);
  font-variant-numeric: tabular-nums;
}

.booom-title {
  display: block;
  font-family: var(--booom-serif);
  font-size: 21px;
  line-height: 1.3;
  font-weight: 500;
  color: var(--booom-ink);
  text-decoration-thickness: 1px;
  text-underline-offset: 4px;
}

.booom-item:hover .booom-title {
  text-decoration-line: underline;
  text-decoration-color: color-mix(in srgb, var(--booom-ink) 35%, transparent);
}

.booom-excerpt {
  display: -webkit-box;
  margin-top: 4px;
  font-family: var(--booom-serif);
  font-size: 16.5px;
  line-height: 1.55;
  color: var(--booom-soft);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

@container (min-width: 520px) {
  .booom-item {
    grid-template-columns: 7.5rem minmax(0, 1fr);
  }

  .booom-meta {
    padding-top: 5px;
  }
}

.booom-footer {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 8px 16px;
  padding: 16px 0 20px;
  font-size: 13px;
}

.booom-link,
.booom-badge {
  color: var(--booom-muted);
  text-decoration: none;
}

.booom-link:hover,
.booom-badge:hover {
  color: var(--booom-ink);
}

.booom-status {
  margin: 0 0 28px;
  font-family: var(--booom-serif);
  font-size: 17px;
  color: var(--booom-muted);
}

.booom-list .booom-status {
  margin: 0;
  padding: 18px 0;
  border-bottom: 1px solid var(--booom-rule);
}
`;

export function getEmbedScript() {
  return `(function () {
  if (window.__booomEmbedLoaded) return;
  window.__booomEmbedLoaded = true;

  var css = ${JSON.stringify(embedCss)};

  function ensureFont() {
    if (document.querySelector("link[data-booom-font]")) return;
    var link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400..600;1,6..72,400&display=swap";
    link.setAttribute("data-booom-font", "");
    (document.head || document.documentElement).appendChild(link);
  }

  function getCurrentScript() {
    if (document.currentScript) return document.currentScript;
    var scripts = document.getElementsByTagName("script");
    for (var i = scripts.length - 1; i >= 0; i--) {
      var script = scripts[i];
      if (script && script.src && script.src.indexOf("/embed/v1.js") !== -1) {
        return script;
      }
    }
    return null;
  }

  function normalizeSite(value) {
    if (typeof value !== "string") return null;
    var normalized = value.trim().toLowerCase();
    if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(normalized)) return null;
    return normalized;
  }

  function formatDate(value) {
    if (!value) return "Recently";
    try {
      return new Intl.DateTimeFormat("en", {
        month: "short",
        day: "numeric",
        year: "numeric",
        timeZone: "UTC"
      }).format(new Date(value));
    } catch (error) {
      return "Recently";
    }
  }

  function ensureMount(script, selector) {
    if (selector) {
      var selected = document.querySelector(selector);
      if (selected) return selected;
    }
    var mount = document.createElement("div");
    script.parentNode.insertBefore(mount, script.nextSibling);
    return mount;
  }

  function render(root, html) {
    root.innerHTML = "";
    var style = document.createElement("style");
    style.textContent = css;
    root.appendChild(style);
    var wrapper = document.createElement("div");
    wrapper.className = "booom-root";
    wrapper.setAttribute("data-theme", root.host && root.host.dataset ? root.host.dataset.theme || "light" : "light");
    wrapper.innerHTML = html;
    root.appendChild(wrapper);
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;")
      .replace(/'/g, "&#39;");
  }

  var script = getCurrentScript();
  if (!script) return;

  var theme = script.dataset.theme === "dark" ? "dark" : "light";
  var limit = Number.parseInt(script.dataset.limit || "5", 10);
  if (!Number.isFinite(limit) || limit <= 0) limit = 5;
  var target = script.dataset.target || "";
  var origin = new URL(script.src, window.location.href).origin;
  var mount = ensureMount(script, target);
  mount.dataset.theme = theme;

  ensureFont();
  var root = mount.shadowRoot || mount.attachShadow({ mode: "open" });
  var site = normalizeSite(script.dataset.site);

  if (!site) {
    render(root, '<div class="booom-card"><p class="booom-status">This embed needs a valid data-site attribute.</p></div>');
    console.error("Booom embed requires a valid data-site slug");
    return;
  }

  render(root, '<div class="booom-card"><p class="booom-status">Loading posts…</p></div>');

  fetch(origin + "/api/embed/" + encodeURIComponent(site) + "?limit=" + encodeURIComponent(String(limit)), {
    method: "GET",
    headers: {
      "Accept": "application/json"
    }
  })
    .then(function (response) {
      if (response.status === 400) {
        return { __booomState: "invalid" };
      }
      if (response.status === 404) {
        return { __booomState: "missing" };
      }
      if (!response.ok) throw new Error("Failed to load posts");
      return response.json();
    })
    .then(function (payload) {
      if (payload && payload.__booomState === "invalid") {
        render(root, '<div class="booom-card"><p class="booom-status">This embed has an invalid data-site attribute.</p></div>');
        return;
      }

      if (payload && payload.__booomState === "missing") {
        render(root, '<div class="booom-card"><p class="booom-status">No blog exists at this address.</p></div>');
        return;
      }

      if (!payload || !payload.site) {
        render(root, '<div class="booom-card"><p class="booom-status">No blog exists at this address.</p></div>');
        return;
      }

      var items = (payload.posts || []).map(function (post) {
        return [
          '<a class="booom-item" href="' + escapeHtml(post.url) + '" target="_blank" rel="noopener noreferrer">',
          '<span class="booom-meta">' + escapeHtml(formatDate(post.publishedAt)) + '</span>',
          '<span>',
          '<span class="booom-title">' + escapeHtml(post.title) + '</span>',
          post.excerpt ? '<span class="booom-excerpt">' + escapeHtml(post.excerpt) + '</span>' : "",
          '</span>',
          "</a>"
        ].join("");
      }).join("");

      var content = items || '<p class="booom-status">Nothing published yet. Check back soon.</p>';
      render(root, [
        '<div class="booom-card">',
        '<div class="booom-header">',
        '<p class="booom-site">' + escapeHtml(payload.site.name) + "</p>",
        payload.site.description ? '<p class="booom-description">' + escapeHtml(payload.site.description) + "</p>" : "",
        "</div>",
        '<div class="booom-list">' + content + "</div>",
        '<div class="booom-footer">',
        '<a class="booom-link" href="' + escapeHtml(payload.site.url) + '" target="_blank" rel="noopener noreferrer">All posts</a>',
        '<a class="booom-badge" href="' + escapeHtml(origin) + '" target="_blank" rel="noopener noreferrer">Published with Booom</a>',
        "</div>",
        "</div>"
      ].join(""));
    })
    .catch(function () {
      render(root, '<div class="booom-card"><p class="booom-status">Posts couldn’t load. Refresh the page to try again.</p></div>');
    });
})();`;
}
