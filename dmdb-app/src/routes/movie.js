import { useParams } from "react-router-dom";

export default function Movie() {
  let params = useParams();
  return <h2>Invoice: {params.movieId}</h2>;
}