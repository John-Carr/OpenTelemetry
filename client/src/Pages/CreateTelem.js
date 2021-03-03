import React, { useState } from "react";
// Bootstrap stuffs
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
import Alert from "react-bootstrap/Alert";
// Custom components
import BitEditModal from "./../Components/BitEditModal";
import DragAndDrop from "./../Components/Common/DragAndDrop";
// Icons
import { BsList } from "react-icons/bs";
// Axios
import axios from "axios";
// Styles
// import "./../styles/dnd.scss"; // TODO: DOES NOT WORK I SUCK AT STYLING

// Types of data we can receive
const dataTypes = ["custom", "signed", "unsigned", "decimal", "enum", "string"];
// React page
function CreateTelem() {
  // Alert State
  const [alert, setAlert] = useState({ show: false, style: "success" });
  // Name State handler
  const [name, setName] = useState("");
  // Desc State handler
  const [desc, setDesc] = useState("");
  const [decodeId, setId] = useState("");
  // or entry for custom stuff??
  const [iso, setISO] = useState("");
  // Item State handler
  const blankItem = {
    name: "",
    length: "",
    unit: "",
    dataType: dataTypes[0],
    custom: [], // Holds the MSB and LSB decode stuff, if only one bite then it will only have one element
    scalar: 1,
  };
  const [ItemState, setItemState] = useState([{ ...blankItem }]);

  const addItem = () => {
    setItemState([...ItemState, { ...blankItem }]);
  };
  const handleItemChange = (e) => {
    const updatedItems = [...ItemState];
    updatedItems[e.target.dataset.idx][e.target.dataset.nme] = e.target.value;
    setItemState(updatedItems);
  };
  const handleRemoveItem = (e) => {
    const updatedItems = [...ItemState];
    updatedItems.splice(e.target.dataset.idx, 1);
    setItemState(updatedItems);
  };
  // TODO: Uhhhh this is kinda an anti pattern, I did not intend it but the modal wont be update if you reopen it...
  // Should change modal to use the array from here instead of having its own state... ooops :(
  // Will fix this later
  const handleCustom = (bytes, index) => {
    const updatedItems = [...ItemState];
    updatedItems[index].custom.push(bytes[0]);
    if (bytes.length > 1) {
      updatedItems[index].custom.push(bytes[bytes.length - 1]);
    }
    setItemState(updatedItems);
  };
  const handleISO = (e) => {
    if (e.target.checked) {
      setISO(e.target.dataset.fmt);
    } else {
      setISO("");
    }
    setItemState([]);
  };
  const submitForm = (e) => {
    e.preventDefault();
    // Create item to send to backend
    const item = {
      name: name,
      desc: desc,
      decodeId: parseInt(decodeId),
      values: ItemState,
      iso: iso,
    };
    if (iso) {
      if (iso === "GPS") {
        item.values.push({ name: "lat", length: 2, dataType: [0] });
        item.values.push({ name: "lng", length: 2, dataType: [0] });
      }
    }
    // Send to backend
    axios
      .post("api/telemItem", item)
      .then((res) => {
        if (res.data.success) {
          // Clear State
          setName("");
          setDesc("");
          setId("");
          setItemState("");
          // Alert that the Item was saved correctly
          setAlert({ show: true, style: "success" });
        } else {
          setAlert({ show: true, style: "danger" });
        }
      })
      .catch((err) => {
        console.log(err.response);
        setAlert({ show: true, style: "danger" });
      });
  };
  return (
    <Containter>
      <Alert
        show={alert.show}
        variant={alert.status}
        onClose={() => setAlert({ show: false, status: "success" })}
        dismissible
      >
        Item Saved
      </Alert>
      <Form>
        <Form.Row>
          <Form.Group>
            <Form.Label>Item Name</Form.Label>
            <Form.Control
              type="text"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
              placeholder="Orion BMS 3"
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Decode Id</Form.Label>
            <Form.Control
              type="text"
              value={decodeId}
              onChange={(e) => {
                setId(e.target.value);
              }}
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
                checked={iso === item}
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
            value={desc}
            onChange={(e) => {
              setDesc(e.target.value);
            }}
            placeholder="Battery management system created by Orion."
          />
        </Form.Group>
        <Form.Row>
          {[
            "Order",
            "Name",
            "Bytes",
            "Units",
            "Data Type",
            "Decode",
            "Scalar",
            "Delete",
          ].map((item, i) => (
            <Col key={i}>
              <Form.Label>{item}</Form.Label>
            </Col>
          ))}
        </Form.Row>
        <DragAndDrop ItemState={ItemState} setItemState={setItemState}>
          {ItemState.map(({ name, length, unit, dataType, scalar }, i) => (
            <Form.Row
              key={i}
              data-idx={i}
              style={{ padding: "0.25rem" }}
              className="DragableListItem"
            >
              <Col sm>
                <BsList />
              </Col>
              <Col>
                <Form.Control
                  data-idx={i}
                  data-nme="name"
                  type="text"
                  value={name}
                  placeholder="Battery Voltage"
                  className="name"
                  onChange={handleItemChange}
                />
              </Col>
              <Col>
                <Form.Control
                  data-idx={i}
                  data-nme="length"
                  type="number"
                  value={length}
                  placeholder="2"
                  className="length"
                  onChange={handleItemChange}
                />
              </Col>
              <Col>
                <Form.Control
                  data-idx={i}
                  data-nme="unit"
                  type="text"
                  value={unit}
                  placeholder="V"
                  className="unit"
                  onChange={handleItemChange}
                />
              </Col>
              <Col>
                <Form.Control
                  as="select"
                  data-idx={i}
                  data-nme="dataType"
                  onChange={handleItemChange}
                  value={dataType}
                >
                  {dataTypes.map((num, i) => (
                    <option key={i} value={num}>
                      {num}
                    </option>
                  ))}
                </Form.Control>
              </Col>
              <Col>
                <BitEditModal
                  index={i}
                  dataType={dataType}
                  numBytes={length}
                  callback={handleCustom}
                />
              </Col>
              <Col>
                <Form.Control
                  data-idx={i}
                  data-nme="scalar"
                  type="number"
                  value={scalar}
                  placeholder="2"
                  className="length"
                  onChange={handleItemChange}
                />
              </Col>
              <Col>
                <Button
                  variant="danger"
                  data-idx={i}
                  onClick={handleRemoveItem}
                >
                  Button
                </Button>
              </Col>
            </Form.Row>
          ))}
        </DragAndDrop>
        <Button variant="success" onClick={addItem} disabled={iso !== ""}>
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

export default CreateTelem;
