import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
function BitEditModal(props) {
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => {
    if (props.callback) {
      props.callback(bytes, props.index);
    }
    setShow(false);
  };
  const handleShow = () => setShow(true);
  // Data state
  const [bytes, setBytes] = useState([]);

  useEffect(() => {
    let initialArray = [];
    for (let i = 0; i < props.numBytes; i++) {
      if (parseInt(props.numBytes) === 1) {
        initialArray[i] = 0;
      } else {
        initialArray[i] = 0xff;
      }
    }
    setBytes(initialArray);
  }, [props.numBytes]);
  // Display state
  const handleCheck = (e) => {
    let updatedArray = [...bytes];
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
    setBytes(updatedArray);
  };
  const makeChecks = (disabled, i, mask) => {
    let row = [];
    for (let j = 0; j < 8; j++) {
      let temp = mask & (1 << j);
      temp = temp >> j;
      row.push(
        <Form.Check
          key={j}
          inline
          data-idx={i}
          data-bit={j}
          label={j + 1}
          type="checkbox"
          checked={temp === 0 ? false : true}
          disabled={disabled}
          onChange={handleCheck}
        />
      );
    }
    return row;
  };
  const handleInputField = (bytes) => {
    let stuff = [];
    for (let i = 0; i < bytes.length; i++) {
      let disabled = i === 0 || i === bytes.length - 1 ? false : true;
      stuff.push(
        <Form.Row key={i}>
          Byte[{i}]
          <br />
          {makeChecks(disabled, i, bytes[i])}
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
        disabled={props.dataType === "custom" ? false : true}
        onClick={handleShow}
      >
        Edit
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>{handleInputField(bytes)}</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleClose}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default BitEditModal;
