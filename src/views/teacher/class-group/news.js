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
import dayjs from "dayjs";
import Swal from "sweetalert2";
import { Table } from "react-bootstrap";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import SubjectModel from "../../../models/SubjectModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
import UserModel from "../../../models/UserModel";
import TopicModel from "../../../models/TopicModel";

const topic_model = new TopicModel();
const user_model = new UserModel();
const classgroup_model = new ClassgroupModel();
const subject_model = new SubjectModel();

export default function News() {
  const [News, setNews] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {}
  return (
    <div align="center">
      <CCard style={{ width: "70%" }}>
        {" "}
        <CCardHeader>รายชื่อ / Name list</CCardHeader>
        <CCardBody>Text</CCardBody>
      </CCard>
    </div>
  );
}
