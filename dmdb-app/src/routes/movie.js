import { NavLink, useParams } from "react-router-dom";
import { Button } from "@mantine/core";

export default function Movie() {
  let params = useParams();

  return (
    <div id="movieDetails">
      <h2>This is the ID of the movie: {params.movieId}</h2>
      <h3>This is the name of the movie: {params.movieName}</h3>
      <Button variant="subtle" component={NavLink} to={`/movies/${params.movieId}/reviews`}>View Reviews</Button>
    </div>
    );
}