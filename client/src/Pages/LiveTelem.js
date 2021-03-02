import React, { useEffect, useReducer } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import GPS from "../Components/DataViews/GPS";
import LiveSection from "../Components/LiveSection";
import axios from "axios";
import ApexCharts from "apexcharts";

// TODO: This is extremly poorly optimized, the data does not need to be added to the state.

const initialState = { telemItems: [] };
function reducer(state, action) {
  switch (action.type) {
    case "init":
      return { telemItems: action.payload };
    case "update":
      return { telemItems: handleNewData(state, action.payload) };
    default:
      throw new Error();
  }
}
var testData = [];
var dataIndex = 0;
const handleNewData = (state, data) => {
  // find item that matches the rx id
  let targetItem;
  let i;
  for (i = 0; i < state.telemItems.length; i++) {
    if (parseInt(state.telemItems[i].id) === parseInt(data.id)) {
      targetItem = state.telemItems[i];
    }
  }
  if (!targetItem) {
    console.log("F");
    return;
  }
  // Check to see if we have create an array yet
  for (let key in data.data) {
    if (!targetItem.hasOwnProperty(key)) {
      targetItem[key] = [];
    }
    targetItem[key].push([new Date(data.time), data.data[key]]);
    ApexCharts.exec(`${targetItem.name}-${key}`, "updateSeries", [
      {
        data: targetItem[key],
      },
    ]);
  }
  // Update the item in state
  // console.log(state.telemItems);
  if (!state.telemItems) {
    console.log("cancel");
    return;
  }
  testData.push([new Date(), dataIndex++]);

  return state.telemItems;
};
function LiveTelem() {
  // Get Room we need to join
  const { vehicle } = useParams();
  // Reducer for handling data
  const [state, dispatch] = useReducer(reducer, initialState);
  useEffect(() => {
    // Get the telem Items we need to sections for
    axios.get(`/api/vehicle/6969/${vehicle}`).then((res) => {
      // Add empty data fields to state
      let { telem_items } = res.data;
      dispatch({ type: "init", payload: telem_items });
    });
  }, [vehicle]);
  useEffect(() => {
    // Join the live namespace and tell the server to put us in the room for the car
    const socket = io(`/live?room=${vehicle}`);
    socket.on("new data", (data) =>
      dispatch({ type: "update", payload: data })
    );
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, [vehicle]);

  return (
    <>
      <GPS
        center={{
          lat: 59.955413,
          lng: 30.337844,
        }}
        zoom={11}
      />
      {state.telemItems.map((item, i) => (
        <LiveSection id={item.deviceKey} name={item.name} key={i} item={item} />
      ))}
    </>
  );
}
export default LiveTelem;
