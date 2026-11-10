export default function Field({ label, name, value, onChange, errors, hint, ...inputProps }) {
  return (
    <label className="field">
      <span className="field-label">
        {label}
        {hint && <span className="field-hint"> {hint}</span>}
      </span>
      <input
        name={name}
        value={value}
        onChange={onChange}
        className={errors?.length ? "is-invalid" : undefined}
        {...inputProps}
      />
      {errors?.length > 0 && <span className="field-error">{errors[0]}</span>}
    </label>
  );
}
