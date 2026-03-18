"use client";

import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { api } from "../../../../convex/_generated/api";

function Viewer() {
  const viewer = useQuery(api.viewer.me);

  return <pre>{JSON.stringify(viewer, null, 2)}</pre>;
}

export default function Home() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Booom WWW</h1>

      <Unauthenticated>
        <SignInButton />
      </Unauthenticated>

      <Authenticated>
        <UserButton />
        <Viewer />
      </Authenticated>
    </main>
  );
}
