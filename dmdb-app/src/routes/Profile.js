import { Link,Outlet } from "react-router-dom";
import { getProfile } from "../data";
export default function Profile() {
  let profile = getProfile();
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
          borderRight: "solid 1px",
          padding: "1rem"
        }}>
        {profile.map(profile => (
          <Link
            style={{ display: "block", margin: "1rem 0" }}
            to={`/profile/${profile.number}`}
            key={profile.number}
          >
            Profile Tab {profile.name}
          </Link>
        ))}
      </nav>
      <Outlet/>
    </div>
  );
}