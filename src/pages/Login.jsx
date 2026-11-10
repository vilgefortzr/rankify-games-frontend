import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Field from "../components/Field.jsx";
import { useAuth } from "../hooks/useAuth.js";

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from ?? "/";
  const [values, setValues] = useState({ username: "", password: "" });
  const [errors, setErrors] = useState({});
  const [pending, setPending] = useState(false);

  if (user && !pending) return <Navigate to={from} replace />;

  const handleChange = (e) => setValues((v) => ({ ...v, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setPending(true);
    setErrors({});
    try {
      await login({ username: values.username.trim(), password: values.password });
      navigate(from, { replace: true });
    } catch (error) {
      setErrors(error.details ?? { form: [error.message] });
      setPending(false);
    }
  };

  return (
    <section className="page page-narrow">
      <title>Log in · RankifyGames</title>
      <div className="sheet">
        <h1 className="sheet-title">Log in</h1>
        <form className="form" onSubmit={handleSubmit} noValidate>
          <Field
            label="Username"
            name="username"
            value={values.username}
            onChange={handleChange}
            errors={errors.username}
            autoComplete="username"
            required
          />
          <Field
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            errors={errors.password}
            autoComplete="current-password"
            required
          />
          {errors.form && <p className="form-error">{errors.form[0]}</p>}
          <div className="form-actions">
            <button className="btn btn-gold" type="submit" disabled={pending}>
              {pending ? "Logging in…" : "Log in"}
            </button>
          </div>
        </form>
        <p className="sheet-subtitle">
          No account? <Link to="/register" state={location.state}>Register</Link>
        </p>
      </div>
    </section>
  );
}
