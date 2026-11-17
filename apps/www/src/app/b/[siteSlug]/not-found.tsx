"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BlogFooter } from "@/components/blog-footer";

export default function BlogNotFound() {
  const pathname = usePathname() ?? "";
  const [, , siteSlug, postSlug] = pathname.split("/");
  const isPost = Boolean(postSlug);

  return (
    <main className="mx-auto w-full max-w-[46rem] px-5 pt-20 pb-12 sm:px-8 sm:pt-32">
      <p className="text-sm text-ink-muted">404</p>
      <h1 className="mt-3 font-reading text-[2.5rem] leading-[1.1] font-medium tracking-[-0.015em] text-balance sm:text-5xl">
        {isPost ? "This post isn’t here" : "There’s no blog at this address"}
      </h1>
      <p className="mt-5 max-w-[34rem] font-reading text-xl leading-relaxed text-ink-soft">
        {isPost
          ? "It may have been unpublished, renamed, or the link has a typo."
          : "Check the spelling of the address. Blog addresses use lowercase letters, numbers and hyphens."}
      </p>
      <div className="mt-10 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium">
        {isPost && siteSlug ? (
          <Link className="text-link underline decoration-link/40 underline-offset-4 hover:decoration-link" href={`/b/${siteSlug}`}>
            See all posts on this blog
          </Link>
        ) : null}
        <Link className="text-ink-muted transition-colors hover:text-ink" href="/">
          Go to booom.dev
        </Link>
      </div>
      <BlogFooter />
    </main>
  );
}
