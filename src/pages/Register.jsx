import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { useAuth } from "../hooks/useAuth.js";

const EMPTY = {
  username: "",
  email: "",
  first_name: "",
  last_name: "",
  password: "",
  password_confirmation: "",
};

export default function Register() {
  const { user, register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  if (user && !pending) return <Navigate to={from} replace />;

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      await register({
        ...values,
        username: values.username.trim(),
        email: values.email.trim(),
        first_name: values.first_name.trim(),
        last_name: values.last_name.trim(),
      });
      navigate(from, { replace: true });
    } catch (error) {
      setErrors(error.details ?? { form: [error.message] });
      setPending(false);
    }
  };

  const field = (name, label, props) => (
    <Field
      label={label}
      name={name}
      value={values[name]}
      onChange={handleChange}
      errors={errors[name]}
      {...props}
    />
  );

  return (
    <section className="page page-narrow">
      <title>Register · RankifyGames</title>
      <div className="sheet">
        <h1 className="sheet-title">Create an account</h1>
        <form className="form" onSubmit={handleSubmit} noValidate>
          {field("username", "Username", { autoComplete: "username", maxLength: 150, required: true })}
          {field("email", "Email", { type: "email", autoComplete: "email", maxLength: 128, required: true })}
          <div className="form-row">
            {field("first_name", "First name", { hint: "(optional)", autoComplete: "given-name", maxLength: 150 })}
            {field("last_name", "Last name", { hint: "(optional)", autoComplete: "family-name", maxLength: 150 })}
          </div>
          {field("password", "Password", {
            type: "password",
            hint: "(at least 8 characters)",
            autoComplete: "new-password",
            maxLength: 128,
            required: true,
          })}
          {field("password_confirmation", "Repeat password", {
            type: "password",
            autoComplete: "new-password",
            maxLength: 128,
            required: true,
          })}
          {errors.form && <p className="form-error">{errors.form[0]}</p>}
          <div className="form-actions">
            <button className="btn btn-gold" type="submit" disabled={pending}>
              {pending ? "Creating account…" : "Register"}
            </button>
          </div>
        </form>
        <p className="sheet-subtitle">
          Already registered? <Link to="/login" state={location.state}>Log in</Link>
        </p>
      </div>
    </section>
  );
}
