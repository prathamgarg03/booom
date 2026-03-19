import { UserButton } from "@clerk/react";
import { Link, NavLink } from "react-router-dom";
import type { SiteRecord } from "../lib/convex-api";

type DashboardHeaderProps = {
  site: SiteRecord | null;
  publicAppUrl: string;
  userLabel: string;
};

export function DashboardHeader({
  site,
  publicAppUrl,
  userLabel,
}: DashboardHeaderProps) {
  return (
    <header className="studio-header">
      <div>
        <p className="eyebrow">Booom Studio</p>
        <h1>Dashboard</h1>
        <p className="muted-copy">
          Keep setup, drafting, and publishing on routes that are easier to extend.
        </p>
        <nav className="dashboard-nav">
          <NavLink end to="/dashboard">
            Overview
          </NavLink>
          {site ? <NavLink to="/dashboard/posts/new">New post</NavLink> : null}
          {site ? (
            <a href={`${publicAppUrl}/b/${site.slug}`} rel="noreferrer" target="_blank">
              Public blog
            </a>
          ) : null}
        </nav>
      </div>
      <div className="header-actions">
        <Link className="brand-link" to="/">
          Home
        </Link>
        <div className="identity-chip">
          <span className="identity-label">{userLabel}</span>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
