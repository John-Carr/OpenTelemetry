import Navbar from "react-bootstrap/Navbar";
import JoinLiveTelem from "./JoinLiveTelem";
import StartSession from "./StartSession";
function AppNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href="/">Telemetry</Navbar.Brand>
      <JoinLiveTelem />
      <StartSession />
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>Signed in as: Solar Gator</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default AppNavbar;
