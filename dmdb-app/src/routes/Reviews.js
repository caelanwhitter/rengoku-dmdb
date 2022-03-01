import { NavLink, Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import React, {useEffect, useState} from 'react'
import { Title, Modal, Button } from '@mantine/core';

//This function is used to create a navigation page from the Movies component.
//It will hold the details of the movies for now.
export default function Reviews() {




  return (
   
      <div style={{ display: "flex" }}>
        <nav style={{
            borderRight: "solid 1px",
            padding: "1rem"
          }}>
          <p>Reviews Page</p>
      </nav>
      </div>
    );
}