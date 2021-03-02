import React, { useState, useEffect } from "react";
import io from "socket.io-client";
import { useParams } from "react-router-dom";
import GPS from "./../Components/DataViews/GPS";
import LiveSection from "./../Components/LiveSection";
import axios from "axios";

function LiveTelem() {
  // State stuff
  const [telemItems, setItems] = useState([]);
  // Socket stuff
  const { vehicle } = useParams();
  useEffect(() => {
    // Get the telem Items we need to sections for
    axios.get(`/api/vehicle/6969/${vehicle}`).then((res) => {
      // Add empty data fields to state
      console.log(res.data);
      let { telem_items } = res.data;
      setItems(telem_items);
    });
  }, [vehicle]);
  useEffect(() => {
    // Join the live namespace and tell the server to put us in the room for the car
    const socket = io(`/live?room=${vehicle}`);
    socket.on("new data", handleNewData);
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, [vehicle]);
  const handleNewData = (data) => {
    // make copy of state
    let updatedTelemItems = [...telemItems];

    // find item that matches the rx id
    let targetItem;
    let i;
    for (i = 0; i < updatedTelemItems.length; i++) {
      if (parseInt(updatedTelemItems[i].id) === parseInt(data.id)) {
        targetItem = updatedTelemItems[i];
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
      targetItem[key].push([data.time, data.data[key]]);
    }
    // Update the item in state
    console.log(updatedTelemItems);
    if (!updatedTelemItems) {
      console.log("cancel");
      return;
    }
    setItems(updatedTelemItems);
  };
  return (
    <>
      <GPS
        center={{
          lat: 59.955413,
          lng: 30.337844,
        }}
        zoom={11}
      />
      {telemItems.map((item, i) => (
        <LiveSection id={item.deviceKey} name={item.name} key={i} item={item} />
      ))}
    </>
  );
}
export default LiveTelem;
