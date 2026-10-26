export default function Header() {
  return (
    <header>
      <nav>
        <a className="logo">
          Rankify<span>Games</span>
        </a>
        <ul className="menu">
          <li><a>Колекції</a></li>
          <li><a>Ігри</a></li>
          <li><a>Профіль</a></li>
        </ul>
        <div className="auth">
          <a>Увійти</a>
          <a className="btn">Створити колекцію</a>
        </div>
      </nav>
    </header>
  );
}