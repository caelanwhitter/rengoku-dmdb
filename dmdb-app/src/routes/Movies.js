import {
    Grid, Text, Badge, Title, Modal,
    Group, Card, Image, Pagination
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { useWindowScroll } from '@mantine/hooks';

/**
 * Movies() is a component that fetches the list of Movies from the DB and displays it properly using pagination
 * @returns Table Of Movies + Pagination
 */
export default function Movies() {

    //Initializes variables and sets up "settters to variables"
    const [movies, setMovies] = useState([{}]);
    const [activePage, setPage] = useState(1);
    const [totalPagination, setTotalPagination] = useState();
    const [opened, setOpened] = useState(false);
    const [oneMovieData, setOneMovieData] = useState([{}]);
    const [, scrollTo] = useWindowScroll();

    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        fetchMoviesPerPage(activePage);
    }, []);

    function getDetails(movieId) {
        fetch("/api/oneMovie?id=" + movieId).then(
            response => response.json())
            .then(
                data => { setOneMovieData(data[0]) }
            )
    }

    /**
     * fetchMoviesPerPage() fetches list of movies following pagination endpoints and calculates totalPagination on first render
     * @param {String} pageNumber 
     */
    async function fetchMoviesPerPage(pageNumber) {
        let response = await fetch('/api/allMovies/page/' + pageNumber);
        let moviesPaginationJson = await response.json();
        setMovies(moviesPaginationJson);

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
        fetchMoviesPerPage(event);

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

    const cards = movies.map((movie) => {
        // Checks if movie description and poster are missing and checks if movie isn't an empty object
        if ((!movie.description || !movie.poster) && Object.keys(movie).length !== 0) {
            fetchMovieDataFromBackend(movie);
        }
        return (
            <Grid.Col span={3}>
                <Card onClick={() => { getDetails(movie._id); setOpened(true) }} style={{ cursor: "pointer" }} shadow="md">
                    <Card.Section>
                        <Image src={null} height={320} alt={movie.title + " Poster"} withPlaceholder />
                    </Card.Section>

                    <Text weight={600}>{movie.title}</Text>

                    <Group position="apart">
                        <Text size="sm">{movie.director}</Text>
                        <Badge color="dark">{movie.releaseYear}</Badge>
                    </Group>
                </Card>
            </Grid.Col>
        );
    })

    async function fetchMovieDataFromBackend(movie) {
        try {
            let movieUrl = '/api/oneMovie/fetchMovieApi/' + movie.title;
            let response = await fetch(movieUrl);
            if (response.ok) {
                let movieJson = await response.json();
                console.log(movieJson);
            }
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
                    <Image src={null} height={320} alt={oneMovieData.title + " Poster"} withPlaceholder />
                    <Title order={4}>Director: {oneMovieData.director}</Title>
                    <Group position="left">
                        <Badge color="dark">{oneMovieData.genre}</Badge>
                        <Badge color="dark" variant="outline">{parseInt(oneMovieData.duration)} minutes</Badge>
                        <Badge color="gray" variant="outline">Rated {oneMovieData.rating}</Badge>
                        <Badge color="yellow" variant="dot">{oneMovieData.score} ⭐</Badge>
                    </Group>
                    <p>This is the description of the movie.</p>
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