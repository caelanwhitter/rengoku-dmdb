import { NavLink, useParams } from "react-router-dom";
import { getMovies } from "../data";

export default function Movie() {
  let params = useParams();
  let movies = getMovies();
  return (
    <div>
    <h2>This is the ID of the movie: {params.movieId}</h2>
    <h3>This is the name of the movie: {params.movieName}</h3>
    
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
            }} to={`/movies/id_`+`${movies.number}/reviews`}
            key={movies.number}
          >
             {movies.name}
          </NavLink>
        ))}
      </nav>
    </div>
      );
}