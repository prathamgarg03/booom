import { useState } from "react";
import { makeSlug } from "../lib/studio";

type SiteSetupPanelProps = {
  isProvisioning: boolean;
  isCreatingSite: boolean;
  onCreateSite: (args: {
    name: string;
    slug: string;
    description?: string;
  }) => Promise<boolean>;
};

export function SiteSetupPanel({
  isProvisioning,
  isCreatingSite,
  onCreateSite,
}: SiteSetupPanelProps) {
  const [siteName, setSiteName] = useState("");
  const [siteSlug, setSiteSlug] = useState("");
  const [siteDescription, setSiteDescription] = useState("");
  const [siteSlugTouched, setSiteSlugTouched] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const created = await onCreateSite({
      name: siteName,
      slug: siteSlug,
      description: siteDescription || undefined,
    });

    if (!created) {
      return;
    }

    setSiteName("");
    setSiteSlug("");
    setSiteDescription("");
    setSiteSlugTouched(false);
  }

  return (
    <div className="workspace-grid">
      <section className="panel intro-panel">
        <p className="panel-kicker">Foundation</p>
        <h2>Create the home for your posts.</h2>
        <p>
          The MVP starts with one site per account. Later this can expand into
          multiple sites, teams, and settings without rewriting the dashboard
          routes.
        </p>
      </section>

      <section className="panel form-panel">
        <p className="panel-kicker">Site setup</p>
        <h2>Create your first site.</h2>

        {isProvisioning ? (
          <p className="muted-copy">Provisioning your Booom profile...</p>
        ) : (
          <form className="site-form" onSubmit={handleSubmit}>
            <label>
              <span>Site name</span>
              <input
                onChange={(event) => {
                  const nextName = event.target.value;
                  setSiteName(nextName);

                  if (!siteSlugTouched) {
                    setSiteSlug(makeSlug(nextName));
                  }
                }}
                placeholder="Booom Engineering"
                value={siteName}
              />
            </label>

            <label>
              <span>Site slug</span>
              <div className="slug-field">
                <span>booom.dev/</span>
                <input
                  onChange={(event) => {
                    setSiteSlugTouched(true);
                    setSiteSlug(makeSlug(event.target.value));
                  }}
                  placeholder="booom-engineering"
                  value={siteSlug}
                />
              </div>
            </label>

            <label>
              <span>Description</span>
              <textarea
                onChange={(event) => setSiteDescription(event.target.value)}
                placeholder="Write concise product notes, devlogs, or release breakdowns."
                rows={4}
                value={siteDescription}
              />
            </label>

            <button className="primary-button" disabled={isCreatingSite} type="submit">
              {isCreatingSite ? "Creating site..." : "Create site"}
            </button>
          </form>
        )}
      </section>
    </div>
  );
}
