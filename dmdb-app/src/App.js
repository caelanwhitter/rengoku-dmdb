import { Outlet, Link } from "react-router-dom";
import { Title, Modal, TextInput, Button } from "@mantine/core";
import { useState } from 'react';
import './App.css';

export default function App() {
  const [opened, setOpened] = useState(false);

  return (
    <div className="content-container">
      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        hideCloseButton
      >
        <TextInput
          placeholder="Search..."
          required
        />
      </Modal>

      <nav id="tabs">
        <div id="titleDiv">
          <Title className="title">DMDB</Title>
          <Title className="subtitle" order={5}>Dawson Movie Database</Title>
        </div>
        <Link className="tabLink" to="/featured">Featured</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>
        <Button onClick={() => setOpened(true)} variant="subtle" color="dark" uppercase>Search</Button>
        <Link className="tabLink" to="/register">Register</Link>
        <Link className="tabLink" to="/login">Login</Link>
        <Link className="tabLink" to="/logout">Logout</Link> {/* {" · "} */}
        {/* <Link className="tabLink" to="/profile">Profile</Link>{" · "}
        <Link className="tabLink" to="/admin">Admin</Link> */}
      </nav>
      <Outlet />
      
      <footer>
        <p id="footContent">{"© Dawson Movie Solutions 2022, Apache License 2.0"}</p>
      </footer>
    </div>
  );
}
