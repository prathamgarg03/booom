import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { SignInButton, UserButton } from "@clerk/react";
import { api } from "../../../convex/_generated/api";
import "./App.css";

function Viewer() {
  const viewer = useQuery(api.viewer.me);

  return <pre>{JSON.stringify(viewer, null, 2)}</pre>;
}

export default function App() {
  return (
    <main style={{ padding: 32 }}>
      <h1>Booom Studio</h1>

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
