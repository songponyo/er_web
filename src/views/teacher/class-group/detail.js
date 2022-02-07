import React, { useState, useEffect } from "react";
import { Empty } from "antd";
import * as XLSX from "xlsx";
import { Table } from "react-bootstrap";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CButton,
  CImg,
} from "@coreui/react";
import { useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faTrash } from "@fortawesome/free-solid-svg-icons";
import ClassgroupModel from "../../../models/ClassgroupModel";
import ScoreModel from "../../../models/ScoreModel";
import TopicModel from "../../../models/TopicModel";

const topic_model = new TopicModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();

export default function Detail() {
  let code = useRouteMatch("/class-group/detail/:code");
  const [classgroup, setClassgroup] = useState([]);
  const [topics, setTopics] = useState([]);
  const [score, setScore] = useState([]);
  const [files, setFiles] = useState({ data: [], score_user: [] });
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);
 
  useEffect(() => {
    if (classgroup.length !== 0) {
      let arr_score = [];
      let comp = [];
      let arr_sc = [];
      classgroup.map((data, idx) => {
        arr_score.push({
          user_uid: data.user_uid,
          user_full_name: data.user_full_name,
          leave_maxcount: data.leave_maxcount
        });

        let sc = score
          .filter((scores) => scores.user_uid === data.user_uid)
          .map((tc) => {
            // console.log("gg");
            return tc.score_value;
          });
        // console.log("sc",sc);
        // comp[idx] = { ...arr_score[idx], ...sc };
        arr_sc[idx] = sc;
        // console.log("arr_sc", arr_sc);
        comp[idx] = { ...arr_score[idx] };
      });

      setFiles({ data: comp, score_user: arr_sc });

      // console.log("arr_score", comp);
    }
  }, [score]);

  async function fetchData() {
    let class_code = code.params.code;
    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: class_code,
    });
    const topic_data = await topic_model.getTopicByClassCode({
      classgroup_code: class_code,
    });
    setTopics(topic_data.data);

    const score_group = await score_model.getScoreByCode({
      table_name: class_group.data[0].classgroup_table_score,
    });

    let score_info = {};
    score_info = score_group.data;
    score_info.table_name = class_group.data[0].classgroup_table_score;
    score_info.leave_maxcount = class_group.data[0].leave_maxcount
    setClassgroup(score_info);

    const score_user = await score_model.getScoreByGroup({
      classgroup_code: class_code,
      table_name: class_group.data[0].classgroup_table_score,
    });

    setScore(score_user.data);

    setIsLoading(true);
    // let column = [...columns];
    // for (let i = 0; i < topic_data.data.length; i++) {
    //   let n = i + 1;
    //   column[column.length] = {
    //     title: topic_data.data[i].topic_name,
    //     width: 50,
    //     dataIndex: "score_" + n,
    //     key: "score_" + n,
    // };
  }

  const exportToCSV = () => {
    let Heading = [["รหัสประจำตัว", "ชื่อ-นามสกุล", "จำนวนครั้งที่ขาด "+"("+ classgroup.leave_maxcount + ")"]];
    topics.map((data) => {
      Heading[0].push(data.topic_name + "(" + data.max_score + ")");
    });
    //Had to create a new workbook and then add the header
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet([]);

    XLSX.utils.sheet_add_aoa(ws, Heading);

    //Starting in the second row to avoid overriding and skipping headers
    XLSX.utils.sheet_add_json(ws, files.data, {
      origin: "A2",
      skipHeader: true,
    });

    XLSX.utils.sheet_add_json(ws, files.score_user, {
      origin: "D2",
      skipHeader: true,
    });

    XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    XLSX.writeFile(wb, "รายชื่อนักศึกษา.xlsx");
  };

  function _onDelete(data) {
    Swal.fire({
      title: "ยืนยัน",
      text: "ต้องการลบรายการนี้ใช่หรือไม่",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        score_model
          .deleteScoreByCode({
            user_uid: data,
            table_name: classgroup.table_name,
            classgroup_code: code.params.code,
          })
          .then((res) => {
            if (res.require) {
              Swal.fire("ลบรายการ เรียบร้อย", "", "success");
              window.location.reload();
            } else {
              Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  return (
    <>
      {!isLoading ? (
        <div align="center">
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </div>
      ) : (
        <CCard>
          <CCardHeader className="header-t-red">
            รายชื่อ
            <Link
              to={`/class-group/excel/${code.params.code}`}
              className="btn btn-success float-right"
            >
              <i className="fa fa-plus" aria-hidden="true"></i>{" "}
              นำเข้ารายชื่อด้วย Excel
            </Link>
            {/* <Link
            to={`/class-group/adduser`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายชื่อ
          </Link> */}
          </CCardHeader>
          {score.length !== 0 ? (
            <CCardBody>
              <Table striped bordered hover responsive>
                <thead>
                  <tr>
                    <th class=" tp-first-col">รหัสประจำตัว</th>
                    <th class=" tp-second-col">ชื่อ - นามสกุล</th>
                    <th class=" tp-second-col">จำนวนครั้งที่ลา</th>
                    {topics.map((data) => {
                      return (
                        <>
                          <th style={{ textAlign: "center" }}>
                            {data.topic_name} ({data.max_score})
                          </th>
                        </>
                      );
                    })}
                    <th style={{ width: "220px" }}>
                      <center>จัดการ </center>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {classgroup.map((data) => {
                    return (
                      <tr>
                        <td>{data.user_uid}</td>
                        <td>{data.user_full_name}</td>
                        <td>{data.leave_maxcount}</td>
                        {score
                          .filter((scores) => scores.user_uid === data.user_uid)
                          .map((topic_score) => {
                            return <td>{topic_score.score_value}</td>;
                          })}
                        <td style={{ textAlign: "center" }}>
                          <Link
                            key="score"
                            to={`/class-group/score/${data.user_uid}-${classgroup.table_name}`}
                            title="แก้ไขรายการ"
                          >
                            <button type="button" className="btn btn-primary">
                              <FontAwesomeIcon
                                icon={faEdit}
                                size="5s"
                                color="white"
                              />
                              แก้ไข
                            </button>
                          </Link>
                          <CButton
                            type="button"
                            className="btn btn-danger"
                            onClick={() => _onDelete(data.user_uid)}
                          >
                            <FontAwesomeIcon
                              icon={faTrash}
                              size="5s"
                              color="white"
                            />
                            {"  "}ลบรายการ
                          </CButton>
                          {/* <button type="button" className="btn btn-danger">
                        <FontAwesomeIcon
                          icon={faTrash}
                          size="5s"
                          color="white"
                        />  ลบ
                      </button> */}
                        </td>
                      </tr>
                    );
                  })}
                  {/* {classgroup.map((data, index) => {
                return (
                  <tr>
                    <td>{data.user_uid}</td>
                    <td>{data.user_full_name}</td>
                  </tr>
                );
              })} */}
                </tbody>
              </Table>
              {/* <Table
            dataSource={classgroup}
            scroll={{ x: 1500, y: 450 }}
            columns={columns}
          /> */}
            </CCardBody>
          ) : (
            <CCardBody>
              <Empty></Empty>
            </CCardBody>
          )}

          <CCardFooter>
            <CButton color="success" onClick={() => exportToCSV()}>
              Export .CSV
            </CButton>
            <Link to={`/class-group`}>
              <CButton type="button" color="danger">
                {" "}
                ย้อนกลับ{" "}
              </CButton>
            </Link>
          </CCardFooter>
        </CCard>
      )}
    </>
  );
}
