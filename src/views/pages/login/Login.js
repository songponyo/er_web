import React from "react";
import { Link } from "react-router-dom";
import { Button, Form } from "reactstrap";
import { CCol, CRow, CFormGroup, CInput, CContainer } from "@coreui/react";
import { AuthConsumer } from "../../../role-accress/authContext";

const Login = () => {
  const [user, setUser] = React.useState({
    user_username: "",
    user_password: "",
  });

  return (
    <AuthConsumer>
      {({ initiateLogin }) => {
        return (
          <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer>
              <Form
                onSubmit={() =>
                  initiateLogin({
                    user_username: user.user_username,
                    user_password: user.user_password,
                  })
                }
              >
                <CRow>
                  <CCol md="2" />
                  <CCol md="8">
                    <div className="p-3 border bg-white">
                      <CRow>
                        <CCol md={6}>
                          <img src="cpe.png" width="350px" height="300px" />
                        </CCol>

                        <CCol md={5}>
                          <br />
                          <h3>เข้าสู่ระบบ / Login</h3>
                          <br />
                          ชื่อผู้ใช้
                          <br />
                          <CFormGroup>
                            <CInput
                              type="text"
                              placeholder="Username"
                              value={user.user_username}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  user_username: e.target.value,
                                })
                              }
                              autoComplete="username"
                              required
                            />
                          </CFormGroup>
                          <br />
                          รหัสผ่าน
                          <br />
                          <CFormGroup>
                            <CInput
                              type="password"
                              placeholder="Password"
                              value={user.user_password}
                              onChange={(e) =>
                                setUser({
                                  ...user,
                                  user_password: e.target.value,
                                })
                              }
                              autoComplete="current-password"
                              required
                            />
                          </CFormGroup>
                          <br />
                          <Button color="primary" className="px-4">
                            เข้าสู่ระบบ
                          </Button>
                          <Link
                            key="update"
                            to={`/register`}
                            title="แก้ไขรายการ"
                          >
                            <button
                              type="button"
                              className="btn btn-warning btn-row-sm"
                            >
                              สมัครสมาชิก
                            </button>
                          </Link>
                        </CCol>
                      </CRow>
                    </div>
                  </CCol>
                </CRow>
              </Form>
            </CContainer>
          </div>
        );
      }}
    </AuthConsumer>
  );
};

export default Login;
