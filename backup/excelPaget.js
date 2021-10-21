import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Table, Button, Row, Col, Upload } from "antd";
import { CButton } from "@coreui/react";
import Icon from "@ant-design/icons";
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../src/utility/editable";
import Swal from "sweetalert2";
import ScoreModel from "../src/models/ScoreModel";

export default function ExcelPaget(props) {
  const [classgroup, setClassgroup] = useState({});
  const [column, setColumn] = useState([
    {
      title: "รหัสนักศึกษา",
      dataIndex: "user_uid",
      editable: false,
    },
    {
      title: "ชื่อ",
      dataIndex: "user_firstname",
      editable: false,
    },
    {
      title: "นามสกุล",
      dataIndex: "user_lastname",
      editable: false,
    },
  ]);

  useEffect(() => {
    console.log("props", props);
  }, []);

  fileHandler = (fileList) => {
    let fileObj = fileList;
    if (!fileObj) {
      // this.setState({
      //   errorMessage: "No file uploaded!",
      // });
      return false;
    }
    // console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      // this.setState({
      //   errorMessage: "Unknown file format. Only Excel files are uploaded!",
      // });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        // console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            let rowone = row[0].trim();
            newRows.push({
              key: index,
              user_uid: rowone.replace("-", ""),
              user_firstname: row[1],
              user_lastname: row[2],
            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!",
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null,
          });
        }
      }
    });
    return false;
  };

  return (
    <>
      <Row gutter={16}>
        <Col
          span={8}
          align="right"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {this.state.rows.length > 0 && (
            <>
              <center>
                <CButton
                  onClick={this.handleSubmit}
                  // size="large"
                  type="primary"
                  style={{ marginBottom: 16, marginLeft: 10 }}
                >
                  บันทึกข้อมูล
                </CButton>
              </center>
            </>
          )}
        </Col>
      </Row>
      <div>
        <Upload
          name="file"
          beforeUpload={fileHandler()}
          onRemove={() => this.setState({ rows: [] })}
          multiple={false}
        >
          <Button>
            <Icon type="upload" /> อัปโหลดไฟล์
          </Button>
          <p className="text-muted">นามสกุลไฟล์ .xlms</p>
        </Upload>
      </div>
      <div style={{ marginTop: 20 }}>
        <Table
          components={components}
          // rowClassName={() => "editable-row"}
          dataSource={this.state.rows}
          columns={columns}
        />
      </div>
    </>
  );
}
