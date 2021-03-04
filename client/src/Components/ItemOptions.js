import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
function ItemOptionsModal(props) {
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Display state
  const handleCheck = (e) => {
    let updatedArray;
    // handle if lsb
    if (updatedArray.length > 1) {
      if (updatedArray.length === parseInt(e.target.dataset.idx) + 1) {
        updatedArray[e.target.dataset.idx] =
          updatedArray[e.target.dataset.idx] ^ (0xff << e.target.dataset.bit);
        updatedArray[e.target.dataset.idx] =
          updatedArray[e.target.dataset.idx] & 0xff;
      } else {
        updatedArray[e.target.dataset.idx] =
          updatedArray[e.target.dataset.idx] ^
          (0xff >> (7 - e.target.dataset.bit));
        updatedArray[e.target.dataset.idx] =
          updatedArray[e.target.dataset.idx] & 0xff;
      }
    } else {
      updatedArray[e.target.dataset.idx] =
        updatedArray[e.target.dataset.idx] ^ (1 << e.target.dataset.bit);
      updatedArray[e.target.dataset.idx] =
        updatedArray[e.target.dataset.idx] & 0xff;
    }
  };
  const makeChecks = (i, mask) => {
    let row = [];
    for (let j = 0; j < 8; j++) {
      let temp = mask & (1 << j);
      temp = temp >> j;
      row.push(
        <Form.Label key={j}>
          {8 - j}
          <br />
          <Form.Check
            data-idx={i}
            data-bit={j}
            type="checkbox"
            checked={temp === 0 ? false : true}
            onChange={handleCheck}
          />
        </Form.Label>
      );
    }
    return (
      <Form.Label key={i}>
        {i === 0 ? "MSB" : "LSB"}
        <br />
        {row}
      </Form.Label>
    );
  };
  const handleMaskField = (bytes) => {
    let stuff = [];
    let len = bytes > 2 ? 2 : bytes;
    for (let i = 0; i < len; i++) {
      if (bytes >= 2 && i === 1) {
        let mid = bytes > 2 ? "..." : "";
        stuff.push(
          <span key={99} style={{ marginRight: ".4rem", marginTop: "" }}>
            [{mid}]
          </span>
        );
      }
      stuff.push(makeChecks(i, props.item.mask[i]));
    }
    return stuff;
  };
  const addEnumVal = () => {
    console.log("Bed Time");
  };
  const handleEnumField = (bytes) => {
    let stuff = [];
    stuff.push(
      <Form.Row>
        <Form.Label>Enum Values</Form.Label>
        <Button variant="success" onClick={addEnumVal}>
          Add Enum Value
        </Button>
      </Form.Row>
    );
    stuff.push();
    for (let i = 0; i < 2 ** bytes; i++) {
      stuff.push(
        <Form.Row>
          <Col sm="auto">
            <Form.Label>{i}</Form.Label>
          </Col>
          <Col>
            <Form.Control type="text" data-nme="name" />
          </Col>
          <Col>
            <Form.Control type="text" data-nme="name" />
          </Col>
        </Form.Row>
      );
    }
    return stuff;
  };
  // Render stuff
  return (
    <>
      <Button
        variant="primary"
        disabled={
          !(
            (props.item.format && props.item.format.search("unaligned") >= 0) ||
            props.item.isEnum
          )
        }
        onClick={handleShow}
      >
        Edit
      </Button>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Row>
            <Form.Label>Number of bytes</Form.Label>
            <Form.Control
              data-nme="bytes"
              type="number"
              value={props.item.bytes}
              placeholder="2"
              onChange={(e) =>
                props.callback(
                  e.target.dataset.nme,
                  e.target.value,
                  props.index
                )
              }
              disabled={
                props.item.format === "unaligned bool" ||
                props.item.format !== "unaligned"
              }
            />
          </Form.Row>
          <Form.Row>
            {props.item.format.search("unaligned") >= 0 && (
              <>
                <Form.Label>
                  Masks
                  <br />
                  {handleMaskField(props.item.bytes)}
                </Form.Label>
              </>
            )}
          </Form.Row>
          <Form.Row>
            {props.item.isEnum && handleEnumField(props.item.bytes)}
          </Form.Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default ItemOptionsModal;
