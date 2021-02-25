import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useState } from "react";

function CreateVehicle() {
  const options = [1, 2, 3, 4, 5, 6];
  // Name State handler
  const [name, setName] = useState("");
  // Desc State handler
  const [desc, setDesc] = useState("");
  // Item State handler
  const blankItem = { id: "", name: "" };
  const [ItemState, setItemState] = useState([{ ...blankItem }]);

  const addItem = () => {
    setItemState([...ItemState, { ...blankItem }]);
  };
  const handleItemChange = (e) => {
    const updatedItems = [...ItemState];
    updatedItems[e.target.dataset.idx][e.target.dataset.nme] = e.target.value;
    setItemState(updatedItems);
    console.log(updatedItems);
  };
  const handleRemoveItem = (e) => {
    const updatedItems = [...ItemState];
    updatedItems.splice(e.target.dataset.idx, 1);
    setItemState(updatedItems);
  };
  const submitForm = (e) => {
    e.preventDefault();
    // Create item to send to backend
    const item = { name: name, desc: desc, telem: ItemState };
    // Send to backend
    console.log(item);
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
            <Form.Label>Device</Form.Label>
          </Col>
          <Col>
            <Form.Label>Delete</Form.Label>
          </Col>
        </Form.Row>
        {ItemState.map(({ id, val }, i) => (
          <Row style={{ padding: "0.25rem" }}>
            <Col>
              <Form.Control
                type="text"
                data-idx={i}
                data-nme="id"
                placeholder="0xFE"
                onChange={handleItemChange}
              />
            </Col>
            <Col>
              <Form.Control
                as="select"
                data-idx={i}
                data-nme="name"
                onChange={handleItemChange}
              >
                {options.map((num, i) => (
                  <option key={i} value={num}>
                    {num}
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
