import { useNavigate } from "react-router-dom";
import { collectionsApi } from "../api/endpoints.js";
import BackLink from "../components/BackLink.jsx";
import CollectionForm from "../components/CollectionForm.jsx";

export default function CreateCollection() {
  const navigate = useNavigate();

  const handleSubmit = async (values) => {
    const created = await collectionsApi.create(values);
    navigate(`/collections/${created.id}`);
  };

  return (
    <section className="page page-narrow">
      <BackLink to="/collections">All collections</BackLink>
      <div className="sheet">
        <h1 className="sheet-title">New collection</h1>
        <p className="sheet-subtitle">You can add games from Steam right after creating it.</p>
        <CollectionForm submitLabel="Create collection" pendingLabel="Creating…" onSubmit={handleSubmit} />
      </div>
    </section>
  );
}
