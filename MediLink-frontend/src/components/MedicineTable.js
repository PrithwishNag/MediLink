import React, { useEffect, useState } from "react";
import { Table } from "react-bootstrap";

const MedicineTable = () => {
  return (
    <div>
      <div className="mb-2">Details of Patient medication are mentioned below</div>
      <Table striped bordered hover id="MedicineTable">
        <thead>
          <tr>
            <th>S.no</th>
            <th>Medication Name</th>
            <th>Morning</th>
            <th>Afternoon</th>
            <th>Evening</th>
            <th>SOS</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1</td>
            <td id="Medicine1">Paracetamol</td>
            <td>Y</td>
            <td>Y</td>
            <td>Y</td>
            <td>NA</td>
          </tr>
          <tr>
            <td>2</td>
            <td id="Medicine2">Naxdom 500</td>
            <td>NA</td>
            <td>NA</td>
            <td>NA</td>
            <td>Y</td>
          </tr>
          <tr>
            <td>3</td>
            <td id="Medicine3">Tryptomer 10</td>
            <td>NA</td>
            <td>NA</td>
            <td>Y</td>
            <td>NA</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default MedicineTable;
