import React, { useState, useEffect } from "react"; 
import { Link, useHistory, useRouteMatch } from "react-router-dom";
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
import SubjectModel from "../../../models/SubjectModel"; 
const subject_model = new SubjectModel();

export default function Insert() {
  let history = useHistory();
  let code = useRouteMatch("/course/update/:code"); 
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
    const subject_data = await subject_model.getSubjectByCode({
      subject_code: code.params.code,
    });
    setSubject(subject_data.data[0]);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await subject_model.updateSubjectBy({
        subject_code: subject.subject_code,
        subject_name_th: subject.subject_name_th,
        subject_name_en: subject.subject_name_en,
      });

      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
        history.push("/course");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (subject.subject_name === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อรายวิชา ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setSubject({ ...subject, [name]: value });
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            แก้ไขรายวิชา / Edit subject
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
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
                        ชื่อวิชาภาษาไทย{" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="subject_name_th"
                        value={subject.subject_name_th}
                        onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ชื่อวิชาภาษาอังกฤษ{" "}
                        <font color="#F00">
                          <b>*</b>
                        </font>
                      </CLabel>
                      <CInput
                        type="text"
                        name="subject_name_en"
                        value={subject.subject_name_en}
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
            <Link to="/course">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
