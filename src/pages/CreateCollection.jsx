import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { postJson } from "../api.js";
import { GENRES } from "../utils.js";

export default function CreateCollection() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: "", genre: "other", description: "" });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setErrors({});
    try {
      const created = await postJson("/collections/", form);
      navigate(`/collections/${created.id}`);
    } catch (error) {
      setErrors(error.details ?? { form: [error.error ?? "Не вдалося створити колекцію"] });
      setSubmitting(false);
    }
  };

  return (
    <section className="page form-page">
      <h1 className="page-title">Нова колекція</h1>
      <form className="form" onSubmit={handleSubmit}>
        <label className="field">
          Назва
          <input name="title" value={form.title} onChange={handleChange} maxLength={100} required />
          {errors.title && <span className="field-error">{errors.title[0]}</span>}
        </label>

        <label className="field">
          Жанр
          <select name="genre" value={form.genre} onChange={handleChange}>
            {GENRES.map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          {errors.genre && <span className="field-error">{errors.genre[0]}</span>}
        </label>

        <label className="field">
          Опис
          <textarea name="description" value={form.description} onChange={handleChange} rows={4} />
          {errors.description && <span className="field-error">{errors.description[0]}</span>}
        </label>

        {errors.form && <p className="field-error">{errors.form[0]}</p>}

        <button className="btn" type="submit" disabled={submitting}>
          {submitting ? "Створення..." : "Створити колекцію"}
        </button>
      </form>
    </section>
  );
}