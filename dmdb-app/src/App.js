import { Outlet, Link } from "react-router-dom";
import { Title, Modal, Text, TextInput, Button, Affix, Transition } from "@mantine/core";
import { MagnifyingGlassIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { useWindowScroll } from '@mantine/hooks';
import { useState } from 'react';
import './App.css';

//This function is the main application component. It holds all the tabs that will be used for the application.
export default function App() {
  const [opened, setOpened] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <div>
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
          <a href="/home"><Title className="title">DMDB</Title>
          <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
        </div>
        <Link className="tabLink" to="/home">Home</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>
        <Link className="tabLink" onClick={() => setOpened(true)} to={{}}> <MagnifyingGlassIcon/> Search</Link>{" | "}
        <Link className="tabLink" to="/register">Register</Link>
        <Link className="tabLink" to="/login">Login</Link>
        <Link className="tabLink" to="/logout">Logout</Link> {/* {" · "} */}
        {/* <Link className="tabLink" to="/profile">Profile</Link>{" · "}
        <Link className="tabLink" to="/admin">Admin</Link> */}
      </nav>
      <Outlet />
      
      <footer>
        <div className="footSection">
          <div id="brandIcon">
            <a href="/home"><Title className="title">DMDB</Title>
            <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
          </div>
          <p id="footContent">{"© Dawson Movie Solutions 2022, Apache License 2.0"}</p>
        </div>

        <div className="footSection">
          <Title order={4}>About the project</Title>
          <Text color="dark">Hello World!</Text>
        </div> 

        <div className="footSection">
          <Title order={4}>Feedback</Title>
          <Text color="dark">Report a bug</Text>
        </div>

      </footer>

      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition="slide-up" mounted={scroll.y > 0}>
            {(transitionStyles) => (
              <Button
                leftIcon={<ArrowUpIcon />}
                style={transitionStyles}
                onClick={() => scrollTo({ y: 0 })}
                color="dark"
                uppercase
              >
                Back to top
              </Button>
            )}
        </Transition>
      </Affix>
    </div>
  );
}
