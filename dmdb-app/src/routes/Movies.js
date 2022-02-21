import { NavLink, Outlet } from "react-router-dom";
import { getMovies } from "../data";
import { Table, Pagination } from '@mantine/core';
import { useState } from 'react';

export default function Movies() {
    let movies = getMovies();

    const [activePage, setPage] = useState(1);
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
                <Pagination page={activePage} onChange={setPage} total={2} color="dark" sibilings={1} withEdges />
            </nav>
            <Outlet />
        </div>
    );
}