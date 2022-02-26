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
} from "@coreui/react"; 
import { Input } from "antd";
import Swal from "sweetalert2";
import { useHistory, useRouteMatch } from "react-router-dom";
import { Select } from "../../../component/revel-strap";
import TopicModel from "../../../models/TopicModel";
import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";

const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();
const topic_model = new TopicModel();

export default function Update() {
  let history = useHistory();
  let code = useRouteMatch("/all-class/update/:code");
  const [userselect, setUserselect] = useState([]);
  const [subject, setSubject] = useState([]);
  const [statusselect, setstatusselect] = useState([]);
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
    validate: "is-invalid",
  });
  const [topics, setTopics] = useState([
    { id: 1, topic_name: "", max_score: 0, classgroup_code: "" },
  ]);
  const [sum, setSum] = useState();
  const [dayofweek, setDayofweek] = useState([]);
  const [allsubject, setAllsubject] = useState([]);
  const [allclass, setAllclass] = useState([]);
  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    const score_result = topics
      .map((item) => parseInt(item.max_score))
      .reduce((prev, curr) => prev + (curr || 0));
    setSum(score_result);
  }, [topics]);

  async function fetchData() {
    const options = [
      { value: "Activate", label: "ใช้งาน" },
      { value: "Deactivate", label: "ปิดการใช้งาน" },
    ];
    setstatusselect(options);

    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setAllclass(classgroup_data.data);

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

    await classgroup_model
      .getClassgroupByCode({
        classgroup_code: code.params.code,
      })
      .then((item) => {
        setTimepost({
          ...timepost,
          time_start: item.data[0].classgroup_time_start,
          time_end: item.data[0].classgroup_time_end,
        });
        let room = {};
        room = item.data[0];
        room.classgroup_time_start = dayjs
          .tz(item.data[0].classgroup_time_start)
          .format("HH:mm");
        room.classgroup_time_end = dayjs
          .tz(item.data[0].classgroup_time_end)
          .format("HH:mm");
        setClassroom(room);
      });

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

    const topic_data = await topic_model.getTopicByClassCode({
      classgroup_code: code.params.code,
    });
    setTopics(topic_data.data);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await classgroup_model.updateClassgroupBy({
        classgroup_code: classroom.classgroup_code,
        classgroup_id: classroom.classgroup_id,
        classgroup_password: classroom.classgroup_password,
        classgroup_number: classroom.classgroup_number,
        classgroup_table_score: classroom.classgroup_table_score,
        subject_code: classroom.subject_code,
        user_code: classroom.user_code,
        classgroup_time_start: dayjs(timepost.time_start).format(
          "YYYY-MM-DD H:mm"
        ),
        classgroup_time_end: dayjs(timepost.time_end).format("YYYY-MM-DD H:mm"),
        addby: classroom.addby,
        adddate: classroom.adddate,
        topics_row: topics,
        leave_maxcount: classroom.leave_maxcount,
        classgroup_status: classroom.classgroup_status,
        classgroup_days: classroom.classgroup_days,
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/all-class");
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
        let class_id = classroom.classgroup_id;
        allclass
          .filter(
            (item) =>
              item.classgroup_days === classroom.classgroup_days &&
              item.classgroup_id === class_id
          )
          .map((data) => {
            // ช่วงบ่าย และ ช่วงเช้า
            if (
              dayjs.tz(data.classgroup_time_start).$H >= mid_time &&
              time_start.$H >= mid_time
            ) {
              // 1
              if (classroom.classgroup_code == data.classgroup_code) {
                time_registered = "";
              } else {
                time_registered = data;
              }
            } else if (
              dayjs.tz(data.classgroup_time_start).$H <= mid_time &&
              time_start.$H <= mid_time
            ) {
              // 2
              if (classroom.classgroup_code == data.classgroup_code) {
                time_registered = "";
              } else {
                time_registered = data;
              }
            }
          });
        //เช็คค่ารีเทิร์นของเวลาลงทะเบียนซ้ำ
        if (time_registered !== "") {
          Swal.fire({
            title: "แจ้งเตือน!",
            html:
              "ช่วงเวลานี้ ได้มีการลงทะเบียนไว้แล้ว" +
              "<br/> โดยวิชา " +
              time_registered.subject_fullname,
            icon: "warning",
          });
          setClassroom({ ...classroom, classgroup_time_start: "" });
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
        <CCardHeader className="header-t-red">แก้ไขกลุ่มเรียน</CCardHeader>
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
                  type="text"
                  name="classgroup_id"
                  addonBefore="CPE."
                  value={classroom.classgroup_id.replace("CPE.", "")}
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
                <CInput
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
              <CLabel>วัน</CLabel>
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
                  max="20:00"
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
                  สถานะการใช้งาน
                  <font color="#F00">
                    <b>*</b>
                  </font>
                </CLabel>
                <Select
                  options={statusselect}
                  value={classroom.classgroup_status}
                  onChange={(e) =>
                    setClassroom({
                      ...classroom,
                      [`classgroup_status`]: e,
                    })
                  }
                />
              </CFormGroup>
            </CCol>
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
        </CCardBody>
        <CCardFooter>
          <CButton
            type="submit"
            color="success"
            onClick={() => _handleSubmit()}
          >
            บันทึก
          </CButton>
          <Link to="/all-class">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </>
  );
}
