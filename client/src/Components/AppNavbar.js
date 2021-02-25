import Navbar from "react-bootstrap/Navbar";

function AppNavbar() {
  return (
    <Navbar bg="light" light expand="md">
      <Navbar.Brand href="/">Telemetry</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        <Navbar.Text>Signed in as: John Carr</Navbar.Text>
      </Navbar.Collapse>
    </Navbar>
  );
}
export default AppNavbar;
