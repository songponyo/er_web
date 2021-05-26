import React, { useState, useEffect } from "react";
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
import ClassgroupModel from "../../../models/ClassgroupModel"
import ScoreModel from "../../../models/ScoreModel"
import UserModel from "../../../models/UserModel"

const user_model = new UserModel();
const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();
const time_controller = new TimeController();


export default function Detail() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/checkin-teacher/detail/:code");
  const [classgroup, setClassgroup] = useState([])


  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    })

    const score_group = await score_model.getScoreByCode({
      table_name: class_group.data[0].classgroup_table_score
    })
    setClassgroup(score_group.data)

  }

  async function _handleSubmit() {
  }



  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classgroup };
    new_data[name] = value;
    setClassgroup(new_data);
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน / Name list
        </CCardHeader>
        <CCardBody>

        </CCardBody>
      </CCard>
    </>
  );
}
