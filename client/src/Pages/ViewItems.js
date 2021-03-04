import React, { useEffect, useState } from "react";
// Bootstrap stuff
import Table from "react-bootstrap/Table";
import Button from "react-bootstrap/Button";
import axios from "axios";
// Custom Components
import EditModal from "./../Components/Common/EditModal";
import ItemForm from "./ItemForm";
function ViewItems() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    axios.get("/api/telemItem").then((res) => {
      setItems(res.data);
    });
  }, []);
  const handleDelete = (e) => {
    axios.delete(`api/telemItem/${e.target.dataset.id}`).then((res) => {
      let updatedItems = [...items];
      updatedItems = updatedItems.filter((item) => item._id !== res.data._id);
      setItems(updatedItems);
    });
  };
  const updateList = (updatedItem) => {
    let updatedItems = [...items];
    let i = updatedItems.findIndex((item) => item._id === updatedItem._id);
    if (i === -1) {
      updatedItems.push(updatedItem);
    } else {
      updatedItems[i] = updatedItem;
    }
    setItems(updatedItems);
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
        {items.map((item, i) => (
          <tr key={i}>
            <td>{item.name}</td>
            <td>{item.id}</td>
            <td>{item.description}</td>
            <td>
              <EditModal>
                <ItemForm item={item} callback={updateList} />
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
export default ViewItems;
