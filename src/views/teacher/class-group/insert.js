import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import { Switch } from "antd";
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
import { Table } from "react-bootstrap";
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
  const [topics, setTopics] = useState([
    { id: 1, topic_name: "", max_score: 0, classgroup_code: "" },
  ]);
  const [sum, setSum] = useState();
  const [leaveswitch, setLeaveswitch] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    let timer_start =
      dayjs().format("YYYY-MM-DD ") + classroom.classgroup_time_start;
    let timer_end =
      dayjs().format("YYYY-MM-DD ") + classroom.classgroup_time_end;

    let classrooma = {};
    classrooma.time_start = timer_start;
    classrooma.time_end = timer_end;
    setTime(classrooma);
  }, [classroom.classgroup_time_start, classroom.classgroup_time_end]);

  useEffect(() => {
    const score_result = topics
      .map((item) => item.max_score)
      .reduce((prev, curr) => prev + (curr || 0), 0);

    setSum(score_result);
  }, [topics]);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

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
    classform.addby = user_session.user_code;
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
        classgroup_time_start: time.time_start,
        classgroup_time_end: time.time_end,
        addby: classroom.addby,
        adddate: dayjs().format("YYYY-MM-DD H:mm:ss"),
        topics_row: topics,
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/class-group");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
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

  const ChangeArray = (e, index) => {
    const proper = e.target.name;
    let newArr = [...topics];
    if (proper === "max_score") {
      let sum = parseInt(e.target.value);
      newArr[index][proper] = sum || "";
      setTopics(newArr);
    } else {
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

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          กลุ่มเรียน / Class group
        </CCardHeader>
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
                {/* <Switch
                  checked={leaveswitch}
                  size="middle"
                  checkedChildren="เปิด"
                  unCheckedChildren="ปิด"
                  onChange={() => {
                    setLeaveswitch(!leaveswitch);
                  }}
                /> */}
                {"   "}
                <CLabel>
                  จำนวนครั้งที่สามารถขาดได้{" "}
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
                          min="0"
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
