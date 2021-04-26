import React, { useState, useEffect } from "react";
import GLOBAL from "../../../GLOBAL";
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
import { useHistory } from "react-router-dom";
import { TimeController } from "../../../controller";
import { Select } from "../../../component/revel-strap";

import SubjectModel from "../../../models/SubjectModel"
import ClassgroupModel from "../../../models/ClassgroupModel"
import UserModel from "../../../models/UserModel"

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const time_controller = new TimeController();


export default function Insert() {
  let history = useHistory();
  const [user, setUser] = useState([]);
  const [userselect, setUserselect] = useState([])
  const [subject, setSubject] = useState([]);
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    user_fullname: "",
    leave_maxcount: "",
    max_score: "",
    addby: ""
  })

  useEffect(() => {
    fetchData();
  }, []);
  //  console.log("classroom",classroom);
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
    let classform = {}
    classform.classgroup_code = class_data.data
    classform.addby = user_session.user_code
    setClassroom(classform);

    const user_data = await user_model.getUserBy({
      user_position_code: "UP002"
    }) 
    setUser(user_data.data)

    let user_form = user_data.data;
    let select_user = [];
    for (let i = 0; i < user_form.length; i++) {
      select_user.push({
        value: user_form[i].user_code,
        label: user_form[i].user_full_name,
      });
    }
    setUserselect(select_user)

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
        max_score: classroom.max_score,
        leave_maxcount: classroom.leave_maxcount,
        addby: classroom.addby,
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
        title: "Warning!",
        text: "Please Check Your subject_code ",
        icon: "warning",
      });
      return false;
    } else
      if (classroom.user_code === "") {
        Swal.fire({
          title: "Warning!",
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

  // const findArray = (data, key, keyword) => {
  //   if (Array.isArray(data)) {
  //     let res = data.find((item, idx) => {
  //       return item[key] == keyword;
  //     });
  //     return res;
  //   } else {
  //     for (let i in data) {
  //       if (data[i][key] == keyword) {
  //         let resArr = data[i][key];
  //         return resArr;
  //       }
  //     }
  //   }
  // };


  // const _changeInSelect = (e, value) => { 
  //   switch (value) {
  //     case "user_code":
  //       let user_names = findArray(userselect, "value", e);
  //       console.log("user_names",user_names);
  //       setClassroom({
  //         ...classroom,
  //         user_code: user_names.value,
  //         user_fullname: user_names.label
  //       });
  //       break;
  //   }
  // }; 
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
            <Link to="/class-group">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
