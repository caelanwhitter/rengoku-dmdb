import { Outlet, Link } from "react-router-dom";
import './App.css';
export default function App() {
  return (
    <div className="content-container">
      <h1 className="title"> Welcome to DMDB ! </h1>
      <nav className="tabs" style={{
        borderBottom: "solid 1px",
        paddingBottom: "1rem"
      }}>
        <Link className="featuredTab" to="/featured">Featured</Link>{" | "}
        <Link className="moviesTab" to="/movies">hi</Link>{" | "}
        <Link className="hiddenGemsTab" to="/hiddenGems">Hidden Gems</Link>{" | "}
        <Link className="profileTab" to="/register">Register</Link>{" | "}
        <Link className="profileTab" to="/login">Login</Link>{" | "}
        <Link className="profileTab" to="/logout">Logout</Link>{" | "}
        <Link className="profileTab" to="/profile">Profile</Link>{" | "}
        <Link className="profileTab" to="/admin">Admin</Link>{" | "}
      </nav>
      <Outlet />
      <footer className="footer--pin">
        <div></div>
        <p>{"Website Made By Miky and team"}</p>
        <ul>
          <li></li>
          <li></li>
          <li></li>
        </ul>
      </footer>
    </div>
  );
}
