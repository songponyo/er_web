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
  CImg,
} from "@coreui/react";
import Swal from "sweetalert2";

import { useRouteMatch } from "react-router-dom";
import ScoreModel from "../../../models/ScoreModel";

const score_model = new ScoreModel();

export default function Score() {
  let code = useRouteMatch("/class-group/score/:code");
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
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    fetchData();
    setIsLoading(true);
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
    setClassgroup({ classgroup_code: cg, table_name: n[1] });

    const score_data = await score_model.getScoreByUser({
      user_uid: n[0],
      classgroup_code: cg,
    });

    setTopics(score_data.data);
  };

  async function _handleSubmit() {
    let query_result = await score_model.updateScoreBy({
      user_uid: user_score.user_uid,
      leave_maxcount: user_score.leave_maxcount,
      user_firstname: user_score.user_firstname,
      user_lastname: user_score.user_lastname,
      user_status: user_score.user_status,
      score_row: topics,
      table_name: classgroup.table_name,
    });
    if (query_result.require) {
      Swal.fire("บันทึกเรียบร้อย", "", "success");
    } else {
      Swal.fire("ขออภัย มีบางอย่างผิดพลาด!", "", "error");
    }
  }

  const ChangeArray = (e, index) => {
    const proper = e.target.name;
    let newArr = [...topics];
    if (proper === "score_value") {
      let max_score = newArr[index]["max_score"];
      let sum = parseInt(e.target.value);
      if (max_score < sum) {
        Swal.fire(
          "คุณใส่คะแนนมากเกินคะแนนเต็ม",
          "คะแนนสูงสุดคือ  " + max_score,
          "warning"
        ).then((result) => {
          if (result.isConfirmed) {
            newArr[index][proper] = 0;
            setTopics(newArr);
          }
        });
      } else {
        newArr[index][proper] = sum || "";
        setTopics(newArr);
      }
    } else {
      newArr[index][proper] = e.target.value;
      setTopics(newArr);
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setUser_score({ ...user_score, [name]: value });
  };

  return (
    <div className="animated fadeIn">
      {!isLoading ? (
        <>
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </>
      ) : (
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
              <CCol md="2">
                จำนวนครั้งที่ลา <br />
                <CInput
                  type="number"
                  min="0"
                  placeholder="0"
                  value={user_score.leave_maxcount}
                  name="leave_maxcount"
                  onChange={(e) => _changeFrom(e)}
                />
              </CCol>
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
                        onChange={(e) => ChangeArray(e, index)}
                      />
                    </CCol>
                  </>
                );
              })}
            </CRow>
            <CRow>
              <CCol md="2">
                คะแนนรวมทั้งหมด <br />
                <CInput
                  type="number"
                  name="sum"
                  value={sum}
                  max="100"
                  readOnly
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              color="success"
              onClick={() => _handleSubmit()}
            >
              บันทึก
            </CButton>
            <Link to={`/class-group/detail/${classgroup.classgroup_code}`}>
              <CButton type="button" color="danger">
                {" "}
                ย้อนกลับ{" "}
              </CButton>
            </Link>
          </CCardFooter>
        </CCard>
      )}
    </div>
  );
}
