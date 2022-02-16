import {Outlet, Link } from "react-router-dom";

export default function App() {
  return (
    <div>
      <h1 className="title"> Welcome to DMDB ! </h1>
      <nav style={{
          borderBottom: "solid 1px",
          paddingBottom: "1rem"
        }}>
        <Link to="/featured">Featured</Link>{" | "}
        <Link to="/movies">Movies</Link>{" | "}
        <Link to="/hiddenGems">Hidden Gems</Link>{" | "}
        <Link to="/profile">Profile</Link>{" | "}
      </nav>
      <Outlet/>
    </div>
  );
}
