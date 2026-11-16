const embedCss = `
:host {
  all: initial;
}

.booom-root {
  --booom-bg: #ffffff;
  --booom-ink: #1d1c1a;
  --booom-muted: #6f6c66;
  --booom-rule: #e7e5e1;
  --booom-hover: #f6f5f2;
  display: block;
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  font-size: 15px;
  line-height: 1.5;
  color: var(--booom-ink);
  -webkit-font-smoothing: antialiased;
}

.booom-root[data-theme="dark"] {
  --booom-bg: #1b1b1a;
  --booom-ink: #ecebe7;
  --booom-muted: #9a978f;
  --booom-rule: #2f2e2b;
  --booom-hover: #232321;
}

.booom-card {
  background: var(--booom-bg);
  border: 1px solid var(--booom-rule);
  border-radius: 12px;
  overflow: hidden;
}

.booom-header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: 12px;
  padding: 16px 20px 12px;
}

.booom-site {
  margin: 0;
  font-size: 15px;
  font-weight: 600;
  color: var(--booom-ink);
}

.booom-link,
.booom-badge {
  color: var(--booom-muted);
  text-decoration: none;
  font-size: 13px;
  white-space: nowrap;
}

.booom-link:hover,
.booom-badge:hover {
  color: var(--booom-ink);
}

.booom-list {
  display: block;
}

.booom-item {
  display: block;
  padding: 14px 20px;
  border-top: 1px solid var(--booom-rule);
  color: inherit;
  text-decoration: none;
  transition: background-color 120ms ease;
}

.booom-item:hover {
  background: var(--booom-hover);
}

.booom-item:focus-visible {
  outline: 2px solid var(--booom-ink);
  outline-offset: -2px;
}

.booom-title {
  display: block;
  font-size: 16px;
  font-weight: 600;
  line-height: 1.35;
  color: var(--booom-ink);
}

.booom-item:hover .booom-title {
  text-decoration: underline;
  text-underline-offset: 3px;
  text-decoration-thickness: 1px;
}

.booom-meta {
  display: block;
  margin-top: 2px;
  font-size: 13px;
  color: var(--booom-muted);
}

.booom-excerpt {
  display: -webkit-box;
  margin-top: 6px;
  font-size: 14px;
  line-height: 1.55;
  color: var(--booom-muted);
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.booom-footer {
  display: flex;
  justify-content: flex-end;
  padding: 10px 20px;
  border-top: 1px solid var(--booom-rule);
}

.booom-badge {
  font-size: 12px;
}

.booom-status {
  margin: 0;
  padding: 18px 20px;
  font-size: 14px;
  color: var(--booom-muted);
}

@media (prefers-reduced-motion: reduce) {
  .booom-item {
    transition: none;
  }
}
`;

export function getEmbedScript() {
  return `(function () {
  if (window.__booomEmbedLoaded) return;
  window.__booomEmbedLoaded = true;

  var css = ${JSON.stringify(embedCss)};

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
        year: "numeric"
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
          '<span class="booom-title">' + escapeHtml(post.title) + '</span>',
          '<span class="booom-meta">' + escapeHtml(formatDate(post.publishedAt)) + '</span>',
          post.excerpt ? '<span class="booom-excerpt">' + escapeHtml(post.excerpt) + '</span>' : "",
          "</a>"
        ].join("");
      }).join("");

      var content = items || '<p class="booom-status" style="border-top:1px solid var(--booom-rule)">No posts published yet.</p>';
      render(root, [
        '<div class="booom-card">',
        '<div class="booom-header">',
        '<p class="booom-site">' + escapeHtml(payload.site.name) + "</p>",
        '<a class="booom-link" href="' + escapeHtml(payload.site.url) + '" target="_blank" rel="noopener noreferrer">All posts</a>',
        "</div>",
        '<div class="booom-list">' + content + "</div>",
        '<div class="booom-footer">',
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
