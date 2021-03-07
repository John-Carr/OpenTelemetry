import React, { useState, useEffect } from "react";
// React bootstrap stuff
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import FormLabel from "react-bootstrap/esm/FormLabel";
// Axios
import axios from "axios";
function CreateViewSelect() {
  const [show, setShow] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [choice, setChoice] = useState("");
  const [path, setPath] = useState("");
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    axios.get("/api/vehicle").then((res) => {
      setVehicles(res.data);
    });
  }, []);
  const handleItemChange = (e) => {
    setChoice(e.target.value);
    let id = vehicles.find((item) => item.name === e.target.value).id;
    setPath(id);
  };
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Create View
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose car to create view</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <FormLabel>Select Car</FormLabel>
            <Form.Control
              as="select"
              data-nme="device"
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
          <Button variant="primary" href={`/views/${path}`}>
            Start!
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default CreateViewSelect;
