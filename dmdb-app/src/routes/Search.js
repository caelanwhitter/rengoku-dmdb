
import { Grid, Text, Badge, Title, Modal, Group, Card, Image, Pagination, TextInput,Button } from '@mantine/core';
import React, {useEffect, useState} from 'react';
import { Outlet, Link } from "react-router-dom";
import '../App.css';


export default function Search() {
    const [movies, setMovies] = useState([{}]);
    const [activePage, setPage] = useState(1);
    const [totalPagination, setTotalPagination] = useState();
    const [opened, setOpened] = useState(false);
    const [searchopened, setSearchOpened] = useState(false);
    const [backendData, setBackendData] = useState([{}])
    const [value, setValue] = useState('');


    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
     useEffect(() => {
        fetchMoviesPerPage(activePage);
    }, []);

    async function fetchSearch(){
   
        let response = await fetch("/api/getSearch?title="+value)
        let movieSearched = await response.json();
        setMovies(movieSearched);
        setSearchOpened(false);
          
    }
    async function getDetails(movieId) {
        await fetch("/api/oneMovie?id=" + movieId).then(
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
        let response = await fetch('/api/getSearch/page/'+pageNumber+'?title='+value);
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
        let response = await fetch('/api/getSearch?title='+value);
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
            <Card onClick={() => { getDetails(element._id); setOpened(true)}} style={{cursor: "pointer"}} shadow="md">
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
        <nav id="tabs">
        <Link className="tabLink" onClick={() => setSearchOpened(true)} to={{}}>Search</Link>{" | "}
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
          onClick={fetchSearch}
          component={Link}
          to='/movies/search'
          color="dark"
          type="submit">
          Go!
        </Button>
      </Modal>
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