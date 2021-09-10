import React, { useState, useEffect } from "react";
// import GLOBAL from "../../../GLOBAL";
import ExcelPage from "../../../component/excelPage";

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
import { Modal } from "react-bootstrap";
import { Select } from "../../../component/revel-strap";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Table, Loading } from "../../../component/revel-strap";
import { TimeController } from "../../../controller";
import SubjectModel from "../../../models/SubjectModel"
import ClassgroupModel from "../../../models/ClassgroupModel"
import UserModel from "../../../models/UserModel"

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const time_controller = new TimeController();


export default function Update() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/checkin-teacher/update/:code");
  const [user, setUser] = useState([]);
  const [subject, setSubject] = useState([]);
  const [classgroup, setClassgroup] = useState([])
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    addby: ""
  })

  useEffect(() => {
    fetchData();
  }, []);
  //  console.log("classroom",classroom);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    })

    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      this.props.history.push("/checkin-teacher");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      this.props.history.push("/classgroup-group");
    } else {
      await setClassroom(class_group.data[0]);
    }

    const user_data = await user_model.getUserBy({
      user_position_code: "UP001"
    })
    let user_form = user_data.data;
    let select_user = [];
    for (let i = 0; i < user_form.length; i++) {
      select_user.push({
        value: user_form[i].user_code,
        label: user_form[i].user_full_name,
      });
    }
    setUser(select_user)



    const subject_data = await subject_model.getSubjectBy({});
    let subject_form = subject_data.data;
    let select_subject = [];
    for (let i = 0; i < subject_form.length; i++) {
      select_subject.push({
        value: subject_form[i].subject_code,
        label: "[ " + subject_form[i].subject_code + " ] " + subject_form[i].subject_name_th,
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
        history.push("/checkin-teacher");
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
    } else
      if (classroom.user_code === "") {
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
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            กลุ่มเรียน / Class group
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol >
                <CRow>
                  <CCol md="3">
                    <CLabel>รหัสวิชา <font color="#F00">
                      <b>*</b>
                    </font></CLabel>
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
                        รหัสกลุ่มเรียน
                        {" "}
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
                        ผู้รับผิดชอบ
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <Select
                        options={user}
                        value={classroom.user_fullname}
                        onChange={(e) =>
                          setClassroom({
                            ...classroom,
                            [`user_code`]: e,
                          })
                        }
                        disabled
                      />

                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ห้องเรียน
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="classgroup_number"
                        value={classroom.classgroup_number}
                        onChange={(e) => _changeFrom(e)}
                        
                      />
                      <p className="text-muted">Example :ห้อง 18311</p>
                    </CFormGroup>
                  </CCol>
                </CRow>
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
            <Link to="/checkin-teacher">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
        <CCard>
        <CCardHeader className="header-t-red">
            รายชื่อ / Name list
          </CCardHeader>
          <CCardBody>
            <ExcelPage 
             data={classroom} />
          </CCardBody>
        </CCard>

      </div>
    </div>
  );
}
