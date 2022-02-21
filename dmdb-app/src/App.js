import { Outlet, Link } from "react-router-dom";
import {GoogleLogin,GoogleLogout} from "react-google-login"
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
      {/* <GoogleLogin
        clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID}
        buttonText="Log in with Google"
        onSuccess={handleLogin}
        onFailure={handleLogin}
        cookiePolicy={'single_host_origin'}
      /> */}

      <footer className="footer--pin">
        <p>{"Website Made By Miky and team"}</p>
      </footer>
    </div>
  );
}
