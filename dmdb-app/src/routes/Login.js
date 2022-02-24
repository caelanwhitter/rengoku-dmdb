import { Link,Outlet } from "react-router-dom";
import { getLogin } from "../data";

//This function is used to display the Login page
export default function Login() {
  let login = getLogin();
  return (
    <div style={{ display: "flex" }}>
        <nav >
              
        </nav>
      <Outlet/>
    </div>
  );
}