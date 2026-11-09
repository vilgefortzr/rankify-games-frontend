import { Route, Routes } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Home from "./pages/Home.jsx";
import Collections from "./pages/Collections.jsx";
import CollectionDetail from "./pages/CollectionDetail.jsx";
import CreateCollection from "./pages/CreateCollection.jsx";
import Games from "./pages/Games.jsx";
import GameDetail from "./pages/GameDetail.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="collections" element={<Collections />} />
        <Route path="collections/new" element={<CreateCollection />} />
        <Route path="collections/:id" element={<CollectionDetail />} />
        <Route path="games" element={<Games />} />
        <Route path="games/:steamId" element={<GameDetail />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
}
