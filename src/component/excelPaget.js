import React, { useState, useEffect } from "react";
import "antd/dist/antd.css";
import { Table, Upload } from "antd";
import Icon from "@ant-design/icons";
import { ExcelRenderer } from "react-excel-renderer";
import { CRow, CCol, CButton } from "@coreui/react";
import Swal from "sweetalert2";
import ScoreModel from "../models/ScoreModel";

const score_model = new ScoreModel();
export default function ExcelPaget(props) {
  const [topics, setTopics] = useState([]);
  const [classgroup, setClassgroup] = useState()
  const [top_row, setTop_row] = useState([]);
  const [score, setScore] = useState({});
  const [row, setRow] = useState({ rows: [] });
  const [columns] = useState([
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
    fetchData();
  }, []);

  const fetchData = async () => {
    const score_last = await score_model.getScoreLastCode({});
    setScore(score_last.data);

    let topic_arr = props.data.topic_info;
    setTopics(topic_arr);
  };

  const fileHandler = (fileList) => {
    let newRows = [];
    // console.log("fileList", fileList);
    let fileObj = fileList;
    if (!fileObj) {
      // alert("No file uploaded!");
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
      alert("Unknown file format. Only Excel files are uploaded!");
      return false;
    }
    //just pass the fileObj as parameter
    ExcelRenderer(fileObj, (err, resp) => {
      if (err) {
        // console.log(err);
      } else {
        let rowone = "";
        resp.rows.slice(1).map((row, index) => {
          if (row && row !== "undefined") {
            try {
              rowone = row[0].trim();
              newRows.push({
                key: index,
                user_uid: rowone.replace("-", ""),
                user_firstname: row[1],
                user_lastname: row[2],
              });
            } catch { 
              window.location.reload();
            }
          }
        });
        if (newRows.length === 0) {
          alert("ไม่พบข้อมูลในไฟล์");
          return false;
        } else {
          setRow({
            cols: resp.cols,
            rows: newRows,
          });
        }
      }
    });
    return false;
  };

  const AddTopics = async () => { 
    let last = score.replace("SC", "");
    let topic_arr = [];
    let sum = 0;
    row.rows.map((data, index) => {
      topics.map((topic, idx) => {
        let last_score = parseInt(last) + sum;
        let max_code = last_score.toString().padStart(3, "0");
        sum = sum + 1;
        topic_arr.push({
          classgroup_code: topic.classgroup_code,
          max_score: topic.max_score,
          score_value: 0,
          topic_code: topic.topic_code,
          topic_name: topic.topic_name,
          score_code: "SC" + max_code,
          user_uid: data.user_uid,
        });
      });
    });
    setTop_row(topic_arr);
    console.log("topic_arr", topic_arr);
    return true;
  };

  const handleSubmit = async () => {
    // if (AddTopics()) { 
      const query_result = await score_model.insertScore({
        table_name: classgroup.classgroup_table_score,
        excel_row: row.rows,
        row: top_row,
        user_status: "Not active",
        classgroup_code: classgroup.classgroup_code,
      });
      if (query_result.require) {
        Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success" });
      } else {
        Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error" });
        // window.location.reload();
      }
    // }
  };

  return (
    <>
      <CRow gutter={16}>
        <CCol
          span={8}
          align="right"
          style={{ display: "flex", justifyContent: "space-between" }}
        >
          {row.rows.length != 0 ? (
            <>
              <CButton onClick={() => handleSubmit()} color="primary">
                บันทึกข้อมูล
              </CButton>
            </>
          ) : (
            <></>
          )}
        </CCol>
      </CRow>
      <CRow>
        <CCol md="12">
          <Upload
            name="file"
            beforeUpload={fileHandler}
            onRemove={() => setRow({ rows: [] })}
            multiple={false}
          >
            <CButton>
              <Icon type="upload" /> อัปโหลดไฟล์
            </CButton>
            <p className="text-muted">นามสกุลไฟล์ .xlms</p>
          </Upload>
        </CCol>
        <CCol md="12">
          <div style={{ marginTop: 20 }}>
            <Table dataSource={row.rows} columns={columns} />
          </div>
        </CCol>
      </CRow>
    </>
  );
}
