import { useParams } from "react-router-dom";
import { Button } from "@mantine/core";

export default function Movie() {
  let params = useParams();
  return <Button m={20}>View {params.movieId}</Button>
}