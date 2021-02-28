import React, { useState } from "react";
// Bootsrap stuffs
import Form from "react-bootstrap/Form";
import Button from "react-bootstrap/Button";
import Containter from "react-bootstrap/Container";
import Col from "react-bootstrap/Col";
// Custom components
import BitEditModal from "./../Components/BitEditModal";
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
  // Name State handler
  const [name, setName] = useState("");
  // Desc State handler
  const [desc, setDesc] = useState("");
  const [decodeId, setId] = useState("");
  // or entry for custom stuff??
  // const [isGPS, setIsGPS] = useState(false);
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
  const submitForm = (e) => {
    e.preventDefault();
    // Create item to send to backend
    const item = {
      name: name,
      desc: desc,
      decodeId: parseInt(decodeId),
      values: ItemState,
    };
    // Send to backend
    axios.post("api/telemItem", item);
  };
  // Drag State
  const initialDnDState = {
    draggedFrom: null,
    draggedTo: null,
    isDragging: false,
    originalOrder: [],
    updatedOrder: [],
  };
  const [dragAndDrop, setDragAndDrop] = React.useState(initialDnDState);
  // Drag functions
  const onDragStart = (e) => {
    // We'll access the "data-position" attribute
    // of the current element dragged
    const initialPosition = Number(e.currentTarget.dataset.idx);
    setDragAndDrop({
      // we spread the previous content
      // of the hook variable
      // so we don't override the properties
      // not being updated
      ...dragAndDrop,

      draggedFrom: initialPosition, // set the draggedFrom position
      isDragging: true,
      originalOrder: ItemState, // store the current state of "list"
    });

    // Note: this is only for Firefox.
    // Without it, the DnD won't work.
    // But we are not using it.
    e.dataTransfer.setData("text/html", "");
  };

  const onDragOver = (event) => {
    event.preventDefault();

    // Store the content of the original list
    // in this variable that we'll update
    let newList = dragAndDrop.originalOrder;

    // index of the item being dragged
    const draggedFrom = dragAndDrop.draggedFrom;

    // index of the drop area being hovered
    const draggedTo = Number(event.currentTarget.dataset.idx);

    // get the element that's at the position of "draggedFrom"
    const itemDragged = newList[draggedFrom];
    // filter out the item being dragged
    const remainingItems = newList.filter(
      (item, index) => index !== draggedFrom
    );

    // update the list
    newList = [
      ...remainingItems.slice(0, draggedTo),
      itemDragged,
      ...remainingItems.slice(draggedTo),
    ];
    // since this event fires many times
    // we check if the targets are actually
    // different:
    if (draggedTo !== dragAndDrop.draggedTo) {
      setDragAndDrop({
        ...dragAndDrop,

        // save the updated list state
        // we will render this onDrop
        updatedOrder: newList,
        draggedTo: draggedTo,
      });
    }
  };

  const onDrop = () => {
    // we use the updater function
    // for the "list" hook
    setItemState(dragAndDrop.updatedOrder);

    // and reset the state of
    // the DnD
    setDragAndDrop({
      ...dragAndDrop,
      draggedFrom: null,
      draggedTo: null,
      isDragging: false,
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
          <Col>
            <Form.Label>Order</Form.Label>
          </Col>
          <Col>
            <Form.Label>Name</Form.Label>
          </Col>
          <Col>
            <Form.Label>Bytes</Form.Label>
          </Col>
          <Col>
            <Form.Label>Units</Form.Label>
          </Col>
          <Col>
            <Form.Label>Data Type</Form.Label>
          </Col>
          <Col>
            <Form.Label>Decode</Form.Label>
          </Col>
          <Col>
            <Form.Label>Scalar</Form.Label>
          </Col>
          <Col>
            <Form.Label>Delete</Form.Label>
          </Col>
        </Form.Row>
        {ItemState.map(({ name, length, unit, dataType, scalar }, i) => (
          <Form.Row
            key={i}
            data-idx={i}
            draggable="true"
            onDragStart={onDragStart}
            onDragOver={onDragOver}
            onDrop={onDrop}
            style={{ padding: "0.25rem" }}
            className="DragableListItem"
          >
            <Col sm>
              <BsList />
              <h2>{`Value ${i}`}</h2>
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
              <Button variant="danger" data-idx={i} onClick={handleRemoveItem}>
                Button
              </Button>
            </Col>
          </Form.Row>
        ))}
        <Button variant="success" onClick={addItem}>
          New Value
        </Button>
        <br />
        <Button variant="primary" type="submit" onClick={submitForm}>
          Submit
        </Button>
        <Button
          onClick={() =>
            axios.get(`api/telemItem/6969/1`).then((res) => {
              console.log(res);
            })
          }
        >
          PressMe
        </Button>
      </Form>
    </Containter>
  );
}

export default CreateTelem;
