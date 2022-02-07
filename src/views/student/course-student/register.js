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
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import ClassgroupModel from "../../../models/ClassgroupModel";
import TopicModel from "../../../models/TopicModel";
import ScoreModel from "../../../models/ScoreModel";

const score_model = new ScoreModel();
const topic_model = new TopicModel();
const classgroup_model = new ClassgroupModel();

export default function Register() {
  let history = useHistory();
  let code = useRouteMatch("/course-student/register/:code");
  const [user, setUser] = useState([]);
  const [class_validate, setClass_validate] = useState({});
  const [classroom, setClassroom] = useState({
    class_password: "",
  });
  const [topics, setTopics] = useState({ topic: [], tablename: "" });
  const [score, setScore] = useState({});
  const [top_row, setTop_row] = useState([]);
  const [isShow, setIsShow] = useState(false);

  useEffect(() => {
    const checkuser = async () => {
      let classgroup_code_data = code.params.code;
      const user_session = await JSON.parse(
        localStorage.getItem(`session-user`)
      );
      const check_member = await classgroup_model.getClassgroupByMycourse({
        user_uid: user_session.user_uid,
        classgroup_code: classgroup_code_data,
      });
      if (check_member.data.length !== 0) {
        Swal.fire("ท่านเป็นสมาชิกอยู่แล้ว", "", "info");
        history.push("/course-student");
      } else {
        fetchData();
        setIsShow(true);
      }
    };
    checkuser();
  }, []);

  useEffect(() => {
    if (topics.topic.length !== 0) {
      AddTopics();
    }
  }, [topics]);

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

    const score_last = await score_model.getScoreLastCode({});
    setScore(score_last.data);

    const topic_data = await topic_model.getTopicByClassCode({
      classgroup_code: code.params.code,
    });
    let topics_info = {};
    topics_info.topic = topic_data.data;
    topics_info.tablename = class_group.data[0].classgroup_table_score;
    setTopics(topics_info);
  }

  const AddTopics = async () => {
    let topic_arr = [];
    let sum = 0;
    let last = score.replace("SC", "");
    let last_score = parseInt(last) - 1;

    topics.topic.map((topic) => {
      sum = sum + 1;
      let result = sum + last_score;
      let max_code = "SC" + result.toString().padStart(3, "0");
      topic_arr.push({
        classgroup_code: topic.classgroup_code,
        max_score: topic.max_score,
        score_value: 0,
        topic_code: topic.topic_code,
        topic_name: topic.topic_name,
        score_code: max_code,
        user_uid: user.user_uid,
      });
    });
    setTop_row(topic_arr);
    return true;
  };

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
        adddate: dayjs(new Date()).format("DD-MM-YYYY"),
        score_row: top_row,
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
      {!isShow == false ? (
        <CContainer
          // className="font-body"
          style={{ width: "350px", paddingTop: "20px" }}
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
      ) : null}
    </>
  );
}
