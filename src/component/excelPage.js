import React, { Component } from "react";
import "antd/dist/antd.css";
import { Table, Button, Popconfirm, Row, Col, Upload } from "antd";
import Icon from '@ant-design/icons';
import { ExcelRenderer } from "react-excel-renderer";
import { EditableFormRow, EditableCell } from "../utility/editable";
import Swal from "sweetalert2";
import ScoreModel from "../models/ScoreModel"
import { Link, useHistory, useRouteMatch } from "react-router-dom";


const score_model = new ScoreModel();
export default class ExcelPage extends Component {

  constructor(props) { 
    super(props);
    this.state = {
      cols: [],
      rows: [],
      errorMessage: null,
      columns: [
        {
          title: "รหัสนักศึกษา",
          dataIndex: "user_username",
          editable: true
        },
        {
          title: "ชื่อ",
          dataIndex: "user_firstname",
          editable: true
        },
        {
          title: "นามสกุล",
          dataIndex: "user_lastname",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 1",
          dataIndex: "score_one",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 2",
          dataIndex: "score_two",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 3",
          dataIndex: "score_three",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 4",
          dataIndex: "score_four",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 5",
          dataIndex: "score_five",
          editable: true
        },
        {
          title: "คะแนนชื่อที่ 6",
          dataIndex: "score_sixt",
          editable: true
        },
        {
          title: "จำนวนครั้งทั้ลากิจ",
          dataIndex: "leave_count",
          editable: true
        },
        {
          title: "คะแนนทั้งหมด",
          dataIndex: "score_total",
          editable: true
        },
        {
          title: "การจัดการ",
          dataIndex: "action",
          render: (text, record) =>
            this.state.rows.length >= 1 ? (
              <Popconfirm
                title="Sure to delete?"
                onConfirm={() => this.handleDelete(record.key)}
              >
                <Icon
                  type="delete"
                  theme="filled"
                  style={{ color: "red", fontSize: "20px" }}
                />
              </Popconfirm>
            ) : null
        }
      ]

    };

  }

  componentDidUpdate() {
    // console.log("this", this.props.data.classgroup_table_score);
  }


  handleSave = row => {
    const newData = [...this.state.rows];
    const index = newData.findIndex(item => row.key === item.key);
    const item = newData[index];
    newData.splice(index, 1, {
      ...item,
      ...row
    });
    this.setState({ rows: newData });
  };

  checkFile(file) {
    let errorMessage = "";
    if (!file || !file[0]) {
      return;
    }
    const isExcel =
      file[0].type === "application/vnd.ms-excel" ||
      file[0].type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    if (!isExcel) {
      errorMessage = "You can only upload Excel file!";
    }
    console.log("file", file[0].type);
    const isLt2M = file[0].size / 1024 / 1024 < 2;
    if (!isLt2M) {
      errorMessage = "File must be smaller than 2MB!";
    }
    console.log("errorMessage", errorMessage);
    return errorMessage;
  }

  fileHandler = fileList => {
    console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      this.setState({
        errorMessage: "No file uploaded!"
      });
      return false;
    }
    console.log("fileObj.type:", fileObj.type);
    if (
      !(
        fileObj.type === "application/vnd.ms-excel" ||
        fileObj.type ===
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      )
    ) {
      this.setState({
        errorMessage: "Unknown file format. Only Excel files are uploaded!"
      });
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        console.log(err);
      } else {
        let newRows = [];
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            newRows.push({
              key: index,
              user_username: row[0],
              user_firstname: row[1],
              user_lastname: row[2],
              score_one: row[3],
              score_two: row[4],
              score_three: row[5],
              score_four: row[6],
              score_five: row[7],
              score_sixt: row[8],
              leave_count: row[9],
              score_total: row[10]
            });
          }
        });
        if (newRows.length === 0) {
          this.setState({
            errorMessage: "No data found in file!"
          });
          return false;
        } else {
          this.setState({
            cols: resp.cols,
            rows: newRows,
            errorMessage: null
          });
        }
      }
    });
    return false;
  };

  handleSubmit = async () => {
    console.log("submitting: ", this.state.rows);
    //submit to API
    //if successful, banigate and clear the data
    //this.setState({ rows: [] })

    const query_result = await score_model.insertScore({
      table_name: this.props.data.classgroup_table_score,
      row: this.state.rows
    });

    this.setState(
      {
        loading: false,
        rows: []
      },
      () => {
        if (query_result.require) {
          Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success" });
          this.props.history.push("/class-group/");
        } else {
          Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error" });
        }
      }
    );

  };

  handleDelete = key => {
    const rows = [...this.state.rows];
    this.setState({ rows: rows.filter(item => item.key !== key) });
  };
  handleAdd = () => {
    const { count, rows } = this.state;
    const newData = {
      key: count,
      name: "User's name",
      age: "22",
      gender: "Female"
    };
    this.setState({
      rows: [newData, ...rows],
      count: count + 1
    });
  };

  render() {
    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell
      }
    };
    const columns = this.state.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          editable: col.editable,
          dataIndex: col.dataIndex,
          title: col.title,
          handleSave: this.handleSave
        })
      };
    });
    return (
      <>
        <Row gutter={16}>
          <Col
            span={8}
            align="right"
            style={{ display: "flex", justifyContent: "space-between" }}
          >
            {this.state.rows.length > 0 && (
              <><center>
                {/* <Button
                  onClick={this.handleAdd}
                  // size="large"
                  type="info"
                  style={{ marginBottom: 16 }}
                >
                  <Icon type="plus" />
                  เพิ่มรายชื่อ
                </Button>{" "} */}
                <Button
                  onClick={this.handleSubmit}
                  // size="large"
                  type="primary"
                  style={{ marginBottom: 16, marginLeft: 10 }}
                >
                  บันทึกข้อมูล
                </Button>
              </center>
              </>
            )}
          </Col>
        </Row>
        <div>
          <Upload
            name="file"
            beforeUpload={this.fileHandler}
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
            rowClassName={() => "editable-row"}
            dataSource={this.state.rows}
            columns={columns}
          />
        </div>
      </>
    );
  }
}
