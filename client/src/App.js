/*
 * Style Sheets
 */
import "bootstrap/dist/css/bootstrap.min.css";
/*
 * Pages
 */
import Home from "./Pages/Home";
import VehicleForm from "./Pages/VehicleForm";
import ItemForm from "./Pages/ItemForm";
import Sessions from "./Pages/Sessions";
import LiveTelem from "./Pages/LiveTelem";
import ViewVehicles from "./Pages/ViewVehicles";
import ViewItems from "./Pages/ViewItems";
import DataDisplay from "./Pages/DataDisplay";
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
            <Route exact path="/create-vehicle" component={VehicleForm} />
            <Route exact path="/view-vehicles" component={ViewVehicles} />
            <Route exact path="/create-telem" component={ItemForm} />
            <Route exact path="/view-telem" component={ViewItems} />
            <Route exact path="/views/:vehicle/:name" component={DataDisplay} />
            <Route exact path="/sessions" component={Sessions} />
            <Route exact path="/live/:vehicle/:name" component={LiveTelem} />
          </Switch>
        </>
      </Router>
    </>
  );
}

export default App;
