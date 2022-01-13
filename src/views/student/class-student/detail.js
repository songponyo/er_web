import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
} from "@coreui/react";
import Swal from "sweetalert2";

import {useRouteMatch } from "react-router-dom";
import ScoreModel from "../../../models/ScoreModel";
import TopicModel from "../../../models/TopicModel";

const topic_model = new TopicModel();
const score_model = new ScoreModel();

export default function Detail() { 
  let code = useRouteMatch("/class-student/detail/:code");
  const [user_score, setUser_score] = useState({
    user_firstname: "",
    user_full_name: "",
    user_lastname: "",
    user_status: "",
    user_uid: "",
  });

  const [classgroup, setClassgroup] = useState({});
  const [sum, setSum] = useState({});
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const score_result = topics
      .map((item) => item.score_value)
      .reduce((prev, curr) => prev + (curr || 0), 0);
    setSum(score_result);
  }, [topics]);

  const fetchData = async () => {
    let code_form = code.params.code;
    var n = code_form.split("-");
    let cg = n[1].replace("tb_score_", "");

    const user_data = await score_model.getScoreByCode({
      user_uid: n[0],
      table_name: n[1],
    });

    setUser_score(user_data.data[0]);
    setClassgroup({ classgroup_code: cg });

    // if (score_data.data.length === 0) {
    //   let user_score = {};
    //   user_score = score_data.data[0];
    //   user_score.table_name = n[1];
    //   setScore(user_score);
    // } else {
    //   Swal.fire("ยังไม่มีการลงทะเบียน", "", "info").then((result) => {
    //     if (result) {
    //       let url = "/class-group/detail/" + cg;
    //       history.push(url);
    //     }
    //   });
    // }

  

    const score_data = await score_model.getScoreByUser({
      user_uid: n[0],
      classgroup_code: cg,
    }); 
    // let last = score_last.data.replace("SC", "");

    // let topic_info = topic_data.data;
    // let topic_arr = [];
    // for (let i = 0; i < topic_info.length; i++) {
    //   let last_score = parseInt(last) + i;
    //   let max_code = last_score.toString().padStart(3, "0");
    //   topic_arr.push({
    //     classgroup_code: topic_info[i].classgroup_code,
    //     max_score: topic_info[i].max_score,
    //     topic_code: topic_info[i].topic_code,
    //     topic_name: topic_info[i].topic_name,
    //     score_code: "SC".concat(max_code),
    //     score_name: topic_info[i].topic_name,
    //     score_value: 0,
    //   });
    // }

    setTopics(score_data.data);
  };

  async function _handleSubmit() {
    
    let query_result = await score_model.updateScoreBy({
      user_uid: user_score.user_uid,
      score_row: topics,
    });
    if (query_result.require) {
      Swal.fire("บันทึกเรียบร้อย", "", "success");
    } else {
      Swal.fire("ขออภัย มีบางอย่างผิดพลาด!", "", "error");
    }
  }

  // const ChangeArray = (e, index) => {
  //   const proper = e.target.name;
  //   let newArr = [...topics];
  //   if (proper === "score_value") {
  //     let max_score = newArr[index]["max_score"]; 
  //     let sum = parseInt(e.target.value);
  //     if (max_score < sum) {
  //       Swal.fire(
  //         "คุณใส่คะแนนมากเกินคะแนนเต็ม",
  //         "คะแนนสูงสุดคือ  " + max_score,
  //         "warning"
  //       ).then((result) => {
  //         if (result.isConfirmed) {
  //           newArr[index][proper] = 0;
  //           setTopics(newArr);
  //         }
  //       });
  //     } else {
  //       newArr[index][proper] = sum || "";
  //       setTopics(newArr);
  //     }
  //   } else {
  //     newArr[index][proper] = e.target.value;
  //     setTopics(newArr);
  //   }
  // };

  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardHeader className="header-t-red">ตารางคะแนนนักศึกษา</CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="8">
              <CRow>
                <CCol md="12">
                  <CFormGroup>
                    <CLabel style={{ fontSize: "large" }}>
                      รหัสประจำตัว
                      <font color="#F00">
                        <b> : </b>
                      </font>
                      {user_score.user_uid}
                    </CLabel>
                  </CFormGroup>
                </CCol>
                <CCol md="12">
                  <CFormGroup>
                    <CLabel style={{ fontSize: "large" }}>
                      ชื่อ
                      <font color="#F00">
                        <b> : </b>
                      </font>
                      {user_score.user_full_name}
                    </CLabel>
                  </CFormGroup>
                </CCol>
                <CCol md="12">
                  <CFormGroup>
                    <CLabel style={{ fontSize: "large" }}>
                      สถานะ
                      <font color="#F00">
                        <b> : </b>
                      </font>
                      {user_score.user_status !== "Not active"
                        ? "เป็นสมาชิก"
                        : "ไม่เป็นสมาชิก"}
                    </CLabel>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow>
            {topics.map((data, index) => {
              return (
                <>
                  <CCol md="2">
                    {data.topic_name} <br />
                    <CInput
                      type="number"
                      min="0"
                      placeholder="0"
                      value={data.score_value}
                      name="score_value"
                      // onChange={(e) => ChangeArray(e, index)}
                      readOnly
                    />
                  </CCol>
                </>
              );
            })}
          </CRow>
          <CRow>
            <CCol md="2">
              คะแนนรวมทั้งหมด <br />
              <CInput type="number" name="sum" value={sum} max="100" readOnly />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          {/* <CButton
            type="submit"
            color="success"
            onClick={() => _handleSubmit()}
          >
            บันทึก
          </CButton> */}
          <Link to={`/class-student`}>
            <CButton type="button" color="danger">
              {" "}
              ย้อนกลับ{" "}
            </CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
