import { Link,Outlet } from "react-router-dom";
import { getAdmin } from "../data";
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