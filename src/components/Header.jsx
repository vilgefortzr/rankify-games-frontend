import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header>
      <nav>
        <Link to='/' className="logo">
          Rankify<span>Games</span>
        </Link>
        <ul className="menu">
          <li><Link to="/collections">Колекції</Link></li>
          <li><a>Ігри</a></li>
          {/* <li><a>Профіль</a></li> */}
        </ul>
        <div className="auth">
          <a>Увійти</a>
          <Link className="btn" to="/collections/new">Створити колекцію</Link>
        </div>
      </nav>
    </header>
  );
}