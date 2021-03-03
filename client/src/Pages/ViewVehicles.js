import React, { useEffect, useState } from "react";
// Bootstrap stuff
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";

function ViewVehicles() {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    axios.get("/api/vehicle").then((res) => {
      setVehicles(res.data);
    });
  }, []);
  const handleDelete = (e) => {
    axios.delete(`/api/vehicle/${e.target.dataset._id}`).then((res) => {
      let updatedItems = [...vehicles];
      updatedItems.filter((item) => item._id !== res.data._id);
      setVehicles(updatedItems);
    });
  };
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          {["Name", "ID", "Description", "Edit", "Delete"].map((item, i) => (
            <th key={i}>{item}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {vehicles.map((item, i) => (
          <tr key={i}>
            <td>{item.name}</td>
            <td>{item.id}</td>
            <td>{item.description}</td>
            <td>
              <Button variant="primary">Edit</Button>
            </td>
            <td>
              <Button
                variant="danger"
                data-id={item._id}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default ViewVehicles;
