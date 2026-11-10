import { Outlet } from "react-router-dom";
import { useAuth } from "../hooks/useAuth.js";
import Header from "./Header.jsx";
import Footer from "./Footer.jsx";

export default function Layout() {
  const { user } = useAuth();
  return (
    <div className="app">
      <Header />
      <main className="main">
        <Outlet key={user?.id ?? "guest"} />
      </main>
      <Footer />
    </div>
  );
}
