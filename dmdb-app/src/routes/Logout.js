import { Outlet } from "react-router-dom";

//This function is used to display the Logout page
export default function Logout() {
  return (
    <div style={{ display: "flex" }}>
      <nav >
      </nav>
      <Outlet/>
    </div>
  );
}