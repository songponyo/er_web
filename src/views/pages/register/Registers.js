import React from "react";
import { Link } from "react-router-dom";
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
  CForm,
  CValidFeedback,
} from "@coreui/react";
import { AuthConsumer } from "../../../role-accress/authContext";
import Swal from "sweetalert2";
import UserModel from "../../../models/UserModel";
const user_model = new UserModel();

const Registers = () => {
  const [user, setUser] = React.useState({
    user_username: "",
    user_password: "",
    user_passwordre: "",
    user_firstname: "",
    user_lastname: "",
    user_uid: "",
    type: "",
    user_code: "",
  });

  const changeFrom = (e) => {
    const { value, name } = e.target;
    if ("user_uid" === name && value.length === 15) {
      Swal.fire("สามารถใส่ได้ไม่เกิน 15 หลัก", "", "warning");
    } else if (value === "-") {
      let new_value = value.replace("-", "");
      setUser({ ...user, [name]: new_value });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const checkDuplicatPassword = async () => {
    if (
      user.user_passwordre !== "" &&
      user.user_password !== user.user_passwordre
    ) {
      Swal.fire("รหัสผ่านไม่ตรงกัน", "", "warning");
    } else {
      const date = new Date();
      const last_code = await user_model.getUserMaxCode({
        code: "U" + date.getFullYear(),
        digit: 3,
      });
      setUser({ ...user, user_code: last_code.data });
    }
  };

  const checkUser = async () => {
    await user_model
      .checkUser({
        user_username: user.user_username,
        user_uid: user.user_uid,
      })
      .then((result) => {
        if (result.data.length !== 0 && user.user_uid !== "") {
          Swal.fire({
            title: "หมายเลขไอดีนี้มีผู้ใช้อยู่แล้ว",
            text: "โปรดลองใหม่อีกครั้ง",
            icon: "warning",
          });
          setUser({ ...user, user_uid: "" });
        } else if (result.data.length !== 0 && user.user_username !== "") {
          Swal.fire({
            title: "ชื่อนี้มีผู้ใช้แล้ว",
            icon: "warning",
          });
          setUser({ ...user, user_username: "" }); 
        }
      });
  };
 

  return (
    <AuthConsumer>
      {({ initiateRegister }) => {
        return (
          <div className="c-app c-default-layout flex-row align-items-center">
            <CContainer
              className="align-items-center"
              style={{ width: "450px", paddingTop: "20px" }}
            >
              <CForm
                onSubmit={() =>
                  initiateRegister({
                    user_username: user.user_username,
                    user_password: user.user_password,
                    user_passwordre: user.user_passwordre,
                    user_firstname: user.user_firstname,
                    user_lastname: user.user_lastname,
                    user_uid: user.user_uid,
                    user_code: user.user_code,
                  })
                }
                autoComplete="off"
              >
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
                                maxLength={20}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_username: e.target.value,
                                  })
                                }
                                onBlur={checkUser}
                                placeholder="ชื่อผู้ใช้"
                                required
                              />
                              <CValidFeedback>
                                {" "}
                                ชื่อนี้สามารถใช้ได้
                              </CValidFeedback>
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>รหัสผ่าน</CLabel>
                              <CInput
                                type="password"
                                name="user_password"
                                value={user.user_password}
                                onChange={(e) =>
                                  setUser({
                                    ...user,
                                    user_password: e.target.value,
                                  })
                                }
                                placeholder="รหัสผ่าน"
                                minLength={4}
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>ยืนยันรหัสผ่าน</CLabel>
                              <CInput
                                type="password"
                                name="user_passwordre"
                                value={user.user_passwordre}
                                onChange={(e) => changeFrom(e)}
                                onBlur={checkDuplicatPassword}
                                required
                              />
                            </CFormGroup>
                          </CCol>
                          <CCol md="12">
                            <CFormGroup>
                              <CLabel>รหัสนักศึกษา / รหัสอาจารย์</CLabel>
                              <CInput
                                type="number"
                                name="user_uid"
                                value={user.user_uid}
                                onChange={(e) => changeFrom(e)}
                                onBlur={checkUser}
                                required
                              />
                              <p
                                style={{ fontSize: "12px" }}
                                lassName="text-muted"
                              >
                                หมายเหตุ* รหัสนักศึกษา ไม่ต้องใส่ ( - )
                              </p>
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
                        </CRow>
                      </CCol>
                    </CRow>
                  </CCardBody>
                  <CCardFooter>
                    <CRow>
                      <CCol align="center">
                        <CButton
                          type="submit"
                          color="success"
                          className="registerbtn"
                          style={{ backgroundColor: "#0aaa04" }}
                        >
                          สมัครสมาชิก
                        </CButton>
                      </CCol>
                    </CRow>

                    <CRow>
                      <CCol align="center">
                        <Link to="/Login">
                          <CButton
                            color="btn btn-danger"
                            style={{ backgroundColor: "#aa0404" }}
                            className="registerbtn"
                          >
                            ย้อนกลับ
                          </CButton>
                        </Link>
                      </CCol>
                    </CRow>
                  </CCardFooter>
                </CCard>
              </CForm>
            </CContainer>
          </div>
        );
      }}
    </AuthConsumer>
  );
};

export default Registers;
