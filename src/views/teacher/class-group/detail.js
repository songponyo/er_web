import React, { useState, useEffect } from "react";
import * as FileSaver from "file-saver";
import * as XLSX from "xlsx";
import { Table, Button } from "react-bootstrap";

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
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import ClassgroupModel from "../../../models/ClassgroupModel";
import ScoreModel from "../../../models/ScoreModel";
import TopicModel from "../../../models/TopicModel";

const topic_model = new TopicModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();

export default function Detail() {
  let code = useRouteMatch("/class-group/detail/:code");
  const [classgroup, setClassgroup] = useState([]);
  // const [columns, setColumns] = useState([
  //   {
  //     title: "รหัสนักศึกษา",
  //     width: 30,
  //     dataIndex: "user_uid",
  //     key: "user_uid",
  //     fixed: "left",
  //   },
  //   {
  //     title: "ชื่อ",
  //     width: 30,
  //     dataIndex: "user_full_name",
  //     key: "user_full_name",
  //     fixed: "left",
  //   },
  // ]);
  const [topics, setTopics] = useState([]);
  const [score, setScore] = useState([]);
  const [files, setFiles] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);
 
  useEffect(() => {
   
    if (classgroup.length !== 0) {
      let arr_score = [];
      let obj_score = {};

      classgroup.map((data) => {
        obj_score.user_full_name = data.user_full_name;
        obj_score.user_uid = data.user_uid;
        let scored = score.filter(
          (scores) => scores.user_uid === data.user_uid
        );
        setFiles(obj_score);
        // console.log("scored",scored);
      });

      // console.log("obj_score", obj_score);
    }
    // let result_score = classgroup.map((data, idx) => {
    //   obj_score.user_uid = data.user_uid;
    //   obj_score.user_full_name = data.user_full_name;
    // });
    // arr_score[0] = obj_score;
    // {
    //   score
    //     .filter((scores) => scores.user_uid === data.user_uid)
    //     .map((topic_score) => {
    //       return <td>{topic_score.score_value}</td>;
    //     });
    // }

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
    setClassgroup(score_info);

    const score_user = await score_model.getScoreByGroup({
      classgroup_code: class_code,
      table_name: class_group.data[0].classgroup_table_score,
    });

    setScore(score_user.data);

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
    let Heading = [["รหัสประจำตัว", "ชื่อ-นามสกุล"]];
    let Afhead = topics.map((data) => {
      return Heading[0].push(data.topic_name + "(" + data.max_score + ")");
    });
    console.log("Heading", Heading);
    // //Had to create a new workbook and then add the header
    // const wb = XLSX.utils.book_new();
    // const ws = XLSX.utils.json_to_sheet([]);
    // XLSX.utils.sheet_add_aoa(ws, Heading);

    // //Starting in the second row to avoid overriding and skipping headers
    // XLSX.utils.sheet_add_json(ws, files, {
    //   origin: "A2",
    //   skipHeader: true,
    // });

    // XLSX.utils.book_append_sheet(wb, ws, "Sheet1");

    // XLSX.writeFile(wb, "filename.xlsx");
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
  const CustomerTable = score.map((cust, index) =>
    CustomerRow(cust, index)
  );

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อ / Name list
          <Link
            to={`/class-group/excel/${code.params.code}`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> นำเข้ารายชื่อด้วย
            Excel
          </Link>
          <Link
            to={`/class-group/adduser`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรายชื่อ
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table striped bordered hover responsive>
            <thead>
              {classgroup.length !== 0 ? (
                <>
                  <tr>
                    <th>รหัสประจำตัว</th>
                    <th>ชื่อ</th>
                    {topics.map((data, index) => {
                      return (
                        <>
                          <th style={{ textAlign: "center" }}>
                            {" "}
                            {data.topic_name} ({data.max_score})
                          </th>
                        </>
                      );
                    })}
                    <th>
                      <center>จัดการ </center>
                    </th>
                  </tr>
                </>
              ) : (
                <>
                  <center>
                    <tr>
                      <CImg src="https://i.pinimg.com/originals/49/e5/8d/49e58d5922019b8ec4642a2e2b9291c2.png" />
                    </tr>
                  </center>
                </>
              )}
            </thead>
            <tbody>
              {classgroup.map((data, index) => {
                return (
                  <tr>
                    <td>{data.user_uid}</td>
                    <td>{data.user_full_name}</td>
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
        <CCardFooter>
          <Link to={`/class-group`}>
            <CButton type="button" color="danger">
              {" "}
              ย้อนกลับ{" "}
            </CButton>
          </Link>
        </CCardFooter>
      </CCard>

      <div>
        <h1>ตัวอย่าง ตาราง Excel สำหรับนำออก</h1>
        <div className="row">
          <div className="col-md-4 center">
            <Button variant="success" onClick={() => exportToCSV()}>
              Export .CSV
            </Button>
          </div>
          <br />
        </div>
        <Table striped bordered hover>
          <thead className="bgvi">
            <tr>
              <th>รหัสประจำตัว</th>
              <th>ชื่อ</th>
              {topics.map((data, index) => {
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
          <tbody>
            {CustomerTable}
            {/* {classgroup.map((data, index) => {
              return (
                <tr>
                  <td>{data.user_uid}</td>
                  <td>{data.user_full_name}</td>
                  {score
                    .filter((scores) => scores.user_uid === data.user_uid)
                    .map((topic_score) => {
                      return <td>{topic_score.score_value}</td>;
                    })}
                </tr>
              );
            })} */}
            //{" "}
          </tbody>
          <tbody></tbody>
        </Table>
      </div>
    </>
  );
}
