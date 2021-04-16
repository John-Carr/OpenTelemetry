import React, { useState, useEffect } from "react";
// React bootstrap stuff
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/esm/FormLabel";
import Card from "react-bootstrap/Card";
// Axios
import axios from "axios";
function CreateViewSelect() {
  const [show, setShow] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [choice, setChoice] = useState("");
  const [path, setPath] = useState("");
  const [name, setName] = useState("");
  const handleClose = () => {
    setPage(1);
    setPath(null);
    setChoice("Choose one");
    setShow(false);
  };
  const handleShow = () => setShow(true);
  const [page, setPage] = useState(1);
  useEffect(() => {
    axios.get("/api/vehicle").then((res) => {
      setVehicles(res.data);
    });
  }, []);
  const handleItemChange = (e) => {
    if (e.target.dataset.nme === "car") {
      setChoice(e.target.value);
      if (e.target.value !== "Choose one") {
        let id = vehicles.find((item) => item.name === e.target.value).id;
        setPath(id);
      } else {
        setPath(null);
      }
    } else {
      setName(e.target.value);
    }
  };
  const setBody = () => {
    if (page === 1) {
      return (
        <>
          <Modal.Body>
            <Form>
              <FormLabel>Select Car</FormLabel>
              <Form.Control
                as="select"
                data-nme="car"
                value={choice}
                onChange={handleItemChange}
              >
                <option>Choose one</option>
                {vehicles.map(({ _id, name }, i) => (
                  <option key={i} data-id={_id} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button
              variant="primary"
              disabled={path === null ? true : false}
              onClick={() => setPage(2)}
            >
              Name View
            </Button>
          </Modal.Footer>
        </>
      );
    } else {
      return (
        <>
          <Modal.Body>
            <Form>
              <FormLabel>View Name</FormLabel>
              <Form.Control
                type="text"
                data-nme="name"
                value={name}
                onChange={handleItemChange}
              />
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" href={`/views/${path}/${name}`}>
              Start!
            </Button>
          </Modal.Footer>
        </>
      );
    }
  };
  return (
    <>
      <Card onClick={handleShow} style={{ cursor: "pointer" }}>
        <Card.Body>Create View</Card.Body>
      </Card>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose car to create view</Modal.Title>
        </Modal.Header>
        {setBody()}
      </Modal>
    </>
  );
}
export default CreateViewSelect;
