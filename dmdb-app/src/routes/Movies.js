import {
    Grid, Text, Badge, Title, Modal,
    Group, Card, Image, Pagination, JsonInput
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
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
    const [, scrollTo] = useWindowScroll();

    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        displayMoviesPerPage(activePage);

    }, []);

    function getDetails(movieId) {
        fetch("/api/oneMovie?id=" + movieId).then(
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
        let response = await fetch('/api/allMovies/page/' + pageNumber);
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
        let response = await fetch('/api/allMovies');
        let allMoviesJson = await response.json();
        const totalMoviePages = Math.ceil(allMoviesJson.length / moviesPaginationJson.length);

        setTotalPagination(totalMoviePages);
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
     * rows returns a table body of the appropriate list of movies
     */
    // const cards = movies.map((movie) => (
    //     <Grid.Col span={3}>
    //         <Card onClick={() => { getDetails(movie._id); setOpened(true) }} style={{ cursor: "pointer" }} shadow="md">
    //             <Card.Section>
    //                 <Image src={null} height={320} alt={movie.title + " Poster"} withPlaceholder />
    //             </Card.Section>

    //             <Text weight={600}>{movie.title}</Text>

    //             <Group position="apart">
    //                 <Text size="sm">{movie.director}</Text>
    //                 <Badge color="dark">{movie.releaseYear}</Badge>
    //             </Group>
    //         </Card>
    //     </Grid.Col>
    // ));

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
        console.log(cards);
        return cards;
    }

    async function updateMovieDetails(movie) {
        await fetchMovieDataFromApi(movie);
    }

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

    async function updateMovieDataToDB(movie, movieApiData) {
        try {
            await fetch('/api/oneMovie/updateMovieDataToDB', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    id: movie._id,
                    title: movie.title,
                    description: movieApiData.description,
                    year: movie.releaseYear
                })
            });
        }
        catch (e) {
            console.log(e);
        }
    }

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title={<Title>{oneMovieData.title}</Title>}
                size="xl"
                overflow="inside"
                centered
            >
                <div id="movieDetails">
                    <Image src={oneMovieData.poster} height={320} alt={oneMovieData.title + " Poster"} withPlaceholder />
                    <Title order={4}>Director: {oneMovieData.director}</Title>
                    <Group position="left">
                        <Badge color="dark">{oneMovieData.genre}</Badge>
                        <Badge color="dark" variant="outline">{parseInt(oneMovieData.duration)} minutes</Badge>
                        <Badge color="gray" variant="outline">Rated {oneMovieData.rating}</Badge>
                        <Badge color="yellow" variant="dot">{oneMovieData.score} ⭐</Badge>
                    </Group>
                    <p>{oneMovieData.description}</p>
                    <Title order={6}>Gross: {oneMovieData.gross}</Title>
                </div>
            </Modal>

            <div style={{ display: "flex" }}>
                <nav style={{ padding: "2rem" }}>
                    <Grid gutter={80}>
                        {cards}
                    </Grid>
                    <Pagination id="pagination" page={activePage} onChange={changePage} total={totalPagination} color="dark" sibilings={1} withEdges />
                </nav>
            </div>
        </>
    );
}