import { NavLink, Link, Outlet } from "react-router-dom";
import { getMovies } from "../data";

export default function Movies() {
  let movies = getMovies();
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
        borderRight: "solid 1px",
        padding: "1rem"
      }}>
        {movies.map(movies => (
          <NavLink
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
          </NavLink>
        ))}
      </nav>
      <Outlet />
    </div>
  );
}