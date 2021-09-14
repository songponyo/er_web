import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import moment from "moment";
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
import { useHistory } from "react-router-dom";
import { TimeController } from "../../../controller";
import { Select } from "../../../component/revel-strap";

import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const time_controller = new TimeController();

export default function Insert() {
  let history = useHistory();
  const [userselect, setUserselect] = useState([]);
  const [subject, setSubject] = useState([]);
  const [time, setTime] = useState({
    time_start: "",
    time_end: "",
  });
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_password: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    classgroup_time_start: "",
    classgroup_time_end: "",
    user_fullname: "",
    leave_maxcount: "",
    max_score: "",
    addby: "",
  });
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timer_start = moment(
      `${moment().format("YYYY-MM-DD")} ${classroom.classgroup_time_start}`,
      "YYYY-MM-DD HH:mm"
    );

    let timer_end = moment(
      `${moment().format("YYYY-MM-DD")} ${classroom.classgroup_time_end}`,
      "YYYY-MM-DD HH:mm"
    );
    let classrooma = {};
    classrooma.time_start = timer_start._i;
    classrooma.time_end = timer_end._i;
    setTime(classrooma);
  }, [classroom.classgroup_time_start, classroom.classgroup_time_end]);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const date = new Date();
    var code = "";
    code =
      "CG" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");

    const class_data = await classgroup_model.getClassgroupMaxCode({
      code: code,
      digit: 4,
    });
    let classform = {};
    classform = { ...classroom };
    classform.classgroup_code = class_data.data;
    classform.addby = user_session.user_code;
    setClassroom(classform);

    const user_data = await user_model.getUserBy({
      user_position_code: "UP002",
    });

    let user_form = user_data.data;
    let select_user = [];
    for (let i = 0; i < user_form.length; i++) {
      select_user.push({
        value: user_form[i].user_code,
        label: user_form[i].user_full_name,
      });
    }
    setUserselect(select_user);

    const subject_data = await subject_model.getSubjectBy({});
    let subject_form = subject_data.data;
    let select_subject = [];
    for (let i = 0; i < subject_form.length; i++) {
      select_subject.push({
        value: subject_form[i].subject_code,
        label:
          "[ " +
          subject_form[i].subject_code +
          " ] " +
          subject_form[i].subject_name_th,
      });
    }
    setSubject(select_subject);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await classgroup_model.insertClassgroup({
        classgroup_code: classroom.classgroup_code,
        classgroup_id: classroom.classgroup_id,
        classgroup_password: classroom.classgroup_password,
        classgroup_number: classroom.classgroup_number,
        subject_code: classroom.subject_code,
        user_code: classroom.user_code,
        max_score: classroom.max_score,
        leave_maxcount: classroom.leave_maxcount,
        classgroup_time_start: time.time_start,
        classgroup_time_end: time.time_end,
        addby: classroom.addby,
        adddate: time_controller.reformatToDate(new Date()),
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/class-group");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด!", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (classroom.subject_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ รายวิชา",
        icon: "warning",
      });
      return false;
    } else if (classroom.classgroup_id === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ กลุ่มเรียน",
        icon: "warning",
      });
      return false;
    } else if (classroom.classgroup_password === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ รหัสผ่าน",
        icon: "warning",
      });
      return false;
    } else if (time.time_start >= time.time_end) {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ เวลาการสอน",
        icon: "warning",
      });
      return false;
    } else if (classroom.user_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ ผู้รับผิดชอบ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setClassroom({ ...classroom, [name]: value });
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน / Class group
        </CCardHeader>
        <CCardBody>
          <CRow>
            <CCol md="3">
              <CLabel>
                รหัสวิชา{" "}
                <font color="#F00">
                  <b>*</b>
                </font>
              </CLabel>
              <Select
                options={subject}
                value={classroom.subject_code}
                onChange={(e) =>
                  setClassroom({
                    ...classroom,
                    [`subject_code`]: e,
                  })
                }
              />
            </CCol>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  กลุ่มเรียน{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="text"
                  name="classgroup_id"
                  value={classroom.classgroup_id}
                  onChange={(e) => _changeFrom(e)}
                />
              </CFormGroup>
            </CCol>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  รหัสผ่านเข้ากลุ่มเรียน{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="text"
                  name="classgroup_password"
                  value={classroom.classgroup_password}
                  onChange={(e) => _changeFrom(e)}
                />
              </CFormGroup>
            </CCol>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  ผู้รับผิดชอบ{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <Select
                  options={userselect}
                  value={classroom.user_code}
                  onChange={(e) =>
                    setClassroom({
                      ...classroom,
                      [`user_code`]: e,
                    })
                  }
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  ห้องเรียน{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="text"
                  name="classgroup_number"
                  value={classroom.classgroup_number}
                  onChange={(e) => _changeFrom(e)}
                  maxlength="6"
                />
                <p className="text-muted">ตัวอย่าง : 18311</p>
              </CFormGroup>
            </CCol>

            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  เวลาเข้าเรียน{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="time"
                  name="classgroup_time_start"
                  value={classroom.classgroup_time_start}
                  onChange={(e) => _changeFrom(e)}
                />
              </CFormGroup>
            </CCol>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  เวลาสิ้นสุด{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="time"
                  name="classgroup_time_end"
                  value={classroom.classgroup_time_end}
                  onChange={(e) => _changeFrom(e)}
                />
              </CFormGroup>
            </CCol>
          </CRow>
          <CRow>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  คะแนนเก็บสูงสุด{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="number"
                  name="max_score"
                  value={classroom.max_score}
                  onChange={(e) => _changeFrom(e)}
                  max="100"
                />
              </CFormGroup>
            </CCol>

            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  จำนวนครั้งที่สามารถขาดได้{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <CInput
                  type="number"
                  name="leave_maxcount"
                  value={classroom.leave_maxcount}
                  onChange={(e) => _changeFrom(e)}
                />
              </CFormGroup>
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
          <Link to="/class-group">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </>
  );
}
