import { Link,Outlet } from "react-router-dom";
import { getHiddenGems } from "../data";
export default function HiddenGems() {
  let hiddengems = getHiddenGems();
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}>
        {hiddengems.map(hiddengems => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/hiddengems/${hiddengems.number}`}
            key={hiddengems.number}
          >
           Hidden Gems Tab {hiddengems.name}
          </Link>
        ))}
      </nav>
      <Outlet/>
    </div>
  );
}