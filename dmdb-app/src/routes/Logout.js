import { Link,Outlet } from "react-router-dom";
import { getLogout } from "../data";
export default function Logout() {
  let logout = getLogout();
  return (
    <div style={{ display: "flex" }}>
      <nav >
      </nav>
      <Outlet/>
    </div>
  );
}