import { Outlet, Link } from "react-router-dom";
import { Title } from "@mantine/core";
import './App.css';

export default function App() {
  return (
    <div className="content-container">
      <nav id="tabs">
        <Title className="title">Welcome to DMDB!</Title>
        <Link className="tabLink" to="/featured">Featured</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>
        <Link className="tabLink" to="/register">Register</Link>
        <Link className="tabLink" to="/login">Login</Link>
        <Link className="tabLink" to="/logout">Logout</Link> {/* {" · "} */}
        {/* <Link className="tabLink" to="/profile">Profile</Link>{" · "}
        <Link className="tabLink" to="/admin">Admin</Link> */}
      </nav>
      <Outlet />
      
      <footer className="footer--pin">
        <p>{"Website Made By Miky and team"}</p>
      </footer>
    </div>
  );
}
