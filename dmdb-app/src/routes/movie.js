import { useParams } from "react-router-dom";
import { useState } from 'react';
import { getMovies } from "../data";
import { Modal, Button } from '@mantine/core';

export default function Movie() {
  let { movieId } = useParams();
  const movieList = getMovies();
  const [opened, setOpened] = useState(false);
  let current = movieList.forEach(i => {
    if (movieId === i.number) {
      return {
        movieId: i.number,
        movieName: i.name,
      }
    }
  });

  return (
    <>
    <Modal
      opened={opened}
      onClose={() => setOpened(false)}
      title={current.movieName}
    >

    </Modal>
    <div id="movieDetails">
      <h2>This is the ID of the movie: {movieId}</h2>
      <h3>This is the name of the movie: {""}</h3>
      <Button onClick={() => setOpened(true)} variant="subtle">View Details</Button>
    </div>
    </>
    );
}