import { Title } from "@mantine/core";
import React from "react";
import { Link } from "react-router-dom";

export default class Navbar extends React.Component {
  render() {
    return (
      <nav className="tabs">
        <div id="titleDiv">
          <a href="/"><Title className="title">DMDB</Title>
            <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
        </div>

        <Link className="tabLink" to="/">Home</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>{" | "}
        <Link className="tabLink" to="/profile">Profile</Link>
      </nav>
    )
  }
}