import { NavLink, Outlet } from "react-router-dom";
import { Table } from '@mantine/core';
import React, {useEffect, useState} from 'react'

//This function is used to fetch the data from the server and insert it into a variable called backendData.
export default function Movies() {
  const [backendData,setBackendData] =useState([{}])
  
  useEffect(()=> {
    fetch("/getAll").then(
      response => response.json()
    ).then(
      data => { 
        setBackendData(data)
      })
  }, [])

  // This code will get values stored inside backendData and splits every field from the database into rows and columns
  const rows = backendData.map((element) => (
    <tr key={element.title}>
      <td><NavLink style={({ isActive }) => {
            return { color: isActive ? "red" : "blue" };
          }} to={`/movies/${element.gross}`}
          key={element.title}>
          {element.title}</NavLink></td>
      <td>{element.director}</td>
      <td>{element.releaseYear}</td>
    </tr>
  ));
  
//This is the return using a Table component. rows variable holds all the values fetched from the db
  return (
    <div id="movieContainer">
        <Table id="movieList" highlightOnHover>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Movie Director</th>
              <th>Movie Year</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      <Outlet />
    </div>
  );
}
