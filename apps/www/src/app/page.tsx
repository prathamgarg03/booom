"use client";

import {
  ClerkLoaded,
  ClerkLoading,
  SignInButton,
  SignUpButton,
  UserButton,
  useAuth,
} from "@clerk/nextjs";

function AuthActions() {
  const { userId } = useAuth();

  if (userId) {
    return (
      <>
        <a
          className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5"
          href="http://localhost:5173"
        >
          Open local studio
        </a>
        <a
          className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5"
          href="/embed-demo"
        >
          Open embed demo
        </a>
      </>
    );
  }

  return (
    <>
      <SignUpButton mode="modal">
        <button className="rounded-full bg-stone-950 px-5 py-3 text-sm font-medium text-stone-50 transition hover:-translate-y-0.5">
          Create your account
        </button>
      </SignUpButton>
      <SignInButton mode="modal">
        <button className="rounded-full border border-black/10 bg-white/70 px-5 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5">
          Sign in
        </button>
      </SignInButton>
      <a
        className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5"
        href="http://localhost:5173"
      >
        Explore the studio shell
      </a>
      <a
        className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-stone-900 transition hover:-translate-y-0.5"
        href="/embed-demo"
      >
        Open embed demo
      </a>
    </>
  );
}

function HeaderIdentity() {
  const { userId } = useAuth();

  if (!userId) {
    return null;
  }

  return (
    <div className="rounded-full border border-black/10 bg-white/70 p-2">
      <UserButton />
    </div>
  );
}

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-6 py-10 text-stone-900 sm:px-10">
      <section className="relative overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,rgba(255,248,238,0.96),rgba(248,238,223,0.92))] p-8 shadow-[0_24px_80px_rgba(55,39,27,0.12)] sm:p-12">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,138,76,0.2),transparent_28%),radial-gradient(circle_at_80%_18%,rgba(15,118,110,0.15),transparent_24%)]" />
        <div className="relative flex flex-col gap-10">
          <div className="flex items-start justify-between gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                Booom
              </p>
              <h1 className="mt-4 max-w-4xl text-5xl font-medium tracking-[-0.06em] text-stone-950 sm:text-7xl">
                A dev-first blog engine built for paste-once distribution.
              </h1>
            </div>
            <ClerkLoaded>
              <HeaderIdentity />
            </ClerkLoaded>
          </div>

          <p className="max-w-2xl text-lg leading-8 text-stone-600">
            Write in Booom, publish from Booom, and embed the output into any site
            with a single script. The MVP now includes the studio, hosted blog pages,
            and a live embed demo route for testing the widget against real content.
          </p>

          <div className="flex flex-wrap gap-4">
            <ClerkLoading>
              <div className="rounded-full border border-black/10 bg-white/60 px-5 py-3 text-sm font-medium text-stone-500">
                Loading session...
              </div>
            </ClerkLoading>
            <ClerkLoaded>
              <AuthActions />
            </ClerkLoaded>
          </div>

          <div className="grid gap-4 md:grid-cols-3">
            {[
              [
                "Own the writing surface",
                "Your blog workflow stays centralized instead of leaking CMS logic into every app.",
              ],
              [
                "Ship the embed later",
                "The first slice creates the site slug and data model the one-line script will read from.",
              ],
              [
                "Keep it portable",
                "Convex powers the MVP, but the public blog surface stays cleanly separable for future OSS/self-hosting moves.",
              ],
            ].map(([title, copy]) => (
              <article
                className="rounded-[1.5rem] border border-black/8 bg-white/70 p-5"
                key={title}
              >
                <p className="text-xs uppercase tracking-[0.28em] text-orange-700">
                  checkpoint
                </p>
                <h2 className="mt-3 text-2xl font-medium tracking-[-0.04em] text-stone-950">
                  {title}
                </h2>
                <p className="mt-3 text-sm leading-7 text-stone-600">{copy}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
