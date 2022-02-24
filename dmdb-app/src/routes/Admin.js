import { Link,Outlet } from "react-router-dom";
import { getAdmin } from "../data";

//This function is used to return the admin page
export default function Admin() {
  let admin = getAdmin();
  return (
    <div style={{ display: "flex" }}>
      <nav >
      </nav>
      <Outlet/>
    </div>
  );
}