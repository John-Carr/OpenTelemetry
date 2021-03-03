import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import React, { useState, useEffect } from "react";
import axios from "axios";
// Utils
import { isHexOrDec } from "./../Utils/numbers";
function VehicleForm(props) {
  // Telemetry Item Options
  const [options, setOptions] = useState([]);
  useEffect(() => {
    axios.get("/api/telemItem").then((res) => {
      setOptions(res.data);
    });
  }, []);
  const blankForm = {
    id: "",
    name: "",
    description: "",
    telem_items: [],
  };
  const blankItem = { id: "", name: "", device: "", deviceKey: "" };
  const setInitialState = () => {
    if (props.item) {
      return { ...props.item };
    } else {
      return { ...blankForm };
    }
  };
  const [form, setForm] = useState(setInitialState);
  const handleFormItemUpdate = (e) => {
    // check if the field is an ID field if so make sure that the input is a number
    if (e.target.dataset.nme === "id") {
      if (!isHexOrDec(e.target.value)) {
        return;
      }
    }
    let updatedForm = { ...form };
    updatedForm[e.target.dataset.nme] = e.target.value;
    setForm(updatedForm);
  };
  const addItem = () => {
    let updatedForm = { ...form };
    updatedForm.telem_items.push({ ...blankItem });
    setForm(updatedForm);
  };

  const handleItemChange = (e) => {
    // check if the field is an ID field if so make sure that the input is a number
    if (e.target.dataset.nme === "id") {
      if (!isHexOrDec(e.target.value)) {
        return;
      }
    }
    const updatedForm = { ...form };
    updatedForm.telem_items[e.target.dataset.idx][e.target.dataset.nme] =
      e.target.value;
    if (e.target.dataset.nme === "device") {
      updatedForm.telem_items[e.target.dataset.idx]["deviceKey"] =
        e.target.options[e.target.selectedIndex].dataset.id;
    }
    setForm(updatedForm);
  };
  const handleRemoveItem = (e) => {
    const updatedForm = { ...form };
    updatedForm.telem_items.splice(e.target.dataset.idx, 1);
    setForm(updatedForm);
  };
  const submitForm = (e) => {
    e.preventDefault();
    // Create Item to be sent to DB
    // Parse int for items
    form.telem_items.forEach((item) => {
      item.id = parseInt(item.id);
    });
    // Parse int for the car ID
    let item = {
      id: parseInt(form.id),
      name: form.name,
      description: form.description,
      telem_items: form.telem_items,
    };
    // Send to backend
    if (props.item) {
      axios.put("api/vehicle", item).then((res) => {
        if (props.callback) {
          props.callback(res.data.data);
        }
      });
    } else {
      axios
        .post("api/vehicle", item)
        .then((res) => {
          // on success
          setForm({ ...blankForm });
        })
        .catch((err) => {
          console.log(err.response.data);
        });
    }
  };
  return (
    <Containter>
      <Form>
        <Form.Row>
          <Form.Group>
            <Form.Label>Vehicle Id</Form.Label>
            <Form.Control
              type="text"
              data-nme="id"
              value={form.id}
              onChange={handleFormItemUpdate}
              placeholder="0xFF"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Vehicle Name</Form.Label>
            <Form.Control
              type="text"
              data-nme="name"
              value={form.name}
              onChange={handleFormItemUpdate}
              placeholder="Cielo"
            />
          </Form.Group>
        </Form.Row>
        <Form.Group>
          <Form.Label>Vehicle Description</Form.Label>
          <Form.Control
            as="textarea"
            data-nme="description"
            value={form.description}
            onChange={handleFormItemUpdate}
            placeholder="Whale."
          />
        </Form.Group>
        <Form.Row>
          {["Id", "Name", "Device", "Delete"].map((item, i) => (
            <Col key={i}>
              <Form.Label>{item}</Form.Label>
            </Col>
          ))}
        </Form.Row>
        {form.telem_items.map(({ id, name, device }, i) => (
          <Row key={i} style={{ padding: "0.25rem" }}>
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
                {options.map(({ id, name }, i) => (
                  <option key={i} data-id={id} value={name}>
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

export default VehicleForm;
