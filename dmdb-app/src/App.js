import { Outlet, Link } from "react-router-dom";
import { Title, Modal, Text, TextInput, Button, Affix, Divider, Transition, Space } from "@mantine/core";
import Movies from './routes/Movies'
import fetchMoviesPerPage from './routes/Movies';
import { MagnifyingGlassIcon, ArrowUpIcon } from "@radix-ui/react-icons";
import { useWindowScroll } from '@mantine/hooks';
import './App.css';

//This function is the main application component. It holds all the tabs that will be used for the application.
export default function App() {
  const [scroll, scrollTo] = useWindowScroll();

  return (
    <div className="content-container">
      <nav id="tabs">
        <div id="titleDiv">
          <a href="/home"><Title className="title">DMDB</Title>
          <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
        </div>
        <Link className="tabLink" to="/home">Home</Link>
        <Link className="tabLink" to="/movies">Movies</Link>
        <Link className="tabLink" to="/hiddenGems">Hidden Gems</Link>{" | "}
        <Link className="tabLink" to="/register">Register</Link>
        <Link className="tabLink" to="/login">Login</Link>
        <Link className="tabLink" to="/logout">Logout</Link>
      </nav>
      <Outlet />

      <footer>
        <div className="footSection">
          <div id="brandIcon">
            <a href="/home"><Title className="title">DMDB</Title>
            <Title className="subtitle" order={5}>Dawson Movie Database</Title></a>
          </div>
          <Space h="sm"/>
          <Text color="gray">Browse thousands of popular movies and their details<Space/> or submit your own Hidden Gem</Text>

          <Space h="md"/>
          <Divider label="Built by" labelPosition="center"/>
          <Text color="gray" id="footContent">{"© Dawson Movie Solutions 2022"}</Text>
        </div>

        <div className="footSection">
          <Title order={4}>About the project</Title>
          <Text color="gray">About Us</Text>
        </div> 

        <div className="footSection">
          <Title order={4}>Feedback</Title>
          <Text color="gray">Report a bug</Text>
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
