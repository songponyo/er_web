import React, { useState, useEffect } from "react";
// import ExcelPage from "../../../component/excelPage";
// import ExcelPage from "../../../component/excelPaget";
import { ExcelRenderer } from "react-excel-renderer";
import "antd/dist/antd.css";
import { Table, Upload, Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CRow,
  CCol,
} from "@coreui/react";
import Swal from "sweetalert2";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import ClassgroupModel from "../../../models/ClassgroupModel";
import TopicModel from "../../../models/TopicModel";
import ScoreModel from "../../../models/ScoreModel";

const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();
const topic_model = new TopicModel();

export default function Update() {
  let history = useHistory();
  let code = useRouteMatch("/class-group/excel/:code");
  const [score, setScore] = useState({});
  const [row, setRow] = useState({ rows: [] });
  const [top_row, setTop_row] = useState([]);
  const [topics, setTopics] = useState({ topic: [], tablename: "" });
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

  useEffect(() => {
    if (row.rows.length !== 0) {
      AddTopics();
    }
  }, [row]);

  async function fetchData() {
    const topic_data = await topic_model.getTopicByClassCode({
      classgroup_code: code.params.code,
    });

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });

    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      history.push("/class-group");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      history.push("/class-group");
    } else {
      let topics_info = {};
      topics_info.topic = topic_data.data;
      topics_info.tablename = class_group.data[0].classgroup_table_score;
      setTopics(topics_info);
    }

    const score_last = await score_model.getScoreLastCode({});
    let score_info = {};
    score_info.code = score_last.data;
    score_info.last_code = 0;
    setScore(score_info);
  }

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
    let topic_arr = [];
    let sum = 0;
    let last = score.code.replace("SC", "");
    let last_score = parseInt(last) - 1;
    row.rows.map((data, index) => {
      topics.topic.map((topic, idx) => { 
        sum = sum + 1;
        let result = sum + last_score;
        let max_code = "SC" + result.toString().padStart(3, "0");
        topic_arr.push({
          classgroup_code: topic.classgroup_code,
          max_score: topic.max_score,
          score_value: 0,
          topic_code: topic.topic_code,
          topic_name: topic.topic_name,
          score_code: max_code,
          user_uid: data.user_uid,
        });
      });
    }); 
    setTop_row(topic_arr);
    return true;
  };

  const handleSubmit = async () => {
    const query_result = await score_model.insertScore({
      table_name: topics.tablename,
      excel_row: row.rows,
      score_row: top_row,
      user_status: "Not active",
      classgroup_code: code.params.code,
    });
    if (query_result.require) {
      Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success" });
      history.push("/class-group");
    } else {
      Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error" });
    }
  };

  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อนำเข้าจากเอกสาร Excel
        </CCardHeader>
        <CCardBody>
          {/* <ExcelPage data={classroom} /> */}
          <CRow>
            <CCol md="12">
              <Upload
                name="file"
                beforeUpload={fileHandler}
                onRemove={() => setRow({ rows: [] })}
                multiple={false}
              >
                {/* <CButton>
                  <Icon type="UploadOutlined" /> อัปโหลดไฟล์
                </CButton>
                <p className="text-muted">นามสกุลไฟล์ .xlms</p> */}
                <Button icon={<UploadOutlined />}>อัปโหลดไฟล์</Button>
                <p className="text-muted">นามสกุลไฟล์ .xlms</p>
              </Upload>
            </CCol>
            <CCol md="12">
              <div style={{ marginTop: 20 }}>
                {row.rows.length !== 0 ? (
                  <Table dataSource={row.rows} columns={columns} />
                ) : (
                  <></>
                )}
              </div>
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          {row.rows.length != 0 ? (
            <>
              <CButton color="btn btn-primary" onClick={() => handleSubmit()}>
                บันทึกข้อมูล
              </CButton>
            </>
          ) : (
            <></>
          )}

          <Link to="/class-group">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
