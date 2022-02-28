import { Grid, Text, Badge, Title, Modal, Group, Card, Image, Pagination } from '@mantine/core';
import React, {useEffect, useState} from 'react';

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
    const [backendData, setBackendData] = useState([{}])

    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        fetchMoviesPerPage(activePage);
    }, []);

    // useEffect(()=> {
    //     fetch("/api/oneMovie?id=" + params.movieId).then(
    //       response => response.json()
    //     ).then(
    //       data => { 
    //         setBackendData(data[0])
    //       })
    //   }, [params.movieId]);

    function getDetails(movieId) {
        fetch("/api/oneMovie?id=" + movieId).then(
            response => response.json())
            .then(
                data => {setBackendData(data[0])}
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
        const totalMoviePages = Math.ceil(allMoviesJson.length/moviesPaginationJson.length);

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
    }

    /**
     * rows returns a table body of the appropriate list of movies
     */
    const cards = movies.map((element) => (
        <Grid.Col span={3}>
            <Card onClick={() => { getDetails(element._id); setOpened(true)}} style={{cursor: "pointer"}}shadow="md">
                <Card.Section>
                    <Image src="https://www.theyearinpictures.co.uk/images//image-placeholder.png" height={320} alt={element.title + " Poster"} />
                </Card.Section>

                <Text weight={600}>{element.title}</Text>

                <Group position="apart">
                    <Text size="sm">{element.director}</Text>
                    <Badge color="dark">{element.releaseYear}</Badge>
                </Group>
            </Card>
        </Grid.Col>
    ));

    return (
        <>
        <Modal
            opened={opened}
            onClose={() => setOpened(false)}
            title={<Title>{backendData.title}</Title>}
            size="xl"
            >
            <div id="movieDetails">
                <Image src="https://www.theyearinpictures.co.uk/images//image-placeholder.png" height={320} alt={backendData.title + " Poster"} />
                <Title order={4}>Director: {backendData.director}</Title>
                <Group position="left">
                    <Badge color="dark">{backendData.genre}</Badge>
                    <Badge color="dark" variant="outline">{parseInt(backendData.duration)} minutes</Badge>
                    <Badge color="gray" variant="outline">Rated {backendData.rating}</Badge> 
                    <Badge color="yellow" variant="dot">{backendData.score} ⭐</Badge>    
                </Group>
                <p>This is the description of the movie.</p>
                <Title order={6}>Gross: {backendData.gross}</Title>
            </div>
        </Modal>

        <div style={{ display: "flex" }}>
            <nav style={{ padding: "2rem" }}>
                <Grid gutter={80}>
                    {cards}
                </Grid>
                <Pagination id="pagination" page={activePage} onChange={changePage} total={totalPagination} color="dark" sibilings={1} withEdges/>
            </nav>
        </div>
        </>
    );
}