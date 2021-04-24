import React, { useState, useEffect } from "react";
import GLOBAL from "../../../GLOBAL";
import { Link } from "react-router-dom";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
  CardImg,
  CardImgOverlay,
  CardTitle,
  CardText,
  CardSubtitle,
  ButtonToggle,
  Container,
  FormText
} from "reactstrap";
import { connect } from "react-redux";

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

  return (

    <Card >

      <CardBody>
        <CardTitle tag="h3">ใบลา(ลากิจ/ลาป่วย)</CardTitle>
        <Container className="themed-container">
          <Form>
            <Row>
              <Col xs="6" sm="5"><FormGroup>
                <Label for="user_firstname">ชื่อ</Label>
                <Input type="text" name="user_firstname" id="user_firstname" placeholder="ชื่อ" />
              </FormGroup></Col>
              <Col xs="6" sm="5">
                <FormGroup>
                  <Label for="user_lastname">นามสกุล</Label>
                  <Input type="text" name="user_lastname" id="user_lastname" placeholder="นามสกุล" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="5">
                <FormGroup>
                  <Label for="user_username">รหัสนักศึกษา</Label>
                  <Input type="text" name="user_username" id="user_username" placeholder="รหัสนักศึกษา" />
                </FormGroup>
              </Col>
            </Row>
            <legend>รายวิชาที่ต้องการลา</legend>
            <Row>
              <Col xs="6" sm="5"><FormGroup>
                <Label for="user_firstname">ชื่อวิชา</Label>
                <Input type="text" name="user_firstname" id="user_firstname" placeholder="ชื่อวิชา" />
              </FormGroup></Col>
              <Col xs="6" sm="5">
                <FormGroup>
                  <Label for="user_lastname">กลุ่มเรียน</Label>
                  <Input type="text" name="user_lastname" id="user_lastname" placeholder="กลุ่มเรียน" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="5">
                <FormGroup tag="fieldset">
                  <legend>ประเภทการลา</legend>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" />{' '}
            ลาป่วย
          </Label>
                  </FormGroup>
                  <FormGroup check>
                    <Label check>
                      <Input type="radio" name="radio1" />{' '}
            ลากิจ
          </Label>
                  </FormGroup>
                </FormGroup>
              </Col>
              <Col xs="6" sm="5">
                <FormGroup>
                  <Label for="exampleText">เหตุผลในการลา</Label>
                  <Input type="textarea" name="text" id="exampleText" />
                </FormGroup>
              </Col>
            </Row>
            <Row>
              <Col xs="6" sm="5">
              <FormGroup>
        <Label for="exampleFile">หลักฐานการลา</Label>
        <Input type="file" name="file" id="exampleFile" />
        <FormText color="muted">
         หมายเหตุ ลาป่วย ให้แนบหลักฐานใบรับรองแพทย์
                , ลากิจ  ให้แนบหลักฐานกิจกรรมที่ลาไป
        </FormText>
      </FormGroup>
              </Col>
            </Row>
            <ButtonToggle color="success">ยืนยัน</ButtonToggle>{' '} <ButtonToggle color="danger">ยกเลิก</ButtonToggle>{' '}
          </Form></Container>

      </CardBody>
    </Card>
  );
}

