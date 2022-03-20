import React, { useEffect, useState } from 'react';
import {
    Grid, Text, Badge, Title, Modal, Group, Card,
    Image, Pagination, TextInput, Button
} from '@mantine/core';
import { NavLink, Link } from "react-router-dom";
import '../App.css';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { useWindowScroll } from '@mantine/hooks';

/**
 * Movies() is a component that fetches the list of Movies from the DB and displays it properly using pagination
 * @returns Table Of Movies + Pagination
 */
export default function Movies() {

    //Initializes variables and sets up "setters to variables"
    const DEFAULT_ACTIVE_PAGE = 1;
    const [oneMovieData, setOneMovieData] = useState([{}]);
    const [cards, setCards] = useState([]);
    const [activePage, setPage] = useState(DEFAULT_ACTIVE_PAGE);
    const [totalPagination, setTotalPagination] = useState();
    const [opened, setOpened] = useState(false);
    const [movies, setMovies] = useState([{}]);
    const [searchopened, setSearchOpened] = useState(false);
    const [value, setValue] = useState('');
    const [, scrollTo] = useWindowScroll();


    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        displayMoviesPerPage(activePage);

    }, []);

    async function getDetails(movieId) {
        await fetch("/api/oneMovie?id=" + movieId).then(
            response => response.json())
            .then(
                data => { setOneMovieData(data[0]) }
            )
    }

    /**
     * displayMoviesPerPage() fetches list of movies following pagination endpoints and calculates totalPagination on first render
     * @param {String} pageNumber 
     */
    async function displayMoviesPerPage(pageNumber) {
        let response = await fetch('/api/getSearch/page/' + pageNumber + '?title=' + value);
        let moviesPaginationJson = await response.json();
        setCards(getCards(moviesPaginationJson));

        // Calls calculateTotalPagination() if totalPagination not initialized yet yet
        if (totalPagination === undefined) {
            await calculateTotalPagination(moviesPaginationJson);
        }
    }

    /**
     * calculateTotalPagination() calculates how many pages should the entire list of movies be separated for pagination
     * @param {JSON} moviesPaginationJson 
     */
    async function calculateTotalPagination(moviesPaginationJson) {
        let response = await fetch('/api/getSearch?title=' + value);
        let allMoviesJson = await response.json();
        const totalMoviePages = Math.ceil(allMoviesJson.length / moviesPaginationJson.length);

        setTotalPagination(totalMoviePages);
    }

    async function clickOnGo(event) {
        setTotalPagination(undefined);
        displayMoviesPerPage(event);
        setSearchOpened(false);
    }

    /**
     * changePage() calls methods whenever detects a change of page on pagination
     * @param {*} event 
     */
    const changePage = (event) => {

        // Re-fetches the list of movies with proper page number
        displayMoviesPerPage(event);

        // Sets activePage to update styles of Pagination
        setPage(event);

        scrollTo({ y: 0 });
    }

    /**
     * getCards() returns an array of cards that displays all the movies of a certain page
     * @param {*} moviesJson 
     * @returns cards
     */
    function getCards(moviesJson) {

        let cards = moviesJson.map((movie) => {
            // Checks if movie description and poster are missing and checks if movie isn't an empty object
            if ((!movie.description || !movie.poster) && Object.keys(movie).length !== 0) {
                /*TO-DO: You cannot add multiple async calls here because map doesn't support async functions so anything returning a Promise won't work. 
                         Mitigated through calling one function that will run all the async functions instead*/
                updateMovieDetails(movie);
            }
            return (
                <Grid.Col span={3}>
                    <Card onClick={() => { getDetails(movie._id); setOpened(true) }} style={{ cursor: "pointer" }} shadow="md">
                        <Card.Section>
                            <Image src={movie.poster} height={320} alt={movie.title + " Poster"} withPlaceholder />
                        </Card.Section>

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
     * updateMovieDetails() takes a movie and calls all the async functions to retrive movie data API, save to Azure and save to DB
     * @param {*} movie 
     */
    async function updateMovieDetails(movie) {
        await fetchMovieDataFromApi(movie);
    }

    /**
     * fetchMovieDataFromApi() calls to backend route to return json of necessary movie data from API
     * @param {*} movie 
     */
    async function fetchMovieDataFromApi(movie) {
        try {
            let movieUrl = '/api/oneMovie/fetchMovieDataFromApi?title=' + movie.title + '&year=' + movie.releaseYear;
            let response = await fetch(movieUrl);
            if (response.ok) {
                let movieApiData = await response.json();
                await updateMovieDataToBlobStorage(movieApiData);
                await updateMovieDataToDB(movie, movieApiData)
            }
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * updateMovieDataToBlobStorage() takes movieData and makes a POST request to backend which uploads to Blob Storage
     * @param {*} movieData 
     */
    async function updateMovieDataToBlobStorage(movieData) {
        try {
            await fetch('/api/oneMovie/updateMovieDataToAzure', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: movieData.title,
                    year: movieData.year,
                    poster: movieData.poster,
                    description: movieData.description
                })
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    /**
     * updateMovieDataToDB() takes movie id and movieApiData and makes a POST request to backend which uploads to database
     * @param {*} movie 
     * @param {*} movieApiData 
     */
    async function updateMovieDataToDB(movie, movieApiData) {
        try {
            await fetch('/api/oneMovie/updateMovieDataToDB', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: movie._id,
                    title: movieApiData.title,
                    description: movieApiData.description,
                    year: movieApiData.year
                })
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <nav id="searchNav">
                <Link className="tabLink" onClick={() => setSearchOpened(true)} to={{}}> <MagnifyingGlassIcon /> Search</Link>
            </nav>

            <Modal
                opened={searchopened}
                onClose={() => setSearchOpened(false)}
                hideCloseButton
            >
                <TextInput
                    value={value}
                    onChange={(event) => setValue(event.currentTarget.value)}
                    placeholder="Search..."
                    variant="unstyled"
                    size="lg"
                    radius="md"
                    required
                /> <br />
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
                <div id="movieDetails">
                    <Image src={oneMovieData.poster} height={320} width={250} alt={oneMovieData.title + " Poster"} withPlaceholder />

                    <div id="movieText">
                        <Title order={4}>Director: {oneMovieData.director}</Title>
                        <Group position="left">
                            <Badge color="dark">{oneMovieData.genre}</Badge>
                            <Badge color="dark" variant="outline">{parseInt(oneMovieData.duration)} minutes</Badge>
                            <Badge color="gray" variant="outline">Rated {oneMovieData.rating}</Badge>
                            <Badge color="yellow" variant="dot">{oneMovieData.score} ⭐</Badge>

                        </Group>
                        <p>{oneMovieData.description}</p>

                        <Title order={6}>Gross: {oneMovieData.gross}</Title>
                        <Badge variant="gradient" gradient={{ from: 'teal', to: 'lime', deg: 105 }}><NavLink style={{ textDecoration: 'none', color: 'black' }} to={`${oneMovieData._id}/reviews`}>View Reviews</NavLink></Badge>
                    </div>
                </div>
            </Modal>

            <Grid className="movieGrid" gutter={80}>
                {cards}
            </Grid>

            <div id="pagination">
                <Pagination page={activePage} onChange={changePage} total={totalPagination} color="dark" sibilings={1} withEdges />
            </div>
        </>
    );
}