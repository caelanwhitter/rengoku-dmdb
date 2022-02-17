import { NavLink, Link, Outlet } from "react-router-dom";
import { getMovies } from "../data";
import { Table } from '@mantine/core';

export default function Movies() {
  let movies = getMovies();
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
        borderRight: "solid 1px",
        padding: "1rem"
      }}>
        <Table highlightOnHover>
        {movies.map(movies => (
          <tr><NavLink
            style={({ isActive }) => {
              return {
                display: "block",
                margin: "1rem 0",
                color: isActive ? "red" : "blue"
              };
            }} to={`/movies/id_`+`${movies.number}`}
            key={movies.number}
          >
            Movies Tab {movies.name}
          </NavLink></tr>
          
        ))}
        </Table>
      </nav>
      <Outlet />
    </div>
  );
}