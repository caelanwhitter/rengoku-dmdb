import { Link,Outlet } from "react-router-dom";
import { getRegister } from "../data";

//This function is used to display the Register page
export default function Register() {
  let register = getRegister();
  return (
    <div style={{ display: "flex" }}>
      <nav >
      </nav>
      <Outlet/>
    </div>
  );
}