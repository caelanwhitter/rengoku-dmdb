import { Outlet, Link } from "react-router-dom";
import { Title, Modal, TextInput, Button } from "@mantine/core";
import { useState, useEffect } from 'react';
import Movies from './routes/Movies'
import fetchMoviesPerPage from './routes/Movies'
import './App.css';

//This function is the main application component. It holds all the tabs that will be used for the application.
export default function App() {
  return (
    <div className="content-container">

      <nav id="tabs">
        <div id="titleDiv">
          <Title className="title">DMDB</Title>
          <Title className="subtitle" order={5}>Dawson Movie Database</Title>
        </div>
        <Link className="tabLink" to="/featured">Featured</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>{" | "}
        <Link className="tabLink" to="/register">Register</Link>
        <Link className="tabLink" to="/login">Login</Link>
        <Link className="tabLink" to="/logout">Logout</Link>
      </nav>
      <Outlet />

      <footer>
        <p id="footContent">{"© Dawson Movie Solutions 2022, Apache License 2.0"}</p>
      </footer>
    </div>
  );
}
