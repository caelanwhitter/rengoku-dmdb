import { Outlet, Link } from "react-router-dom";
import { Title, Modal, TextInput, Button } from "@mantine/core";
import { useState } from 'react';
import './App.css';

//This function is the main application component. It holds all the tabs that will be used for the application.
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
          variant="unstyled"
          size="lg"
          radius="md"
          required
        /> <br/>
        <Button color="dark" type="submit">Go!</Button>
      </Modal>

      <nav id="tabs">
        <div id="titleDiv">
          <Title className="title">DMDB</Title>
          <Title className="subtitle" order={5}>Dawson Movie Database</Title>
        </div>
        <Link className="tabLink" to="/featured">Featured</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>
        <Link className="tabLink" onClick={() => setOpened(true)} to={{}}>Search</Link>
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
