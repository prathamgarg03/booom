import { useEffect, useMemo, useState } from "react";
import {
  Authenticated,
  AuthLoading,
  Unauthenticated,
  useMutation,
  useQuery,
} from "convex/react";
import { SignInButton, UserButton, useUser } from "@clerk/react";
import { api } from "../../../convex/_generated/api";
import "./App.css";

function makeSlug(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function SignedOutView() {
  return (
    <section className="auth-panel">
      <p className="eyebrow">Booom Studio</p>
      <h1>Publish developer blogs without turning every launch into a CMS project.</h1>
      <p className="lede">
        This first checkpoint wires Clerk, Convex, and the studio shell together.
        Sign in to create your site record and reserve your public blog slug.
      </p>
      <div className="cta-row">
        <SignInButton mode="modal">
          <button className="primary-button">Sign in to start</button>
        </SignInButton>
      </div>
      <div className="feature-grid">
        <article>
          <span>01</span>
          <h2>Managed writing flow</h2>
          <p>Draft in Booom, publish from Booom, and keep your product site clean.</p>
        </article>
        <article>
          <span>02</span>
          <h2>One-line embed goal</h2>
          <p>Your canonical posts live on Booom, while your site only needs a tiny script.</p>
        </article>
        <article>
          <span>03</span>
          <h2>Open-source path</h2>
          <p>This repo stays structured so later self-hosting doesn&apos;t become a rewrite.</p>
        </article>
      </div>
    </section>
  );
}

function Workspace() {
  const { user: clerkUser } = useUser();
  const ensureCurrentUser = useMutation(api.users.ensureCurrentUser);
  const createSite = useMutation(api.sites.create);
  const viewer = useQuery(api.users.viewer);
  const sites = useQuery(api.sites.listMine, viewer ? {} : "skip");

  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [slugTouched, setSlugTouched] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copyState, setCopyState] = useState<"idle" | "copied">("idle");

  useEffect(() => {
    void ensureCurrentUser().catch((error: unknown) => {
      const message =
        error instanceof Error ? error.message : "Could not initialize your user";
      setErrorMessage(message);
    });
  }, [ensureCurrentUser]);

  const site = sites?.[0] ?? null;
  const embedSnippet = useMemo(() => {
    if (!site) {
      return "";
    }

    return `<script async src="https://cdn.booom.dev/embed/v1.js" data-site="${site.slug}"></script>`;
  }, [site]);

  async function handleCreateSite(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setErrorMessage(null);
    setStatusMessage(null);
    setIsSubmitting(true);

    try {
      await createSite({
        name,
        slug,
        description: description || undefined,
      });
      setStatusMessage("Site created. Next checkpoint: write and publish your first post.");
      setName("");
      setSlug("");
      setDescription("");
      setSlugTouched(false);
    } catch (error) {
      const message =
        error instanceof Error ? error.message : "Could not create your site";
      setErrorMessage(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCopySnippet() {
    if (!embedSnippet) {
      return;
    }

    try {
      await navigator.clipboard.writeText(embedSnippet);
      setCopyState("copied");
      setTimeout(() => setCopyState("idle"), 1800);
    } catch {
      setErrorMessage("Could not copy the snippet. You can still copy it manually.");
    }
  }

  return (
    <section className="studio-shell">
      <header className="studio-header">
        <div>
          <p className="eyebrow">Checkpoint 1</p>
          <h1>Claim your Booom studio.</h1>
        </div>
        <div className="header-actions">
          <div className="identity-chip">
            <span className="identity-label">
              {clerkUser?.fullName ?? clerkUser?.primaryEmailAddress?.emailAddress ?? "Signed in"}
            </span>
          </div>
          <UserButton />
        </div>
      </header>

      <div className="workspace-grid">
        <section className="panel intro-panel">
          <p className="panel-kicker">Why this matters</p>
          <h2>We&apos;re setting the product spine first.</h2>
          <p>
            This checkpoint provisions the authenticated user in Convex, reserves a
            public site slug, and gives us the base model we&apos;ll build posts and embeds on top of.
          </p>
          <ul className="checklist">
            <li>Clerk identity synced into Convex</li>
            <li>One site per account for the MVP</li>
            <li>Public slug reserved for future hosted pages</li>
          </ul>
        </section>

        <section className="panel form-panel">
          <p className="panel-kicker">Site setup</p>
          <h2>{site ? "Your first site is ready." : "Create your first site."}</h2>

          {errorMessage ? <p className="notice notice-error">{errorMessage}</p> : null}
          {statusMessage ? <p className="notice notice-success">{statusMessage}</p> : null}

          {viewer === undefined ? (
            <p className="muted-copy">Provisioning your Booom profile...</p>
          ) : site ? (
            <div className="site-card">
              <div className="site-card-header">
                <div>
                  <h3>{site.name}</h3>
                  <p className="site-meta">booom.dev/{site.slug}</p>
                </div>
                <span className="status-pill">ready</span>
              </div>
              {site.description ? <p className="site-description">{site.description}</p> : null}
              <div className="snippet-box">
                <div className="snippet-row">
                  <p className="snippet-label">Future one-line embed</p>
                  <button className="ghost-button" onClick={handleCopySnippet} type="button">
                    {copyState === "copied" ? "Copied" : "Copy"}
                  </button>
                </div>
                <pre>{embedSnippet}</pre>
              </div>
            </div>
          ) : (
            <form className="site-form" onSubmit={handleCreateSite}>
              <label>
                <span>Site name</span>
                <input
                  onChange={(event) => {
                    const nextName = event.target.value;
                    setName(nextName);
                    if (!slugTouched) {
                      setSlug(makeSlug(nextName));
                    }
                  }}
                  placeholder="Booom Engineering"
                  value={name}
                />
              </label>

              <label>
                <span>Site slug</span>
                <div className="slug-field">
                  <span>booom.dev/</span>
                  <input
                    onChange={(event) => {
                      setSlugTouched(true);
                      setSlug(makeSlug(event.target.value));
                    }}
                    placeholder="booom-engineering"
                    value={slug}
                  />
                </div>
              </label>

              <label>
                <span>Description</span>
                <textarea
                  onChange={(event) => setDescription(event.target.value)}
                  placeholder="Write concise product notes, devlogs, or release breakdowns."
                  rows={4}
                  value={description}
                />
              </label>

              <button className="primary-button" disabled={isSubmitting} type="submit">
                {isSubmitting ? "Creating site..." : "Create site"}
              </button>
            </form>
          )}
        </section>
      </div>
    </section>
  );
}

export default function App() {
  return (
    <main className="studio-page">
      <AuthLoading>
        <section className="loading-panel">
          <p className="eyebrow">Booting studio</p>
          <h1>Checking your session…</h1>
        </section>
      </AuthLoading>
      <Unauthenticated>
        <SignedOutView />
      </Unauthenticated>
      <Authenticated>
        <Workspace />
      </Authenticated>
    </main>
  );
}
