import { Outlet } from "react-router-dom";

//This function is used to display the hiddenGems page
export default function HiddenGems() {
  return (
    <div style={{ display: "flex" }}>
      <nav style={{
        borderRight: "solid 1px",
        padding: "1rem"
      }}>
        <p>Hidden Gems Page</p>
      </nav>
      <Outlet/>
    </div>
  );
}