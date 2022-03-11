import React, { Component } from "react";
import { Link } from "react-router-dom";
import { Title } from "@mantine/core";

export default class Navbar extends Component {
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
          <Link className="tabLink" to="/register">Register</Link>
          <Link className="tabLink" to="/login">Login</Link>
          <Link className="tabLink" to="/logout">Logout</Link>
        </nav>
        )
    }
}