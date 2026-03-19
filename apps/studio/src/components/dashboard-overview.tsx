import type { ReactNode } from "react";
import type { SiteRecord } from "../lib/convex-api";

type DashboardOverviewProps = {
  site: SiteRecord;
  publicAppLabel: string;
  statusTitle: string;
  statusBody: ReactNode;
  embedSnippet: string;
  embedDemoUrl: string;
  copyState: "idle" | "copied";
  onCopySnippet: () => void;
};

export function DashboardOverview({
  site,
  publicAppLabel,
  statusTitle,
  statusBody,
  embedSnippet,
  embedDemoUrl,
  copyState,
  onCopySnippet,
}: DashboardOverviewProps) {
  return (
    <section className="overview-grid">
      <article className="panel summary-card">
        <p className="panel-kicker">Site</p>
        <h2>{site.name}</h2>
        <p className="site-meta">
          {publicAppLabel}/{site.slug}
        </p>
        {site.description ? <p className="site-description">{site.description}</p> : null}
      </article>

      <article className="panel summary-card">
        <p className="panel-kicker">Workspace</p>
        <h2>{statusTitle}</h2>
        <div className="muted-copy">{statusBody}</div>
      </article>

      <article className="panel summary-card">
        <p className="panel-kicker">Embed</p>
        <div className="snippet-box compact-snippet">
          <div className="snippet-row">
            <p className="snippet-label">One-line script</p>
            <div className="snippet-actions">
              {embedDemoUrl ? (
                <a
                  className="ghost-button button-link"
                  href={embedDemoUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open demo
                </a>
              ) : null}
              <button className="ghost-button" onClick={onCopySnippet} type="button">
                {copyState === "copied" ? "Copied" : "Copy"}
              </button>
            </div>
          </div>
          <pre>{embedSnippet}</pre>
        </div>
      </article>
    </section>
  );
}
