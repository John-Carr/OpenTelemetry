import React from "react";
import Card from "react-bootstrap/Card";
import CardDeck from "react-bootstrap/CardDeck";

function Home() {
  return (
    <>
      <CardDeck>
        <Card as="a" href={"/create-vehicle"} style={{ cursor: "pointer" }}>
          <Card.Body>Create new vehicle</Card.Body>
        </Card>
        <Card as="a" href={"/view-vehicles"} style={{ cursor: "pointer" }}>
          <Card.Body>Go to existing vehicle(s)</Card.Body>
        </Card>
      </CardDeck>
      <br />
      <CardDeck>
        <Card as="a" href={"/create-telem"} style={{ cursor: "pointer" }}>
          <Card.Body>Create new telemetry item</Card.Body>
        </Card>
        <Card as="a" href={"/view-telem"} style={{ cursor: "pointer" }}>
          <Card.Body>Go to existing telemetry items</Card.Body>
        </Card>
      </CardDeck>
      <br />
      <CardDeck>
        <Card as="a" href={"/sessions"} style={{ cursor: "pointer" }}>
          <Card.Body>See Active Sessions</Card.Body>
        </Card>
        <Card as="a" href={"/create-vehicle"} style={{ cursor: "pointer" }}>
          <Card.Body>Go to session history</Card.Body>
        </Card>
      </CardDeck>
    </>
  );
}
export default Home;
