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
    let updatedArray = [...props.item.mask];
    if (props.item.format.search("bool") >= 0) {
      updatedArray[e.target.dataset.idx] =
        updatedArray[e.target.dataset.idx] ^ (1 << e.target.dataset.bit);
      updatedArray[e.target.dataset.idx] =
        updatedArray[e.target.dataset.idx] & (1 << e.target.dataset.bit);
    } else {
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
    }
    props.callback("mask", updatedArray, props.index);
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
    let newArr = [
      ...props.item.enum,
      { num: props.item.enum.length, name: "" },
    ];
    props.callback("enum", newArr, props.index);
  };
  const changeEnumVal = (e) => {
    let newArr = [...props.item.enum];
    newArr[e.target.dataset.idx][e.target.dataset.nme] = e.target.value;
    props.callback("enum", newArr, props.index);
  };
  const removeEnumVal = (e) => {
    let newArr = [...props.item.enum];
    newArr.splice(e.target.dataset.idx, 1);
    props.callback("enum", newArr, props.index);
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
            <Col>
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
            </Col>
            <Col>
              <Form.Label>Padded</Form.Label>
              <Form.Check
                type="checkbox"
                checked={props.item.padded}
                onChange={(e) => {
                  props.callback("padded", e.target.checked, props.index);
                }}
              />
            </Col>
          </Form.Row>
          <Form.Row>
            {props.item.format && props.item.format.search("unaligned") >= 0 && (
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
            {props.item.isEnum && (
              <Form.Row>
                <Form.Label>Enum Values</Form.Label>
                <Button
                  variant="success"
                  onClick={addEnumVal}
                  className="justify-content-right"
                >
                  Add Enum Value
                </Button>
              </Form.Row>
            )}
            {props.item.isEnum &&
              props.item.enum.map((item, i) => (
                <Form.Row key={i}>
                  <Col>
                    <Form.Control
                      type="text"
                      data-nme="num"
                      data-idx={i}
                      value={item.num}
                      onChange={changeEnumVal}
                    />
                  </Col>
                  <Col>
                    <Form.Control
                      type="text"
                      data-nme="name"
                      data-idx={i}
                      value={item.name}
                      onChange={changeEnumVal}
                    />
                  </Col>
                  <Col>
                    <Button
                      data-idx={i}
                      variant="danger"
                      onClick={removeEnumVal}
                    >
                      Delete
                    </Button>
                  </Col>
                </Form.Row>
              ))}
          </Form.Row>
        </Modal.Body>
      </Modal>
    </>
  );
}
export default ItemOptionsModal;
