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

export default function Score() {
  let code = useRouteMatch("/class-group/score/:code"); 
  const [score, setScore] = useState({});
  const [sum, setSum] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let score_result = 0;
    score_result =
      (score.score_one || 0) +
      (score.score_two || 0) +
      (score.score_three || 0) +
      (score.score_four || 0) +
      (score.score_five || 0) +
      (score.score_sixt || 0);
    let score_sum = {};
    score_sum.score_total = score_result;
    setSum(score_sum);
  }, [score]);

  const fetchData = async () => {
    let code_form = code.params.code;
    var n = code_form.split("-");
    const score_data = await score_model.getScoreByCode({
      user_uid: n[0],
      table_name: n[1],
    });
    let user_score = {};
    user_score = score_data.data[0];
    user_score.table_name = n[1];
    setScore(user_score);
  };

  async function _handleSubmit() {
    let query_result = await score_model.updateScoreBy({
      leave_count: score.leave_count,
      score_one: score.score_one,
      score_two: score.score_two,
      score_three: score.score_three,
      score_four: score.score_four,
      score_five: score.score_five,
      score_sixt: score.score_sixt,
      score_total: score.score_total,
      table_name: score.table_name,
      user_uid: score.user_uid,
      user_firstname: score.user_firstname,
      user_lastname: score.user_lastname,
      user_status: score.user_status,
    });
    if (query_result.require) {
      Swal.fire("บันทึกเรียบร้อย", "", "success"); 
    } else {
      Swal.fire("ขออภัย มีบางอย่างผิดพลาด!", "", "error");
    }
  }

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setScore({ ...score, [name]: parseInt(value) });
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
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 2 <br />
              <CInput
                type="number"
                name="score_two"
                value={score.score_two}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 3 <br />
              <CInput
                type="number"
                name="score_three"
                value={score.score_three}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 4 <br />
              <CInput
                type="number"
                name="score_four"
                value={score.score_four}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 5 <br />
              <CInput
                type="number"
                name="score_five"
                value={score.score_five}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนช่องที่ 6 <br />
              <CInput
                type="number"
                name="score_sixt"
                value={score.score_sixt}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              จำนวนครั้งที่ลา <br />
              <CInput
                type="number"
                name="leave_count"
                value={score.leave_count}
                onChange={(e) => _changeFrom(e)}
                max="100"
              />
            </CCol>
            <CCol md="2">
              คะแนนรวมทั้งหมด <br />
              <CInput
                type="number"
                name="score_total"
                value={sum.score_total}
                onChange={(e) => _changeFrom(e)}
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
          <Link to="/class-group/detail/">
            <CButton type="button" color="danger"> ย้อนกลับ </CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
