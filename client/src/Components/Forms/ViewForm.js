// for adding graphs to views
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import axios from "axios";
import { useParams } from "react-router-dom";
import Table from "react-bootstrap/Table";
import Form from "react-bootstrap/Form";
function EditModal(props) {
  // Get Room we need to join
  const { vehicle } = useParams();
  // Modal state
  const [show, setShow] = useState(false);
  const handleClose = () => {
    setShow(false);
  };
  const handleShow = () => setShow(true);
  // Get Telemetry Items relating to that vehicle
  // Telemetry Item Options
  const [options, setOptions] = useState([]);
  const [type, setType] = useState("");
  // how many items are checked
  const [counter, setCounter] = useState(0);
  useEffect(() => {
    axios.get(`/api/vehicle/6969/${vehicle}?items=true`).then((res) => {
      let items = res.data.data;
      // add is selected value
      for (let val in items) {
        for (let property in items[val].values) {
          items[val].values[property].isChecked = false;
        }
      }
      setOptions(items);
    });
  }, [vehicle]);
  const handleCheck = (e) => {
    let newOptions = [...options];
    if (e.target.dataset.nme === "GPS") {
      let checkedItem = newOptions[e.target.dataset.idx];
      checkedItem.isChecked = e.target.checked;
      if (e.target.checked) {
        setCounter((c) => c + 1);
        setType("GPS");
      } else {
        let tempCount = counter - 1;
        setCounter(tempCount);
        if (tempCount === 0) {
          setType("");
        }
      }
    } else {
      let checkedItem =
        newOptions[e.target.dataset.idx].values[e.target.dataset.idxval];
      checkedItem.isChecked = e.target.checked;
      if (e.target.checked) {
        setCounter((c) => c + 1);
        if (checkedItem.isEnum || checkedItem.format.search("bool") >= 0) {
          setType("status");
        } else {
          setType("num");
        }
      } else {
        let tempCount = counter - 1;
        setCounter(tempCount);
        if (tempCount === 0) {
          setType("");
        }
      }
    }
    setOptions(newOptions);
  };
  const addItem = () => {
    let checkedItems = [];
    // Create array of added items to pass to the callback
    for (let val in options) {
      for (let property in options[val].values) {
        if (options[val].values[property].isChecked) {
          // add to list to pass to main view
          checkedItems.push([options[val].name, options[val].values[property]]);
          // clear the states so that the next time is independent of last
          options[val].values[property].isChecked = false;
          setCounter(0);
          setType("");
        }
      }
    }
    props.onAdd(checkedItems);
    setShow(false);
  };
  // Render stuff
  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Add Data View
      </Button>

      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Choose Items to add</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {options.map((item, i) => {
            return (
              <Table striped bordered hover key={i}>
                <thead>
                  <tr>
                    <td colSpan="3">{item.name}</td>
                  </tr>
                </thead>
                <tbody>
                  {item.device === "GPS" ? (
                    <tr>
                      <td>{item.name}</td>
                      <td>
                        <Form.Check
                          data-idx={i}
                          data-nme="GPS"
                          type="checkbox"
                          checked={item.isChecked}
                          onChange={handleCheck}
                          disabled={!("GPS" === type || type === "")}
                        />
                      </td>
                    </tr>
                  ) : (
                    item.values.map((val, j) => {
                      let temp = "";
                      if (val.isEnum || val.format.search("bool") >= 0) {
                        temp = "status";
                      } else {
                        temp = "num";
                      }
                      return (
                        <tr key={j}>
                          <td>{val.name}</td>
                          <td>
                            <Form.Check
                              data-idx={i}
                              data-idxval={j}
                              data-nme={val.name}
                              type="checkbox"
                              checked={val.isChecked}
                              onChange={handleCheck}
                              disabled={!(temp === type || type === "")}
                            />
                          </td>
                          <td>{val.format}</td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </Table>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={addItem}>
            Add
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default EditModal;
