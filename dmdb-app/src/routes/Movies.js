import { Link, Outlet } from "react-router-dom";
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
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/movies/${movies.name}`}
            key={movies.number}
          >
          {movies.name}
          </Link>
        ))}
      </nav>
      <Outlet/>
    </div>
  );
}