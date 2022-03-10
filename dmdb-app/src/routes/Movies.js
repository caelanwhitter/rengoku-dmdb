import { Grid, Text, Badge, Title, Modal, Group, Card, 
    Image, Pagination, TextInput, Button } from '@mantine/core';
import React, {useEffect, useState} from 'react';
import { Link } from "react-router-dom";
import '../App.css';
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";
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

    const [searchopened, setSearchOpened] = useState(false);
    const [value, setValue] = useState('');

    const [oneMovieData, setOneMovieData] = useState([{}]);
    const [, scrollTo] = useWindowScroll();


    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        fetchMoviesPerPage(activePage);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    async function getDetails(movieId) {
        await fetch("/api/oneMovie?id=" + movieId).then(
            response => response.json())
            .then(
                data => {setOneMovieData(data[0])}
            )
    }

    /**
     * fetchMoviesPerPage() fetches list of movies following pagination endpoints and calculates totalPagination on first render
     * @param {String} pageNumber 
     */
    async function fetchMoviesPerPage(pageNumber) {
        let response = await fetch('/api/getSearch/page/'+pageNumber+'?title='+value);
        let moviesPaginationJson = await response.json();
        setMovies(moviesPaginationJson);

        // Calls calculateTotalPagination() if totalPagination not initialized yet yet
        if(totalPagination === undefined) {
        await calculateTotalPagination(moviesPaginationJson);
        }
    }

    /**
     * calculateTotalPagination() calculates how many pages should the entire list of movies be separated for pagination
     * @param {JSON} moviesPaginationJson 
     */
    async function calculateTotalPagination(moviesPaginationJson) {
        let response = await fetch('/api/getSearch?title='+value);
        let allMoviesJson = await response.json();
        const totalMoviePages = Math.ceil(allMoviesJson.length/moviesPaginationJson.length);
        setTotalPagination(totalMoviePages);
    }
    async function clickOnGo(event) {
        setTotalPagination(undefined);
        fetchMoviesPerPage(event);
        setSearchOpened(false);
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
    const cards = movies.map((element) => (
        <Grid.Col span={3}>
            <Card onClick={() => { getDetails(element._id); setOpened(true)}} style={{cursor: "pointer"}} shadow="md">
                <Card.Section>
                    <Image src={null} height={320} alt={element.title + " Poster"} withPlaceholder/>
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
                <Image src={null} height={320} width={250} alt={oneMovieData.title + " Poster"} withPlaceholder/>
                <div id="movieText">
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
            </div>
        </Modal>

        <Grid className="movieGrid" gutter={80}>
            {cards}
        </Grid>

        <div id="pagination">
            <Pagination page={activePage} onChange={changePage} total={totalPagination} color="dark" sibilings={1} withEdges/>
        </div>
        </>
    );
}