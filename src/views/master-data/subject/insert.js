import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CFormGroup,
  CForm,
  CLabel,
  CInput,
  CButton,
} from "@coreui/react";
import { Checkbox } from "antd";
import Swal from "sweetalert2";
import { Select } from "../../../component/revel-strap";
import { useHistory } from "react-router-dom";

import SubjectModel from "../../../models/SubjectModel";
const subject_model = new SubjectModel();

export default function Insert() {
  let history = useHistory();
  const [subject, setSubject] = useState({
    subject_code: "",
    subject_name_en: "",
    subject_name_th: "",
    subject_type: "",
    subject_hour: "",
  });
  const [timeLearning, settimeLearning] = useState([]);
  const [allSubject, setallSubject] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const subject_data = await subject_model.getSubjectBy({});
    setallSubject(subject_data.data);

    const user_status_options = [
      { value: 2, label: " 2 ชั่วโมง" },
      { value: 3, label: " 3 ชั่วโมง" },
      { value: 5, label: " 5 ชั่วโมง" },
      { value: 8, label: " 8 ชั่วโมง" },
    ];
    settimeLearning(user_status_options);
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await subject_model.insertSubject({
        subject_code: subject.subject_code,
        subject_name_th: subject.subject_name_th,
        subject_name_en: subject.subject_name_en,
        subject_type: subject.subject_type,
        subject_hour: subject.subject_hour,
      });

      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/subject");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (subject.subject_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อข้อมูลอีกครั้ง",
        icon: "warning",
      });
      return false;
    } else if (subject.subject_name_th === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อข้อมูลอีกครั้ง",
        icon: "warning",
      });
      return false;
    } else if (subject.subject_name_en === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อข้อมูลอีกครั้ง",
        icon: "warning",
      });
      return false;
    } else if (subject.subject_type === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อข้อมูลอีกครั้ง",
        icon: "warning",
      });
      return false;
    } else if (subject.subject_hour === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อข้อมูลอีกครั้ง",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  // ใส่ได้เฉพาะภาษาที่กำหนด
  const _changeFrom = (e) => {
    const { value, name } = e.target;
    value.replace(" ", "");
    if (name === "subject_name_en") {
      let eng = value.replace(/[^A-Za-z-0-9]/gi, "");
      setSubject({ ...subject, [name]: eng.replace(" ", "") });
    } else if (name === "subject_name_th") {
      let th = value.replace(/[A-Za-z]/gi, "");
      setSubject({ ...subject, [name]: th.replace(" ", "") });
    } else if (name === "subject_code") {
      let code = value.replace(/[^0-9-+]/gi, "");
      setSubject({ ...subject, [name]: code.replace(" ", "") });
    } else {
      setSubject({ ...subject, [name]: value });
    }
  };

  const checkDuplicate = () => {
    let code = allSubject.filter((items) => {
      return (
        items.subject_code === subject.subject_code ||
        items.subject_name_th === subject.subject_name_th ||
        items.subject_name_en === subject.subject_name_en
      );
    });
    if (code.length !== 0) {
      let text_form =
        " [ " + code[0].subject_code + " ] <br/>" + code[0].subject_name_th;
      Swal.fire({
        title: "รหัสวิชานี้มีอยู่แล้ว",
        html: text_form,
        icon: "warning",
      });
      setSubject({ ...subject, subject_code: "" });
    }
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">แก้ไขรายวิชา</CCardHeader>
          <CForm>
            <CCardBody>
              <CRow>
                <CCol>
                  <CRow>
                    <CCol md="3">
                      <CLabel>รหัสวิชา</CLabel>{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                      <CInput
                        type="text"
                        name="subject_code"
                        value={subject.subject_code}
                        onBlur={checkDuplicate}
                        onChange={(e) => _changeFrom(e)}
                        required 
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
                          onBlur={checkDuplicate}
                          value={subject.subject_name_th}
                          onChange={(e) => _changeFrom(e)}
                          required
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
                          onBlur={checkDuplicate}
                          onChange={(e) => _changeFrom(e)}
                          required
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol md="3">
                      <CFormGroup>
                        <CLabel>
                          เวลาเรียน{" "}
                          <font color="#F00">
                            <b>*</b>
                          </font>{" "}
                        </CLabel>
                        <Select
                          options={timeLearning}
                          value={subject.subject_hour}
                          onChange={(e) =>
                            setSubject({
                              ...subject,
                              [`subject_hour`]: e,
                            })
                          }
                          require
                        />
                      </CFormGroup>
                    </CCol>
                    <CCol>
                      {" "}
                      <Checkbox
                        checked={subject.subject_type == 1 ? true : false}
                        onClick={() =>
                          setSubject({ ...subject, subject_type: 1 })
                        }
                      >
                        ทฤษฎี{" "}
                      </Checkbox>
                      <br />
                      <Checkbox
                        checked={subject.subject_type == 2 ? true : false}
                        onClick={() =>
                          setSubject({ ...subject, subject_type: 2 })
                        }
                      >
                        ปฏิบัติ{" "}
                      </Checkbox>
                    </CCol>
                  </CRow>
                </CCol>
              </CRow>
            </CCardBody>
          </CForm>

          <CCardFooter>
            <CButton
              type="submit"
              color="success"
              onClick={() => _handleSubmit()}
            >
              บันทึก
            </CButton>
            <Link to="/subject">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
