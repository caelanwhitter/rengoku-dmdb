import { NavLink, Outlet } from "react-router-dom";
import { Table } from '@mantine/core';
import React, {useEffect, useState} from 'react'

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

  //let movies = getMovies();

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

  return (
    
    <div style={{ display: "flex" }}>
      
      <nav style={{
        borderRight: "solid 1px",
        padding: "1rem"
      }}>
        <Table highlightOnHover>
          <thead>
            <tr>
              <th>Movie Name</th>
              <th>Movie Director</th>
              <th>Movie Year</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
      </nav>
      <Outlet />
    </div>
  );
}