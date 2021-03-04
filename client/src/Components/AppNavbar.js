import Navbar from "react-bootstrap/Navbar";
import JoinLiveTelem from "./JoinLiveTelem";
import StartSession from "./StartSession";
function AppNavbar() {
  return (
    <Navbar bg="light" expand="md">
      <Navbar.Brand href="/">Telemetry</Navbar.Brand>
      <Navbar.Text>Signed in as: Solar Gator</Navbar.Text>

      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <JoinLiveTelem />
        <StartSession />
      </Navbar.Collapse>
    </Navbar>
  );
}
export default AppNavbar;
