import React, { useState, useEffect } from "react";
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
import { Select } from "../../../component/revel-strap";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { TimeController } from "../../../controller";
import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const time_controller = new TimeController();

export default function Update() {
  let history = useHistory();
  let code = useRouteMatch("/class-group/update/:code");
  const [user, setUser] = useState([]);
  const [subject, setSubject] = useState([]);
  const [userselect, setUserselect] = useState([]);
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    addby: "",
  });

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });
    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      history.push("/class-group");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      history.push("/classgroup-group");
    } else {
      let room = {};
      room = class_group.data[0];
      room.classgroup_time_start = time_controller.reformatToTime(
        room.classgroup_time_start
      );
      room.classgroup_time_end = time_controller.reformatToTime(
        room.classgroup_time_end
      ); 
      await setClassroom(room);
    }

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
        classgroup_number: classroom.classgroup_number,
        subject_code: classroom.subject_code,
        user_code: classroom.user_code,
        addby: classroom.user_code,
        adddate: time_controller.reformatToDate(new Date()),
      });
      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/class-group");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (classroom.subject_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "Please Check Your subject_code ",
        icon: "warning",
      });
      return false;
    } else if (classroom.user_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "Please Check Your user_code",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classroom };
    new_data[name] = value;
    setClassroom(new_data);
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
