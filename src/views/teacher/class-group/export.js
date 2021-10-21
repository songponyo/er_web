import React, { useState, useEffect } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Table, Button } from "react-bootstrap";

export default function Excel(props) { 
  const [topics, setTopics] = useState([]);
  const [files, setFiles] = useState({
    customers: [],
    fileName: "NameList.csv",
  });
  const fileType =
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8";
  const fileExtension = ".csv";

  useEffect(() => {
    let custs = [];
    for (let i = 0; i <= 25; i++) {
      custs.push({
        firstName: `first${i}`,
        lastName: `last${i}`,
        email: `abc${i}@gmail.com`,
        address: `000${i} street city, ST`,
        zipcode: `0000${i}`,
      });
    }
    setFiles({ files, customers: custs });
  }, []);

  const exportToCSV = () => {
    console.log("files.customers", files.customers);
    const ws = XLSX.utils.json_to_sheet(files.customers);
    const wb = { Sheets: { data: ws }, SheetNames: ["data"] };
    console.log("ws", ws);
    // const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "array" });
    // const data = new Blob([excelBuffer], { type: fileType });
    // FileSaver.saveAs(data, "Namelist" + fileExtension);
  };

  const CustomerRow = (customer, index) => {
    return (
      <tr key={index} className="even">
        <td> {index + 1} </td>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.email}</td>
        <td>{customer.address}</td>
        <td>{customer.zipcode}</td>
      </tr>
    );
  };

  const CustomerTable = files.customers.map((cust, index) =>
    CustomerRow(cust, index)
  );
  return (
    <>
      <div className="App">
        <h1>React Export To Excel Example</h1>
        <div className="row">
          <div className="col-md-4 center">
            <Button
              variant="warning"
              onClick={(e) => exportToCSV(files.customers, files.fileName)}
            >
              Export .CSV
            </Button>
          </div>
          <br />
        </div>
        <Table striped bordered hover>
          <thead className="bgvi">
            <tr>
              <th>#</th>
              <th>รหัสประจำตัว</th>
              <th>ชื่อ</th>
              {props.score.map((data) => {
                return (
                  <>
                    <th style={{ textAlign: "center" }}>
                      {" "}
                      {data.topic_name} ({data.max_score})
                    </th>
                  </>
                );
              })}
            </tr>
          </thead>
          <tbody>{CustomerTable}</tbody>
        </Table>
      </div>
    </>
  );
}
