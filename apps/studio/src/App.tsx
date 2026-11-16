import { Authenticated, AuthLoading, Unauthenticated } from "convex/react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { LoadingPanel } from "./components/loading-panel";
import { HomePage } from "./components/home";
import { DashboardEditorRoute } from "./routes/dashboard-editor-route";
import { DashboardEmbedRoute } from "./routes/dashboard-embed-route";
import { DashboardIndexRoute } from "./routes/dashboard-index-route";
import { DashboardLayout } from "./routes/dashboard-layout";

function HomeRouteGate() {
  return (
    <>
      <AuthLoading>
        <LoadingPanel />
      </AuthLoading>
      <Unauthenticated>
        <HomePage />
      </Unauthenticated>
      <Authenticated>
        <Navigate replace to="/dashboard" />
      </Authenticated>
    </>
  );
}

function DashboardRouteGate() {
  return (
    <>
      <AuthLoading>
        <LoadingPanel />
      </AuthLoading>
      <Unauthenticated>
        <Navigate replace to="/" />
      </Unauthenticated>
      <Authenticated>
        <DashboardLayout />
      </Authenticated>
    </>
  );
}

export default function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<HomeRouteGate />} path="/" />
          <Route element={<DashboardRouteGate />} path="/dashboard">
            <Route element={<DashboardIndexRoute />} index />
            <Route element={<DashboardEmbedRoute />} path="embed" />
            <Route
              element={<DashboardEditorRoute mode="new" />}
              path="posts/new"
            />
            <Route
              element={<DashboardEditorRoute mode="edit" />}
              path="posts/:postId"
            />
          </Route>
          <Route element={<Navigate replace to="/" />} path="*" />
        </Routes>
      </BrowserRouter>
    </>
  );
}
