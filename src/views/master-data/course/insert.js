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

import SubjectModel from "../../../models/SubjectModel"
const time_controller = new TimeController();
const subject_model = new SubjectModel();

export default function Insert() {
  let history = useHistory();
  const [user, setUser] = useState([]);
  const [subject, setSubject] = useState({
    subject_code: "",
    subject_name: "",
    addby: "",
    adddate: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const date = new Date();
    // var code = "";
    // code =
    //   "PTC" +
    //   date.getFullYear() +
    //   (date.getMonth() + 1).toString().padStart(2, "0");

    // const material_data = await subject_model.getSubjectBy({
    //   code: code,
    //   digit: 4,
    // });



    // setSubject({
    //   ...subject,
    //   ["subject_code"]: material_data.data,
    // });

    // await setUser(material_data.data);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await subject_model.insertSubject({
        subject_code: subject.subject_code,
        subject_name: subject.subject_name,
        addby: user.user_code,
        addate: time_controller.reformatToDate(new Date()),
      });

      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/material-type");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (subject.subject_name === "") {
      Swal.fire({
        title: "Warning!",
        text: "Please Check Your subject name ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_material = { ...subject };
    new_material[name] = value;
    setSubject(new_material);
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            เพิ่มรายวิชา / Add subject
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol >
                <CRow>
                  <CCol md="3">
                    <CLabel>
                      รหัสวิชา{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </CLabel>
                    <CInput
                      type="text"
                      name="subject_code"
                      value={subject.subject_code}
                      // disabled
                    />

                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ชื่อวิชาภาษาไทย
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="subject_name"
                        value={subject.subject_name}
                        onChange={(e) => _changeFrom(e)}
                      />

                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ชื่อวิชาภาษาอังกฤษ
                        {" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="subject_name"
                        value={subject.subject_name}
                        onChange={(e) => _changeFrom(e)}
                      />
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
            <Link to="/material-type">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
