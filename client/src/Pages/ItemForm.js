import React, { useState } from "react";
// Bootstrap stuffs
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
// Custom components
import ItemOptionsModal from "../Components/ItemOptions";
import DragAndDrop from "../Components/Common/DragAndDrop";
// Utils
import { isHexOrDec } from "./../Utils/numbers";
// Icons
import { BsList } from "react-icons/bs";
// Axios
import axios from "axios";
// Styles
// import "./../styles/dnd.scss"; // TODO: DOES NOT WORK I SUCK AT STYLING

// Types of data we can receive
const formats = [
  "unaligned",
  "unaligned bool",
  "bool",
  "8",
  "16",
  "32",
  "IEEE Float",
];
// React page
function ItemForm(props) {
  const blankForm = {
    id: "",
    name: "",
    description: "",
    iso: "",
    values: [],
  };
  const blankValue = {
    name: "",
    units: "",
    signed: false,
    format: formats[0],
    padded: false,
    scalar: 1,
    mask: [0xff, 0xff],
    isEnum: false,
    enumVals: [],
    bytes: 0,
  };
  // Form state handler
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
  const handleOptions = (name, value, i) => {
    const updatedForm = { ...form };
    if (name === "enumVals") {
      updatedForm.values[i].enumVals = value;
    } else {
      updatedForm.values[i][name] = value;
    }
    setForm(updatedForm);
  };
  const handleDrop = (newArr) => {
    const updatedForm = { ...form };
    updatedForm.values = newArr;
    setForm(updatedForm);
  };
  const handleCheckbox = (e) => {
    const updatedForm = { ...form };
    updatedForm.values[e.target.dataset.idx][e.target.dataset.nme] =
      e.target.checked;
    setForm(updatedForm);
  };
  const handleISO = (e) => {
    const updatedForm = { ...form };
    if (e.target.checked) {
      updatedForm.iso = e.target.dataset.fmt;
      switch (e.target.dataset.fmt) {
        case "GPS":
          updatedForm.values = [{ ...blankValue }, { ...blankValue }];
          updatedForm.values[0].name = "latitude";
          updatedForm.values[1].name = "longitude";
          break;
        default:
          console.log("Err");
          break;
      }
    } else {
      updatedForm.iso = "";
      updatedForm.values = [];
    }
    setForm(updatedForm);
  };
  const addItem = () => {
    let updatedForm = { ...form };
    updatedForm.values.push({ ...blankValue });
    setForm(updatedForm);
  };
  const handleItemChange = (e) => {
    const updatedForm = { ...form };
    if (e.target.dataset.nme === "format") {
      if (e.target.value.search("bool") >= 0) {
        updatedForm.values[e.target.dataset.idx].bytes = 1;
        updatedForm.values[e.target.dataset.idx].isEnum = false;
        updatedForm.values[e.target.dataset.idx].signed = false;
        updatedForm.values[e.target.dataset.idx].mask = [1, 0];
      }
      // eslint-disable-next-line
      if (e.target.value == parseInt(e.target.value)) {
        updatedForm.values[e.target.dataset.idx].bytes =
          parseInt(e.target.value) / 8;
      }
      if (e.target.value === "unaligned") {
        updatedForm.values[e.target.dataset.idx].bytes = 1;
        updatedForm.values[e.target.dataset.idx].mask = [0xff, 0xff];
      }
    }
    updatedForm.values[e.target.dataset.idx][e.target.dataset.nme] =
      e.target.value;
    if (e.target.dataset.nme === "device") {
      updatedForm.values[e.target.dataset.idx]["deviceKey"] =
        e.target.options[e.target.selectedIndex].dataset.id;
    }
    setForm(updatedForm);
  };
  const handleRemoveItem = (e) => {
    const updatedForm = { ...form };
    updatedForm.values.splice(e.target.dataset.idx, 1);
    setForm(updatedForm);
  };

  const submitForm = (e) => {
    e.preventDefault();
    // Create item to send to backend
    const item = {
      id: parseInt(form.id),
      name: form.name,
      description: form.description,
      iso: form.iso,
      values: form.values,
    };
    // Send to backend
    axios
      .post("api/telemItem", item)
      .then((res) => {
        if (res.data.success) {
          setForm({ ...blankForm });
        } else {
          // set alert
        }
      })
      .catch((err) => {
        console.log(err.response);
      });
  };
  return (
    <Containter>
      <Form>
        <Form.Row>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              data-nme="name"
              value={form.name}
              onChange={handleFormItemUpdate}
              placeholder="Orion BMS 3"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Decode Id</Form.Label>
            <Form.Control
              type="text"
              data-nme="id"
              value={form.id}
              onChange={handleFormItemUpdate}
              placeholder="0xFF"
            />
          </Form.Group>
          <Form.Group style={{ marginLeft: "1rem" }}>
            <Form.Label style={{ marginBottom: "1rem" }}>
              ISO Formats
            </Form.Label>
            <br />
            {["GPS"].map((item, i) => (
              <Form.Check
                key={i}
                inline
                label={item}
                type="checkbox"
                checked={form.iso === item}
                data-fmt={item}
                onChange={handleISO}
              />
            ))}
          </Form.Group>
        </Form.Row>
        <Form.Group>
          <Form.Label>Item Description</Form.Label>
          <Form.Control
            as="textarea"
            data-nme="description"
            value={form.description}
            onChange={handleFormItemUpdate}
            placeholder="Battery management system created by Orion."
          />
        </Form.Group>
        <Form.Row>
          {[
            { name: "Order", col: "auto", style: { paddingRight: "" } },
            { name: "Name", col: "auto", style: { marginRight: "10rem" } },
            { name: "Units", col: "1", style: { paddingRight: "5rem" } },
            { name: "Enum", col: "auto", style: { paddingRight: "" } },
            { name: "Signed", col: "auto", style: { paddingRight: "" } },
            { name: "Format", col: "2", style: { marginRight: "-1.2rem" } },
            { name: "Options", col: "auto", style: { paddingRight: "" } },
            { name: "Scalar", col: "1", style: { paddingRight: "" } },
            { name: "Delete", col: "auto", style: { paddingRight: "" } },
          ].map((item, i) => (
            <Col key={i} sm={item.col} style={item.style}>
              <Form.Label>{item.name}</Form.Label>
            </Col>
          ))}
        </Form.Row>
        <DragAndDrop ItemState={form.values} setItemState={handleDrop}>
          {form.values.map((value, i) => (
            <Form.Row
              key={i}
              data-idx={i}
              style={{ padding: "0.25rem" }}
              className="DragableListItem"
            >
              <Col md="auto" lg={0.1} style={{ paddingRight: "1.5rem" }}>
                <BsList />
              </Col>
              <Col sm="auto">
                <Form.Control
                  data-idx={i}
                  data-nme="name"
                  type="text"
                  value={value.name}
                  placeholder="Battery Voltage"
                  className="name"
                  onChange={handleItemChange}
                  disabled={form.iso !== ""}
                />
              </Col>
              <Col sm="1">
                <Form.Control
                  data-idx={i}
                  data-nme="units"
                  type="text"
                  value={value.units}
                  placeholder="V"
                  className="unit"
                  onChange={handleItemChange}
                  disabled={
                    form.iso !== "" ||
                    value.isEnum ||
                    value.format.search("bool") >= 0
                  }
                />
              </Col>
              <Col sm="auto" style={{ marginRight: "1.5rem" }}>
                <Form.Check
                  data-idx={i}
                  type="checkbox"
                  checked={value.isEnum}
                  data-nme="isEnum"
                  onChange={handleCheckbox}
                  disabled={
                    form.iso !== "" ||
                    value.signed ||
                    value.format.search("bool") >= 0
                  }
                />
              </Col>
              <Col sm="auto" style={{ marginRight: "1.5rem" }}>
                <Form.Check
                  data-idx={i}
                  type="checkbox"
                  checked={value.signed}
                  data-nme="signed"
                  onChange={handleCheckbox}
                  disabled={
                    form.iso !== "" ||
                    value.isEnum ||
                    value.format.search("bool") >= 0
                  }
                />
              </Col>
              <Col sm="auto">
                <Form.Control
                  as="select"
                  data-idx={i}
                  data-nme="format"
                  onChange={handleItemChange}
                  value={value.format}
                  disabled={form.iso !== ""}
                >
                  {formats.map((num, i) => (
                    <option key={i} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col sm="auto">
                <ItemOptionsModal
                  item={value}
                  index={i}
                  callback={handleOptions}
                />
              </Col>
              <Col sm="1">
                <Form.Control
                  data-idx={i}
                  data-nme="scalar"
                  type="number"
                  value={value.scalar}
                  placeholder="2"
                  onChange={handleItemChange}
                  disabled={
                    form.iso !== "" ||
                    value.isEnum ||
                    value.format.search("bool") >= 0
                  }
                />
              </Col>
              <Col>
                <Button
                  variant="danger"
                  data-idx={i}
                  onClick={handleRemoveItem}
                  disabled={form.iso !== ""}
                >
                  Delete
                </Button>
              </Col>
            </Form.Row>
          ))}
        </DragAndDrop>
        <Button variant="success" onClick={addItem} disabled={form.iso !== ""}>
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

export default ItemForm;
