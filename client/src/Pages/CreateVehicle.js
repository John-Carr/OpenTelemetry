import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useState, useEffect } from "react";
import axios from "axios";

function CreateVehicle() {
  // const options = [1, 2, 3, 4, 5, 6];
  const [options, setOptions] = useState([]);
  useEffect(() => {
    axios.get("/api/telemItem").then((res) => {
      setOptions(res.data);
    });
  }, []);
  // Name State handler
  const [name, setName] = useState("");
  // Desc State handler
  const [desc, setDesc] = useState("");
  // Item State handler
  const blankItem = { id: "", name: "", device: "", deviceKey: "" };
  const [ItemState, setItemState] = useState([{ ...blankItem }]);

  const addItem = () => {
    setItemState([...ItemState, { ...blankItem }]);
  };
  const handleItemChange = (e) => {
    const updatedItems = [...ItemState];
    updatedItems[e.target.dataset.idx][e.target.dataset.nme] = e.target.value;
    // get the key because using names is bad (Sorry Raymond)
    console.log(e.target.dataset.nme);
    if (e.target.dataset.nme === "device") {
      updatedItems[e.target.dataset.idx]["deviceKey"] =
        e.target.options[e.target.selectedIndex].dataset.id;
    }
    setItemState(updatedItems);
  };
  const handleRemoveItem = (e) => {
    const updatedItems = [...ItemState];
    updatedItems.splice(e.target.dataset.idx, 1);
    setItemState(updatedItems);
  };
  const submitForm = (e) => {
    e.preventDefault();
    // Create item to send to backend
    const item = { name: name, desc: desc, telemItems: ItemState };
    // Send to backend
    axios.post("api/vehicle", item);
  };
  return (
    <Containter>
      <Form>
        <Form.Group>
          <Form.Label>Vehicle Name</Form.Label>
          <Form.Control
            type="text"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
            placeholder="Cielo"
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Vehicle Description</Form.Label>
          <Form.Control
            as="textarea"
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            placeholder="Whale."
          />
        </Form.Group>
        <Form.Row>
          <Col>
            <Form.Label>Id</Form.Label>
          </Col>
          <Col>
            <Form.Label>Name</Form.Label>
          </Col>
          <Col>
            <Form.Label>Device</Form.Label>
          </Col>
          <Col>
            <Form.Label>Delete</Form.Label>
          </Col>
        </Form.Row>
        {ItemState.map(({ id, name, device }, i) => (
          <Row style={{ padding: "0.25rem" }}>
            <Col>
              <Form.Control
                type="text"
                data-idx={i}
                data-nme="id"
                placeholder="0xFE"
                value={id}
                onChange={handleItemChange}
              />
            </Col>
            <Col>
              <Form.Control
                type="text"
                data-idx={i}
                data-nme="name"
                placeholder="Name-0"
                value={name}
                onChange={handleItemChange}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                data-idx={i}
                data-nme="device"
                value={device}
                onChange={handleItemChange}
              >
                <option>Choose one</option>
                {options.map(({ _id, name }, i) => (
                  <option key={i} data-id={_id} value={name}>
                    {name}
                  </option>
                ))}
              </Form.Control>
            </Col>
            <Col>
              <Button variant="danger" data-idx={i} onClick={handleRemoveItem}>
                Button
              </Button>
            </Col>
          </Row>
        ))}
        <Button variant="success" onClick={addItem}>
          New Value
        </Button>
        <br />
        <Button variant="primary" type="submit" onClick={submitForm}>
          Submit
        </Button>
      </Form>
    </Containter>
  );
}

export default CreateVehicle;
