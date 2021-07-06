import React, { useState, useEffect } from "react"; 
import GoogleMapReact from 'google-map-react';
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
import { Link, useHistory, useRouteMatch } from "react-router-dom";
 


export default function Update() {
  let history = useHistory();
  let code = useRouteMatch("/course-student/update/:code");
  const [user, setUser] = useState([])
  const [position, setPosition] = useState({})


  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session)


  }
  async function _handleSubmit() { }

  return (
    <>
      <CContainer style={{ width: "30%", paddingTop: "20px" }} >
        <CCard >
          <CCardBody>
            <CRow  >
              <CCol className="text-center">
                {/* <CLabel style={{ fontSize: "25px" }} >{classroom.subject_code}</CLabel> */}
                <br />
                {/* <CLabel style={{ fontSize: "20px" }} >{classroom.subject_name}</CLabel> */}
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }} >อาจารย์ประจำวิชา</CLabel>
                <br />
                {/* <CLabel style={{ fontSize: "16" }} >{classroom.user_fullname}</CLabel> */}
              </CCol>
              <CCol lg="12">
                <br />
                <CInput
                  type="text"
                  // value={classroom.class_password}
                  // className={class_validate.class}
                  // onChange={(e) => _changeFrom(e, "class_password")}
                  // onBlur={() => _checkPassword()}
                  // required
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
                    // color="success"
                    // size="xs"
                    // onClick={() => _handleSubmit()}
                  >
                    สมัครสมาชิก
                  </CButton>
                  <Link to="/course-student">
                    <CButton color="danger">
                      ย้อนกลับ
                    </CButton>
                  </Link>
                </CCol>
              </CRow>
            </CContainer>
          </CCardFooter>
        </CCard>
      </CContainer>

    </>
  );
}
