import { Link,Outlet } from "react-router-dom";
import { getFeatured } from "../data";

export default function Featured() {
  let featured = getFeatured();
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}>
        {featured.map(featured => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/featured/${featured.number}`}
            key={featured.number}
          >
           Featured Tab {featured.name}
          </Link>
        ))}
      </nav>
      <Outlet/>
    </div>
  );
}