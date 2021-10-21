import React, { useState, useEffect } from "react"; 
import {
  CCard, 
  CCardBody, 
  CContainer,
  CCol,
  CRow,
  CLabel,
  CInput,
  CButton,
  CCardFooter,
} from "@coreui/react";
import Swal from "sweetalert2"; 
import { Link, useHistory, useRouteMatch } from "react-router-dom"; 
import { TimeController } from "../../../controller";
import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";
 
const classgroup_model = new ClassgroupModel(); 
const time_controller = new TimeController();

export default function Register() {
  let history = useHistory(); 
  let code = useRouteMatch("/course-student/register/:code");
  const [user, setUser] = useState([]);
  const [class_validate, setClass_validate] = useState({});
  const [classroom, setClassroom] = useState({
    class_password: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);
    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });
    let class_data = {};
    class_data = class_group.data[0];
    class_data.class_password = "";
    setClassroom(class_data);

    let password_validate = {};
    password_validate = {
      value: class_group.data[0].classgroup_password,
      status: "INVALID",
      class: "",
      text: "โปรดใส่รหัสผ่าน",
    };
    setClass_validate(password_validate);
  }
  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await classgroup_model.registerClass({
        classgroup_code: classroom.classgroup_code,
        user_uid: user.user_uid,
        user_username: user.user_username,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_code: user.user_code,
        user_status: "Active",
        table_name: classroom.classgroup_table_score,
        adddate: time_controller.reformatToDate(new Date()),
      });
      if (query_result.require) {
        Swal.fire("สมัครเสร็จสิ้น", "", "success");
        history.push("/course-student");
      } else {
        Swal.fire("มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }
  const _checkSubmit = () => {
    if (classroom.classgroup_password != classroom.class_password) {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็ครหัสผ่านของคุณ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  async function _checkPassword() {
    const class_password = classroom.class_password.trim();

    if (class_validate.value !== class_password) {
      if (class_password.length === 0) {
        setClass_validate({
          value: class_password,
          status: "INVALID",
          class: "",
          text: "โปรดใส่รหัสผ่าน",
        });
      } else if (class_password.length < 5 || class_password.length > 20) {
        setClass_validate({
          value: class_password,
          status: "INVALID",
          class: "is-invalid",
          text: "รหัสผ่านต้องมีตัวอักษร 5-20 ตัวอักษร",
        });
      } else {
        if (classroom.classgroup_password != class_password) {
          setClass_validate({
            value: class_password,
            status: "INVALID",
            class: "is-invalid",
            text: "รหัสผ่านไม่ถูกต้อง",
          });
        } else {
          setClass_validate({
            value: class_password,
            status: "VALID",
            class: "is-valid",
            text: "",
          });
        }
      }
    }
  }

  const _changeFrom = (e, name) => {
    const { value } = e.target;
    let new_data = { ...classroom };
    new_data[name] = value;
    setClassroom(new_data);
  };

  return (
    <>
      <CContainer
        // className="font-body"
        style={{ width: "30%", paddingTop: "20px" }}
      >
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <CLabel style={{ fontSize: "25px" }}>
                  {classroom.subject_code}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {classroom.subject_name}
                </CLabel>
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }}>อาจารย์ประจำวิชา</CLabel>
                <br />
                <CLabel style={{ fontSize: "16" }}>
                  {classroom.user_fullname}
                </CLabel>
              </CCol>
              <CCol lg="12">
                <br />
                <CInput
                  type="text"
                  value={classroom.class_password}
                  className={class_validate.class}
                  onChange={(e) => _changeFrom(e, "class_password")}
                  onBlur={() => _checkPassword()}
                  required
                  placeholder="รหัสผ่าน"
                />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CContainer>
              <CRow>
                <CCol align="center">
                  <CButton
                    type="button"
                    color="success"
                    size="xs"
                    onClick={() => _handleSubmit()}
                  >
                    สมัครสมาชิก
                  </CButton>
                  <Link to="/course-student">
                    <CButton color="danger">ย้อนกลับ</CButton>
                  </Link>
                </CCol>
              </CRow>
            </CContainer>
          </CCardFooter>
        </CCard>
      </CContainer>
    </>
  );
}
