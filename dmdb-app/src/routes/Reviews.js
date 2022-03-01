import React, { useEffect, useState } from 'react'
import { useParams } from "react-router-dom";
import { Table } from '@mantine/core';


//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Reviews() {
  let params = useParams();
  const [backendData, setBackendData] = useState([{}])



  /**
     * useEffect() runs following methods once. Similar to ComponentDidMount()
     */
   useEffect(() => {
    fetchReviews();});

  
      /**
     * fetchReviews() fetches list of reviews for specific movie
     * 
     */
       async function fetchReviews() {
        let response = await fetch('/api/oneMovie/reviews?id='+params.movieId);
        let moviesPaginationJson = await response.json();
        setBackendData(moviesPaginationJson);
  
    }

    const rows = backendData.map((element) => (
      <tr>
        <td>{element.movieId}</td>
        <td>{element.content}</td>
        <td>{element.rating}</td>
      </tr>
    ));
  

    return (
    
      <div style={{ display: "flex" }}>
        
    
          <Table highlightOnHover>
            <thead>
              <tr>
                <th>Movie id</th>
                <th>Movie content</th>
                <th>Movie rating</th>
              </tr>
            </thead>
            <tbody>{rows}</tbody>
          </Table>
        
      </div>
    );
  }
  