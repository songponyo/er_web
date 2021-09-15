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
import { useRouteMatch } from "react-router-dom";
import ScoreModel from "../../../models/ScoreModel";

const score_model = new ScoreModel();

export default function Detail() {
  let code = useRouteMatch("/class-student/detail/:code");
  const [score, setScore] = useState({});
  const [sum, setSum] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let score_result = 0;
    let leave_count = 0;
    score_result =
      (score.score_one || 0) +
      (score.score_two || 0) +
      (score.score_three || 0) +
      (score.score_four || 0) +
      (score.score_five || 0) +
      (score.score_sixt || 0);
    let score_sum = {};

    leave_count = score.Max_leave - leave_count;
    score_sum.score_total = score_result;
    score_sum.max_leave = leave_count;

    setSum(score_sum);
  }, [score]);

  const fetchData = async () => {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const score_data = await score_model.getScoreByCode({
      user_uid: user_session.user_uid,
      table_name: code.params.code,
    });
    let user_score = {};
    user_score = score_data.data[0];
    user_score.table_name = code.params.code;
    setScore(user_score);
  };

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
                      {score.user_uid}
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
                      {score.user_full_name}
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
                      {score.user_status ? "เป็นสมาชิก" : "ไม่เป็นสมาชิก"}
                    </CLabel>
                  </CFormGroup>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="2">
              คะแนนช่องที่ 1 <br />
              <CInput
                type="number"
                name="score_one"
                value={score.score_one}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 2 <br />
              <CInput
                type="number"
                name="score_two"
                value={score.score_two}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 3 <br />
              <CInput
                type="number"
                name="score_three"
                value={score.score_three}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 4 <br />
              <CInput
                type="number"
                name="score_four"
                value={score.score_four}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 5 <br />
              <CInput
                type="number"
                name="score_five"
                value={score.score_five}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 6 <br />
              <CInput
                type="number"
                name="score_sixt"
                value={score.score_sixt}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              จำนวนครั้งที่สามารถลาได้ <br />
              <CInput
                type="number"
                name="leave_count"
                value={sum.max_leave}
                readOnly
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนรวมทั้งหมด <br />
              <CInput
                type="number"
                name="score_total"
                value={sum.score_total}
                readOnly
                max="100"
                readOnly
              />
            </CCol>
          </CRow>
        </CCardBody>
        <CCardFooter>
          <Link to="/class-student/detail/">
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
