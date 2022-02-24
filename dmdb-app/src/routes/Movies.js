import { NavLink, Outlet } from "react-router-dom";
import { getMovies } from "../data";
import { Table, Pagination } from '@mantine/core';
import React, { useState, useEffect } from 'react';


export default function Movies() {
    const [movies, setMovie] = useState([]);
    const [activePage, setPage] = useState(1);

    useEffect(() => {
        fetch('http://localhost:3001/api/allMovies/page/' + activePage)
            .then(json => {
                console.log(json);
                setMovie(json);
            })
            .catch(err => {
                console.log()
            })
    });

    const rows = movies.map((element) => (
        <tr key={element.number}>
            <td><NavLink style={({ isActive }) => {
                return { color: isActive ? "red" : "blue" };
            }} to={`/movies/${element.number}`}
                key={element.number}>
                {element.name}</NavLink></td>
            <td>{element.amount}</td>
            <td>{element.due}</td>
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
                <Pagination page={activePage} onChange={setPage} total={rows.length} color="dark" sibilings={1} withEdges />
            </nav>
            <Outlet />
        </div>
    );
}