import { Outlet, Link } from "react-router-dom";
import { useState, useEffect } from 'react';
import Movies from './routes/Movies'
import fetchMoviesPerPage from './routes/Movies'
import { Title, Modal, TextInput, Button, Image, Affix, Transition } from "@mantine/core";
import { MagnifyingGlassIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { useWindowScroll } from '@mantine/hooks';
import './App.css';

//This function is the main application component. It holds all the tabs that will be used for the application.
export default function App() {
  const [opened, setOpened] = useState(false);
  const [scroll, scrollTo] = useWindowScroll();

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
        <div class="footSection">
          <Image src="https://i.imgur.com/t9yVLZn.png"></Image>
          <p id="footContent">{"© Dawson Movie Solutions 2022, Apache License 2.0"}</p>
        </div>

        <div class="footSection">

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
              >
                Back to top
              </Button>
            )}
        </Transition>
      </Affix>
    </div>
  );
}
