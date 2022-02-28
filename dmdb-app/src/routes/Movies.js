import { NavLink, Outlet } from "react-router-dom";
import { Table, Pagination } from '@mantine/core';
import React, {useEffect, useState} from 'react'

/**
 * Movies() is a component that fetches the list of Movies from the DB and displays it properly using pagination
 * @returns Table Of Movies + Pagination
 */
export default function Movies() {

    //Initializes variables and sets up "settters to variables"
    const [movies, setMovies] = useState([{}]);
    const [activePage, setPage] = useState(1);
    const [totalPagination, setTotalPagination] = useState();

    /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
    useEffect(() => {
        fetchMoviesPerPage(activePage);
    }, []);

    /**
     * fetchMoviesPerPage() fetches list of movies following pagination endpoints and calculates totalPagination on first render
     * @param {*} pageNumber 
     */
    async function fetchMoviesPerPage(pageNumber) {
        let response = await fetch('http://localhost:3001/api/allMovies/page/' + pageNumber);
        let moviesPaginationJson = await response.json();
        setMovies(moviesPaginationJson);

        // Calls calculateTotalPagination() if totalPagination not initialized yet yet
        if (totalPagination === undefined) {
            await calculateTotalPagination(moviesPaginationJson);
        }
    }

    /**
     * calculateTotalPagination() calculates how many pages should the entire list of movies be separated for pagination
     * @param {*} moviesPaginationJson 
     */
    async function calculateTotalPagination(moviesPaginationJson) {
        let response = await fetch('http://localhost:3001/api/allMovies');
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
    const rows = movies.map((element) => (
        <tr key={element._id}>
            <td><NavLink to={`/movies/${element._id}`}
                key={element._id}>
                {element.title}</NavLink></td>
            <td>{element.director}</td>
            <td>{element.releaseYear}</td>
        </tr>
    ));

    return (
        <div style={{ display: "flex" }}>
            <nav style={{
                borderRight: "solid 1px",
                padding: "1rem"
            }}>
                <Table highlightOnHover>
                    <thead>
                        <tr>
                            <th>Movie Name</th>
                            <th>Movie Amount</th>
                            <th>Movie Due</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </Table>
                <Pagination page={activePage} onChange={changePage} total={totalPagination} color="dark" sibilings={1} withEdges />
            </nav>
            <Outlet />
        </div>
    );
}