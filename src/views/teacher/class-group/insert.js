import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
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
  CForm,
} from "@coreui/react";
import { Table } from "react-bootstrap";
import { Input } from "antd";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { Select } from "../../../component/revel-strap";
import TopicModel from "../../../models/TopicModel";
import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const topic_model = new TopicModel();

export default function Insert() {
  let history = useHistory();
  const [userselect, setUserselect] = useState([]);
  const [subject, setSubject] = useState([]);
  const [timepost, setTimepost] = useState({ time_start: "", time_end: "" });
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
    classgroup_days: "",
  });
  const [topics, setTopics] = useState([
    { id: 1, topic_name: "", max_score: 0, classgroup_code: "" },
  ]);
  const [sum, setSum] = useState();
  const [allsubject, setAllsubject] = useState([]);
  const [dayofweek, setDayofweek] = useState([]);
  const [allclass, setAllclass] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const score_result = topics
      .map((item) => item.max_score)
      .reduce((prev, curr) => prev + (curr || 0), 0);
    setSum(score_result);
  }, [topics]);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setAllclass(classgroup_data.data);

    const topic_data = await topic_model.getTopicByLastCode({});
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
    classform.classgroup_code = class_data.data;
    classform.subject_code = "";
    classform.addby = user_session.user_code;
    classform.user_code = "";
    classform.classgroup_days = "";
    classform.classgroup_id = "";
    classform.classgroup_password = "";
    classform.leave_maxcount = 0;
    setClassroom(classform);
    let arr_form = [
      {
        topic_code: topic_data.data,
        topic_column: "0",
        topic_name: "",
        max_score: 0,
        classgroup_code: class_data.data,
      },
    ];
    setTopics(arr_form);

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
    setAllsubject(subject_form);
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

    const day_of_week = [
      { value: 1, label: "อาทิตย์" },
      { value: 2, label: "จันทร์" },
      { value: 3, label: "อังคาร" },
      { value: 4, label: "พุธ" },
      { value: 5, label: "พฤหัสบดี" },
      { value: 6, label: "ศุกร์" },
      { value: 7, label: "เสาร์" },
    ];
    setDayofweek(day_of_week);
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
    } else if (classroom.classgroup_number === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ เลขห้อง",
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
    } else if (timepost.time_end === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดใส่ข้อมูล เวลาเข้าเรียนใหม่อีกครั้ง",
        icon: "warning",
      });
      return false;
    } else if (classroom.classgroup_days === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบ วันที่สอน",
        icon: "warning",
      });
      return false;
    } else if (topics[0].topic_name === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดตรวจสอบตารางคะแนน",
        icon: "warning",
      });
      return false;
    } else {
      _setTimeoutclass();
      return true;
    }
  };

  async function _handleSubmit() {
    if (_checkSubmit()) {
      // console.log("class", classroom);
      let query_result = await classgroup_model.insertClassgroup({
        classgroup_code: classroom.classgroup_code,
        classgroup_id: "CPE." + classroom.classgroup_id,
        classgroup_password: classroom.classgroup_password,
        classgroup_number: classroom.classgroup_number,
        subject_code: classroom.subject_code,
        user_code: classroom.user_code,
        classgroup_time_start: dayjs(timepost.time_start).format(
          "YYYY-MM-DD H:mm:ss"
        ),
        classgroup_time_end: dayjs(timepost.time_end).format(
          "YYYY-MM-DD H:mm:ss"
        ),
        addby: classroom.addby,
        adddate: dayjs().format("YYYY-MM-DD H:mm:ss"),
        topics_row: topics,
        leave_maxcount: classroom.leave_maxcount,
        classgroup_status: "Activate",
        classgroup_days: classroom.classgroup_days,
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/class-group");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    value.replace(" ", "");
    if (name === "classgroup_id") {
      let eng = value.replace(/[^0-9]/gi, "");
      setClassroom({ ...classroom, [name]: eng.replace(" ", "") });
    } else {
      setClassroom({ ...classroom, [name]: value });
    }
  };

  const ChangeArray = (e, index) => {
    const proper = e.target.name;
    let newArr = [...topics];
    if (proper === "max_score") {
      let sum = parseInt(e.target.value.replace("-", ""));
      newArr[index][proper] = sum || "";
      setTopics(newArr);
    }
    // else if (proper === "topic_name") {
    //   newArr[index][proper] = e.target.value.replace(/[A-Za-z]/gi, "");
    //   setTopics(newArr);
    // }
    else {
      newArr[index][proper] = e.target.value;
      setTopics(newArr);
    }
  };

  const AddArray = () => {
    let topic = { ...topics };
    let index_arr = topics[parseInt(topics.length - 1)];

    let last_code = index_arr.topic_code;
    let column = (parseInt(index_arr.topic_column) + 1).toString();

    let str = last_code.substr(2, 5);
    let max_id = parseInt(str) + 1;
    let max_str = max_id.toString().padStart(3, "0");
    let res = "TP".concat(max_str);

    let newArr = {
      topic_code: res,
      topic_column: column,
      topic_name: "",
      max_score: 0,
      classgroup_code: classroom.classgroup_code,
    };
    topic[topics.length] = newArr;

    setTopics((topics) => [...topics, newArr]);
  };

  const handleRemoveItem = () => {
    if (topics.length === 1) {
      alert("ไม่อนุญาติให้ทำการลบรายการทั้งหมด");
    } else {
      let topic_code = topics[parseInt(topics.length - 1)].topic_code;
      setTopics(topics.filter((item) => item.topic_code !== topic_code));
    }
  };

  const _setTimeoutclass = () => {
    // เพิ่มเวลาตามหน่วยเรียนของรายวิชา

    if (
      classroom.classgroup_time_start !== undefined &&
      classroom.classgroup_id !== "" &&
      classroom.classgroup_days !== ""
    ) {
      let timer_start_str =
        dayjs().format("YYYY-MM-DD ") + classroom.classgroup_time_start;

      if (classroom.subject_code !== "") {
        let subj = allsubject.filter((item) => {
          return item.subject_code === classroom.subject_code;
        });
        let time_end = dayjs
          .tz(timer_start_str)
          .add(subj[0].subject_hour, "hour").$d;
        let time_end_str = dayjs(time_end).format("HH:mm");

        let time_start = dayjs.tz(timer_start_str);

        // เทียบเวลา คาบเช้า และ บ่าย
        let mid_time = dayjs().hour(12).$H;
        let time_registered = "";
        let class_id = "CPE." + classroom.classgroup_id;
        allclass
          .filter(
            (item) =>
              item.classgroup_days === classroom.classgroup_days &&
              item.classgroup_id === class_id
          )
          .map((data) => {
            if (
              dayjs.tz(data.classgroup_time_start).$H >= mid_time &&
              time_start.$H >= mid_time
            ) {
              time_registered = data;
            } else if (
              dayjs.tz(data.classgroup_time_start).$H <= mid_time &&
              time_start.$H <= mid_time
            ) {
              time_registered = data;
            }
          });
        if (time_registered !== "") {
          Swal.fire({
            title: "แจ้งเตือน!",
            html:
              "ช่วงเวลานี้ ได้มีการลงทะเบียนไว้แล้ว" +
              "<br/> โดยวิชา " +
              time_registered.subject_fullname,
            icon: "warning",
          });
        } else {
          setClassroom({ ...classroom, classgroup_time_end: time_end_str });
          setTimepost({
            ...timepost,
            time_start: time_start.$d,
            time_end: time_end,
          });
        }
      } else {
        Swal.fire("โปรดเลือกรายวิชา", "", "info");
      }
    } else {
      if (classroom.classgroup_id === "") {
        Swal.fire("โปรดใส่ข้อมูลในช่องกลุ่มเรียน", "", "warning");
      } else if (classroom.classgroup_days === "") {
        Swal.fire("โปรดใส่ข้อมูลวันที่", "", "warning");
      } else { 
        Swal.fire("โปรดใส่เวลาให้ถูกต้อง", "", "warning");
      }
    }
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">กลุ่มเรียน</CCardHeader>
        <CCardBody>
          {/* แบบฟอร์ม */}
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
                <Input
                  type="tel"
                  name="classgroup_id"
                  addonBefore="CPE."
                  value={classroom.classgroup_id}
                  onChange={(e) => _changeFrom(e)}
                  maxLength={5}
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
                <Input.Password
                  type="text"
                  name="classgroup_password"
                  value={classroom.classgroup_password}
                  onChange={(e) => _changeFrom(e)}
                  maxLength={8}
                />
                <p className="text-muted" style={{ fontSize: "13px" }}>
                  รหัสผ่านไม่เกิน 8 หลัก
                </p>
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
              <CLabel>
                วัน{" "}
                <font color="#F00">
                  <b>*</b>
                </font>
              </CLabel>
              <Select
                options={dayofweek}
                value={classroom.classgroup_days}
                onChange={(e) =>
                  setClassroom({
                    ...classroom,
                    [`classgroup_days`]: e,
                  })
                }
                require
              />
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
                  onBlur={_setTimeoutclass}
                />
              </CFormGroup>
            </CCol>
            <CCol md="3">
              <CFormGroup>
                <CLabel>เวลาสิ้นสุด</CLabel>
                <Input
                  type="time"
                  name="classgroup_time_end"
                  value={classroom.classgroup_time_end}
                  onChange={(e) => _changeFrom(e)}
                  disabled
                />
              </CFormGroup>
            </CCol>
          </CRow>

          <CRow>
            <CCol md="3">
              <CFormGroup>
                <CLabel>
                  จำนวนครั้งที่สามารถลาได้{" "}
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>

                {/* {leaveswitch === true ? ( */}
                <CInput
                  type="number"
                  name="leave_maxcount"
                  placeholder="0"
                  value={classroom.leave_maxcount}
                  onChange={(e) => _changeFrom(e)}
                  min="0"
                />
                {/* ) : null} */}
              </CFormGroup>
            </CCol>
          </CRow>

          {/* ตารางคะแนน */}
          <CRow>
            <CCol sm="12">
              <CButton
                color="primary"
                style={{ width: "120px" }}
                onClick={() => AddArray()}
              >
                เพิ่มช่องคะแนน
              </CButton>
              <CButton
                color="danger"
                style={{ width: "120px" }}
                onClick={() => handleRemoveItem()}
              >
                ลบรายการ
              </CButton>
            </CCol>
          </CRow>
          <br />
          <p className="text-muted">
            <font color="#F00">
              <b>*</b>
            </font>{" "}
            หมายเหตุ : สามารถเปลี่ยนชื่อหัวตารางและคะแนนได้
            แต่ไม่สามารถเพิ่มช่องคะแนนในภายหลังจากทำการยืน
            โปรดตรวจสอบช่องคะแนนที่ต้องการใช้ก่อนทำการยืนยัน
          </p>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>ชื่อตารางคะแนน</th>
                <th>คะแนนเต็ม</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((data, index) => {
                return (
                  <>
                    <tr>
                      <td>
                        <CInput
                          type="text"
                          placeholder="ชื่อหัวตารางคะแนน"
                          value={data.topic_name}
                          name="topic_name"
                          onChange={(e) => ChangeArray(e, index)}
                        />
                      </td>
                      <td>
                        <CInput
                          type="number"
                          maxlength="4"
                          placeholder="0"
                          value={data.max_score}
                          name="max_score"
                          onChange={(e) => ChangeArray(e, index)}
                        />
                      </td>
                    </tr>
                  </>
                );
              })}
            </tbody>
            <br />
            <thead>
              <tr>
                <th colspan="2">คะแนนทั้งหมด</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <CInput
                    type="number"
                    min="0"
                    placeholder={0}
                    value={sum}
                    name="score"
                    disabled
                  />
                </td>
              </tr>
            </tbody>
          </Table>
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
