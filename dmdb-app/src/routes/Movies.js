import { NavLink, Outlet } from "react-router-dom";
import { Table, Pagination } from '@mantine/core';
import React, {useEffect, useState} from 'react'

//This function is used to fetch the data from the server and insert it into a variable called backendData.
export default function Movies() {
    const [movies, setMovies] = useState([{}]);
    const [activePage, setPage] = useState(1);
    const [allMoviesLength, setAllMoviesLength] = useState(0);

    async function fetchMoviesPerPage(pageNumber) {
        let response = await fetch('http://localhost:3001/api/allMovies/page/' + pageNumber);
        let moviesJson = await response.json();
        setMovies(moviesJson);
    }

    async function fetchAllMoviesLength() {
        let response = await fetch('http://localhost:3001/api/allMovies');
        let moviesJson = await response.json();
        setAllMoviesLength(moviesJson.length);
    }

    useEffect(() => {
        fetchMoviesPerPage(activePage);
        fetchAllMoviesLength();
    }, [activePage]);

    const changePage = (event) => {
        fetchMoviesPerPage(event);
        setPage(event);
    }

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
                <Pagination page={activePage} onChange={changePage} total={Math.ceil(allMoviesLength/rows.length)} color="dark" sibilings={1} withEdges />
            </nav>
            <Outlet />
        </div>
    );
}