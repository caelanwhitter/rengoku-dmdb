import { NavLink, useParams } from "react-router-dom";
import { Button } from "@mantine/core";

//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Movie() {
  let params = useParams();

  return (
    <div id="movieDetails">
      <h2>This is the ID of the movie: {params.movieId}</h2>
      <h2>This is the name of the movie: {params.movieName}</h2>
      <h2>This is the gross amount of the movie: {params.movieGross}</h2>
      <h2>This is the rate of the movie: {params.movieRate}</h2>
      <Button variant="subtle" component={NavLink} to={`/movies/${params.movieId}/reviews`}>View Reviews</Button>
    </div>
    );
}