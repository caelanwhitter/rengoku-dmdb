import { NavLink, Outlet } from "react-router-dom";
import { getMovies } from "../data";
import { Table } from '@mantine/core';

export default function Movies() {
  let movies = getMovies();

  const rows = movies.map((element) => (
    <>
    <tr key={element.number}>
      <td><NavLink to={ `./${element.number}` } key={element.name}> 
        {element.name}</NavLink></td>
      <td>{element.amount}</td>
      <td>{element.due}</td>
    </tr>
    </>
  ));

  return (
    <div id="movieContainer">
        <Table id="movieList" highlightOnHover>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Movie Amount</th>
              <th>Movie Due</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      <Outlet />
    </div>
  );
}