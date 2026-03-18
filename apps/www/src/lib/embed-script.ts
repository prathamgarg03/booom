const embedCss = `
:host {
  all: initial;
}

.booom-root {
  font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
  color: #201c1a;
  display: block;
}

.booom-card {
  border: 1px solid rgba(19, 18, 17, 0.12);
  border-radius: 18px;
  background: linear-gradient(180deg, #fffaf2 0%, #f5ecdd 100%);
  padding: 18px;
  box-shadow: 0 10px 30px rgba(54, 35, 18, 0.08);
}

.booom-root[data-theme="dark"] .booom-card {
  background: linear-gradient(180deg, #151515 0%, #1e1d1a 100%);
  border-color: rgba(255, 255, 255, 0.08);
  color: #f6f0e4;
}

.booom-kicker {
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.24em;
  color: #8b6d5c;
  margin: 0 0 14px;
}

.booom-root[data-theme="dark"] .booom-kicker {
  color: #d3a98d;
}

.booom-list {
  display: grid;
  gap: 12px;
}

.booom-item {
  display: block;
  text-decoration: none;
  color: inherit;
  padding: 14px 0;
  border-top: 1px solid rgba(19, 18, 17, 0.08);
}

.booom-item:first-child {
  border-top: 0;
  padding-top: 0;
}

.booom-title {
  display: block;
  font-size: 18px;
  line-height: 1.3;
  font-weight: 600;
  color: inherit;
}

.booom-meta {
  display: block;
  margin-top: 7px;
  font-size: 12px;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: #b04e18;
}

.booom-root[data-theme="dark"] .booom-meta {
  color: #f4a36f;
}

.booom-excerpt {
  display: block;
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.55;
  color: #5e5146;
}

.booom-root[data-theme="dark"] .booom-excerpt {
  color: #c7bcab;
}

.booom-footer {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-top: 18px;
  padding-top: 14px;
  border-top: 1px solid rgba(19, 18, 17, 0.08);
  font-size: 12px;
}

.booom-badge,
.booom-link {
  color: inherit;
  text-decoration: none;
}

.booom-status {
  font-size: 14px;
  line-height: 1.5;
  color: #5e5146;
}

.booom-root[data-theme="dark"] .booom-status {
  color: #c7bcab;
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
    wrapper.dataset.theme = root.host && root.host.dataset ? root.host.dataset.theme || "light" : "light";
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
    render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">The embed is missing a valid data-site slug.</p></div>');
    console.error("Booom embed requires a valid data-site slug");
    return;
  }

  render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">Loading posts...</p></div>');

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
        render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">This embed has an invalid site configuration.</p></div>');
        return;
      }

      if (payload && payload.__booomState === "missing") {
        render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">This blog could not be found.</p></div>');
        return;
      }

      if (!payload || !payload.site) {
        render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">This blog could not be found.</p></div>');
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

      var content = items || '<p class="booom-status">No published posts yet.</p>';
      render(root, [
        '<div class="booom-card">',
        '<p class="booom-kicker">' + escapeHtml(payload.site.name) + "</p>",
        '<div class="booom-list">' + content + "</div>",
        '<div class="booom-footer">',
        '<a class="booom-link" href="' + escapeHtml(payload.site.url) + '" target="_blank" rel="noopener noreferrer">Open blog</a>',
        '<a class="booom-badge" href="' + escapeHtml(origin) + '" target="_blank" rel="noopener noreferrer">Powered by Booom</a>',
        "</div>",
        "</div>"
      ].join(""));
    })
    .catch(function () {
      render(root, '<div class="booom-card"><p class="booom-kicker">Booom Embed</p><p class="booom-status">We could not load this blog right now.</p></div>');
    });
})();`;
}
