/* eslint-disable max-len */
import {
  Badge, Button, Card, Grid, Group, Image, LoadingOverlay,
  Modal, NativeSelect, Pagination, Space, Text, TextInput, Title
} from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useEffect, useState } from 'react';
import { Link, NavLink } from "react-router-dom";
import '../App.css';

/**
 * Movies() is a component that fetches the list of Movies from the DB 
 * and displays it properly using pagination
 * @returns Table Of Movies + Pagination
 */
export default function Movies() {
  //Initializes variables and sets up "setters to variables"
  const DEFAULT_ACTIVE_PAGE = 1;
  const [oneMovieData, setOneMovieData] = useState([{}]);
  const [cards, setCards] = useState([]);
  const [activePage, setPage] = useState(DEFAULT_ACTIVE_PAGE);
  const [totalPagination, setTotalPagination] = useState(null);
  const [opened, setOpened] = useState(false);
  const [searchopened, setSearchOpened] = useState(false);
  const [valueTitle, setValueTitle] = useState('');
  const [valueDirector, setValueDirector] = useState('');
  const [valueGenre, setValueGenre] = useState('');
  const [valueReleaseYear, setValueReleaseYear] = useState('');
  const [valueScore, setValueScore] = useState('');
  const [valueRating, setValueRating] = useState('');
  const [, scrollTo] = useWindowScroll();
  const [loading, setLoading] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);
  let moviesPaginationJson = [];

  /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
  useEffect(() => {
    displayAndReturnMoviesPerPage(activePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function getDetails(movieId) {
    await fetch("/api/oneMovie?id=" + movieId).then(
      response => response.json()).
      then(
        data => {
          setOneMovieData(data[0])
        }
      )
    setModalLoading(v => !v);
  }

  /**
   * displayAndReturnMoviesPerPage() fetches list of movies following pagination endpoints
   * and calculates totalPagination on first render.
   * Returns the JSON of movies if needed
   * @param {*} pageNumber 
   * @returns 
   */
  async function displayAndReturnMoviesPerPage(pageNumber) {

    // Loads movies from specific page number from backend and sets the cards for them
    setLoading((v) => !v);
    let response = await fetch('/api/getSearch/page/' + pageNumber + '?title='
      + valueTitle + '&director=' + valueDirector + '&genre=' + valueGenre
      + '&releaseYear=' + valueReleaseYear + '&score=' + valueScore + '&rating=' + valueRating);
    moviesPaginationJson = await response.json();
    setCards(await getCards(moviesPaginationJson));
    setLoading((v) => !v);

    // Calls calculateTotalPagination() if totalPagination not initialized yet yet
    if (!totalPagination) {
      await calculateTotalPagination(moviesPaginationJson);
    }

    // Once movies are loaded, loop through movies and upload any movies who are missing poster and description to DB and Azure
    await uploadMovies(moviesPaginationJson);

    return moviesPaginationJson;
  }

  /**
     * calculateTotalPagination() calculates in how many pages should 
     * the entire list of movies be separated for pagination
     * @param {JSON} moviesPaginationJson 
     */
  async function calculateTotalPagination(moviesPaginationJson) {
    let currentMoviesLength = moviesPaginationJson.length;

    // Check if currentMoviesLength is 0, meaning that there are no movies in search and pagination should be set to 1.
    if (currentMoviesLength !== 0) {
      let response = await fetch('/api/getSearch?title=' + valueTitle + '&director='
        + valueDirector + '&genre=' + valueGenre + '&releaseYear='
        + valueReleaseYear + '&score=' + valueScore + '&rating=' + valueRating);
      let allMoviesJson = await response.json();
      const totalMoviePages = Math.ceil(allMoviesJson.length / currentMoviesLength);

      setTotalPagination(totalMoviePages);
    } else {
      setTotalPagination(1);
    }
  }

  async function clickOnGo(event) {
    setSearchOpened(false);
    let newMoviesPaginationJson = await displayAndReturnMoviesPerPage(event);
    calculateTotalPagination(newMoviesPaginationJson);
    setPage(DEFAULT_ACTIVE_PAGE);
  }

  /**
     * changePage() calls methods whenever detects a change of page on pagination
     * @param {*} event 
     */
  const changePage = (event) => {
    // Re-fetches the list of movies with proper page number
    displayAndReturnMoviesPerPage(event);

    // Sets activePage to update styles of Pagination
    setPage(event);

    scrollTo({ y: 0 });
  }

  /**
   * Handles the event when Enter is pressed
   * @param {Event} e Key press event
   */
  const handleSubmit = e => {
    // Key Code 13 is the Enter or Return key in most keyboards
    if (e.keyCode === 13) {
      clickOnGo(e)
    }
  }

  /**
   * getCards() returns an array of cards that displays all the movies of a certain page
   * @param {*} moviesJson 
   * @returns 
   */
  async function getCards(moviesJson) {
    let cards = moviesJson.map((movie) => {
      return (
        <Grid.Col key={movie._id} span={3}>
          <Card onClick={() => {
            getDetails(movie._id); setModalLoading(v => !v); setOpened(true);
          }} style={{ cursor: "pointer" }} shadow="md" withBorder={true}>
            <Card.Section>
              <Image src={movie.poster} height={movie.poster ? "100%" : 375}
                width={movie.poster ? "100%" : 375} alt={movie.title + " Poster"} withPlaceholder />
            </Card.Section>

            <Space h="sm" />
            <Text weight={600}>{movie.title}</Text>
            <Group position="apart">
              <Text size="sm">{movie.director}</Text>
              <Badge color="dark">{movie.releaseYear}</Badge>
            </Group>
          </Card>
        </Grid.Col>
      );
    });
    return cards;
  }

  /**
   * uploadMovies() takes a movie array and makes a POST request to /api/uploadMovies
   * to save the movies onto the Blob storage and MongoDB database
   * @param {*} movies 
   */
  async function uploadMovies(movies) {
    try {
      await fetch('/api/uploadMovies', {
        method: "POST",
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          movies: movies
        })
      });
    } catch (e) {
      console.error(e);
    }
  }

  return (
    <>
      <nav id="searchNav">
        <Link className="tabLink"
          onClick={() => setSearchOpened(true)} to={{}}> <MagnifyingGlassIcon /> Search</Link>
      </nav>

      <Modal
        opened={searchopened}
        onKeyUp={searchopened ? handleSubmit : null}
        onClose={() => setSearchOpened(false)}
        hideCloseButton
      >
        <TextInput
          label="Title"
          value={valueTitle}
          onChange={(event) => setValueTitle(event.currentTarget.value)}
          placeholder="Enter the title"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Director"
          value={valueDirector}
          onChange={(event) => setValueDirector(event.currentTarget.value)}
          placeholder="Enter the Director"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Genre"
          value={valueGenre}
          onChange={(event) => setValueGenre(event.currentTarget.value)}
          placeholder="Enter the Genre"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <TextInput
          label="Release Year "
          value={valueReleaseYear}
          onChange={(event) => setValueReleaseYear(event.currentTarget.value)}
          placeholder="Enter the Release Year"
          //variant="unstyled"
          size="md"
          radius="md"
          required
        />
        <TextInput
          label="Score"
          value={valueScore}
          onChange={(event) => setValueScore(event.currentTarget.value)}
          placeholder="Enter the Score "
          // variant="unstyled"
          size="md"
          radius="md"
          required
        />

        <NativeSelect
          label="Rating"
          value={valueRating}
          data={['R', 'PG', 'PG-13']}
          onChange={(event) => setValueRating(event.currentTarget.value)}
          placeholder="Select a Rating"
        />
        <br />
        <Button
          onClick={clickOnGo}
          color="dark"
          type="submit">
          Go!
        </Button>
      </Modal>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={<Title>{oneMovieData.title}</Title>}
        size="xl"
        overflow="inside"
        centered
      >
        <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
          visible={modalLoading} />
        <div id="movieDetails">
          <Image src={oneMovieData.poster} height={380} width={250}
            alt={oneMovieData.title + " Poster"} withPlaceholder />

          <div id="movieText">
            <Title order={4}>Director: {oneMovieData.director}</Title>
            <Group position="left">
              <Badge color="dark">{oneMovieData.genre}</Badge>
              <Badge color="dark"
                variant="outline">{parseInt(oneMovieData.duration)} minutes</Badge>
              <Badge color="gray" variant="outline">Rated {oneMovieData.rating}</Badge>
              <Badge color="yellow" variant="dot">{oneMovieData.score} ⭐</Badge>

            </Group>
            <p>{oneMovieData.description}</p>

            <Title order={6}>Gross: {oneMovieData.gross}</Title>
            <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}>
              <NavLink style={{ textDecoration: 'none', color: 'black' }}
                to={`${oneMovieData._id}/reviews`}>View Reviews</NavLink>
            </Badge>
          </div>
        </div>
      </Modal>

      <LoadingOverlay loaderProps={{ color: 'dark', variant: 'dots' }}
        visible={loading} />

      {!loading && cards.length === 0 ?
        <div>
          <Text sx={(theme) => ({ paddingTop: "20px", fontSize: "200%" })}
            weight={700} align="center">No movies found for this search!</Text>
        </div>
        :
        <div>
          <Grid className="movieGrid" gutter={80}>
            {cards}
          </Grid>

          <div id="pagination">
            <Pagination page={activePage} onChange={changePage}
              total={totalPagination} color="dark" siblings={2} withEdges />
          </div>
        </div>
      }
    </>
  );
}