import React, { useEffect, useState } from "react";
// Bootstrap stuff
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
// Custom Components
import EditModal from "./../Components/Common/EditModal";
import VehicleForm from "./../Pages/VehicleForm";
function ViewVehicles() {
  const [vehicles, setVehicles] = useState([]);
  useEffect(() => {
    axios.get("/api/vehicle").then((res) => {
      setVehicles(res.data);
    });
  }, []);
  const handleDelete = (e) => {
    axios.delete(`api/vehicle/${e.target.dataset.id}`).then((res) => {
      let updatedItems = [...vehicles];
      updatedItems = updatedItems.filter((item) => item._id !== res.data._id);
      setVehicles(updatedItems);
    });
  };
  const updateList = (updatedItem) => {
    let updatedItems = [...vehicles];
    let i = updatedItems.findIndex((item) => item._id === updatedItem._id);
    if (i === -1) {
      updatedItems.push(updatedItem);
    } else {
      updatedItems[i] = updatedItem;
    }
    setVehicles(updatedItems);
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
              <EditModal>
                <VehicleForm item={item} callback={updateList} />
              </EditModal>
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
