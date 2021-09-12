import React from "react";
import { Link } from "react-router-dom";
import { Form, Button } from "reactstrap";
import {
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CInput,
  CButton,
  CContainer,
} from "@coreui/react";
import { AuthConsumer } from "../../../role-accress/authContext";
const Register = () => {
  const [user, setUser] = React.useState({
    user_username: "",
    user_password: "",
    user_passwordre: "",
    user_firstname: "",
    user_lastname: "",
    user_uid: "",
  });
  return (
    <AuthConsumer>
      {({ initiateRegister }) => {
        return (
          <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer
              className="align-items-center"
              style={{ width: "450px", paddingTop: "20px" }}
            >
              <Form onSubmit={() => initiateRegister(user)}>
                <CCard>
                  <CCardBody>
                    <h1>สมัครสมาชิก</h1>
                    <br />
                    <CRow>
                      <CCol>
                        <CRow>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>ชื่อผู้ใช้</CLabel>
                              <CInput
                                type="text"
                                name="user_username"
                                value={user.user_username}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_username: e.target.value,
                                  })
                                }
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>รหัสผ่าน</CLabel>
                              <CInput
                                type="text"
                                name="user_password"
                                value={user.user_password}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_password: e.target.value,
                                  })
                                }
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>ยืนยันรหัสผ่าน</CLabel>
                              <CInput
                                type="text"
                                name="user_passwordre"
                                value={user.user_passwordre}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_passwordre: e.target.value,
                                  })
                                }
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="6">
                            <CFormGroup>
                              <CLabel>ชื่อ</CLabel>
                              <CInput
                                type="text"
                                name="user_firstname"
                                value={user.user_firstname}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_firstname: e.target.value,
                                  })
                                }
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="6">
                            <CFormGroup>
                              <CLabel>นามสกุล</CLabel>
                              <CInput
                                type="text"
                                name="user_lastname"
                                value={user.user_lastname}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_lastname: e.target.value,
                                  })
                                }
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>รหัสนักศึกษา</CLabel>
                              <CInput
                                type="text"
                                name="user_uid"
                                value={user.user_uid}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_uid: e.target.value,
                                  })
                                } 
                                required
                                
                              /><p className="text-muted">ไม่ต้องใส่ ( - )</p>
                            </CFormGroup>
                          </CCol>
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCardBody>
                  <CCardFooter>
                    <CRow>
                      <CCol align="center">
                        <Button
                          type="submit"
                          color="success" 
                          className="registerbtn"
                          style={{ backgroundColor: "#0aaa04" }} 
                        >
                          สมัครสมาชิก
                        </Button>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol align="center">
                        <Link to="/Login">
                          <Button
                            color="btn btn-danger" 
                            style={{ backgroundColor: "#aa0404" }}
                            className="registerbtn"
                          >
                            ย้อนกลับ
                          </Button>
                        </Link>
                      </CCol>
                    </CRow>
                  </CCardFooter>
                </CCard>
              </Form>
            </CContainer>
          </div>
        );
      }}
    </AuthConsumer>
  );
};

export default Register;
