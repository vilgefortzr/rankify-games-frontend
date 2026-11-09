import { useState } from "react";
import { GENRES } from "../lib/genres.js";

const EMPTY = { title: "", genre: "other", description: "" };

function FieldError({ errors }) {
  if (!errors?.length) return null;
  return <span className="field-error">{errors[0]}</span>;
}

export default function CollectionForm({ initial = EMPTY, submitLabel, pendingLabel, onSubmit, onCancel }) {
  const [values, setValues] = useState({ ...EMPTY, ...initial });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      await onSubmit({ ...values, title: values.title.trim() });
    } catch (error) {
      setErrors(error.details ?? { form: [error.message] });
      setPending(false);
    }
  };

  return (
    <form className="form" onSubmit={handleSubmit} noValidate>
      <label className="field">
        <span className="field-label">Title</span>
        <input
          name="title"
          className={errors.title ? "is-invalid" : undefined}
          value={values.title}
          onChange={handleChange}
          maxLength={100}
          required
          placeholder="For example, The Witcher Trilogy"
        />
        <FieldError errors={errors.title} />
      </label>

      <label className="field">
        <span className="field-label">Genre</span>
        <select
          name="genre"
          value={values.genre}
          onChange={handleChange}
          className={errors.genre ? "is-invalid" : undefined}
        >
          {GENRES.map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <FieldError errors={errors.genre} />
      </label>

      <label className="field">
        <span className="field-label">Description</span>
        <textarea
          name="description"
          value={values.description}
          onChange={handleChange}
          rows={4}
          placeholder="What is this collection about? (optional)"
        />
        <FieldError errors={errors.description} />
      </label>

      {(errors.form || errors.non_field_errors) && (
        <p className="form-error">
          {(errors.form ?? errors.non_field_errors)[0]}
        </p>
      )}

      <div className="form-actions">
        <button className="btn btn-gold" type="submit" disabled={pending}>
          {pending ? pendingLabel : submitLabel}
        </button>
        {onCancel && (
          <button className="btn btn-ghost" type="button" onClick={onCancel} disabled={pending}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
