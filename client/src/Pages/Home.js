import React from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";

function Home() {
  return (
    <CardDeck>
      <Card as="a" href={"/create-vehicle"} style={{ cursor: "pointer" }}>
        <Card.Body>Create new vehicle</Card.Body>
      </Card>
      <Card as="a" href={"/create-telem"} style={{ cursor: "pointer" }}>
        <Card.Body>Create new telemetry item</Card.Body>
      </Card>
      <Card as="a" href={"/create-vehicle"} style={{ cursor: "pointer" }}>
        <Card.Body>Go to existing vehicle(s)</Card.Body>
      </Card>
    </CardDeck>
  );
}
export default Home;
