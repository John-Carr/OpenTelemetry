import React from "react";
import Table from "react-bootstrap/Table";

function Status(props) {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <td colSpan="2">{props.item.title}</td>
        </tr>
      </thead>
      <tbody>
        {props.item.values.map((item, i) => (
          <tr key={i}>
            <td>{item[0]}</td>
            <td>{item[1]}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
export default Status;
