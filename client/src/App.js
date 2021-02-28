/*
 * Style Sheets
 */
import "bootstrap/dist/css/bootstrap.min.css";
/*
 * Pages
 */
import Home from "./Pages/Home";
import CreateVehicle from "./Pages/CreateVehicle";
import CreateTelem from "./Pages/CreateTelem";
import Sessions from "./Pages/Sessions";
/*
 * Components
 */
import AppNavbar from "./Components/AppNavbar";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";

function App() {
  return (
    <>
      <AppNavbar />
      <Router>
        <>
          <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/create-vehicle" component={CreateVehicle} />
            <Route exact path="/create-telem" component={CreateTelem} />
            <Route exact path="/sessions" component={Sessions} />
          </Switch>
        </>
      </Router>
    </>
  );
}

export default App;
