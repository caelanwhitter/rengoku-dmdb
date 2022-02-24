import { Outlet } from "react-router-dom";

//This function is used to render the featured movies of our movie database
export default function Featured() {
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}>
        <p>Featured Page</p>
      </nav>
      <Outlet/>
    </div>
  );
}