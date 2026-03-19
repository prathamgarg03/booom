import { SignInButton } from "@clerk/react";

export function StudioLanding() {
  return (
    <section className="auth-panel">
      <p className="eyebrow">Booom Studio</p>
      <h1>Sign in and publish.</h1>
      <p className="lede">
        Booom keeps the writing workflow private here. Your public blog and embed
        stay on the main app.
      </p>
      <div className="cta-row">
        <SignInButton mode="modal">
          <button className="primary-button">Sign in</button>
        </SignInButton>
      </div>
    </section>
  );
}
