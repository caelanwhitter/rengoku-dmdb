import { Link,Outlet } from "react-router-dom";

//This function is used to display the Profile page
export default function Profile() {
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}>
          <Link
          >
            Profile Tab 
          </Link>
        ))
      </nav>
      <Outlet/>
    </div>
  );
}