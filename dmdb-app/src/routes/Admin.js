import { Outlet } from "react-router-dom";

//This function is used to return the admin page
export default function Admin() {

  return (
    <div style={{ display: "flex" }}>
      <nav >
      </nav>
      <Outlet/>
    </div>
  );
}