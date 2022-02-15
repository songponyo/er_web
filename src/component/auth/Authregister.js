import React, { useEffect, useState } from "react";
// import { AuthProvider } from "../../role-accress/authContext";
import UserModel from "../../models/UserModel";
import Swal from "sweetalert2";
// import Auth from "./Auth";
import { Link, useHistory } from "react-router-dom";
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
const user_model = new UserModel();
export default function Authrule() {
  let history = useHistory();
  const [user, setUser] = useState({
    user_username: "",
    user_password: "",
    user_passwordre: "",
    user_firstname: "",
    user_lastname: "",
    user_uid: "",
  });
  useEffect(() => {
    fetchData() 
  }, []);

  async function fetchData() {
    const date = new Date();
    const last_code = await user_model.getUserMaxCode({
      code: "U" + date.getFullYear(),
      digit: 3,
    });
    let datainfo = {};
    datainfo = user
    datainfo.user_code = last_code.data;
    setUser(datainfo);
  }

  // async function checkUser(e) {
  //   const { value, name } = e.target;
  //   setUser({ ...user, [name]: value });
  //   const register_result = await user_model.checkUser({
  //     user_username: user.user_username,
  //   });
  //   if (register_result.data.length === 0) {
  //     Swal.fire({
  //       title: "ชื่อผู้ใช้ซ้ำ",
  //       text: "โปรดลองชื่ออื่น",
  //       icon: "error",
  //     });
  //   }
  // }

  const _checkSubmit = async () => {
    let query_result = await user_model.checkUsernameBy({
      user_username: user.user_username,
    });
    if (query_result.data.lenght !== 0) {
      Swal.fire({
        title: "ชื่อนี้มีผู้ใช้แล้ว",
        icon: "error",
      });
      return false;
    } else if (user.user_password == "") {
      Swal.fire({
        title: "โปรดตรวจสอบรหัสผ่านอีกครั้ง",
        icon: "error",
      });
      return false
    } else if (user.user_password !== user.user_passwordre) {
      Swal.fire({
        title: "โปรดตรวจสอบรหัสผ่านอีกครั้ง",
        icon: "error",
      });
      return false
    } else if (user.user_uid == "") {
      Swal.fire({
        title: "โปรดตรวจสอบรหัสนักศึกษา",
        icon: "error",
      });
      return false;
    } else {
      return true;
    }
  };
  
  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await user_model.registertUser({
        user_code: user.user_code,
        user_username: user.user_username,
        user_password: user.user_password,
        user_firstname: user.user_firstname,
        user_lastname: user.user_lastname,
        user_uid: user.user_uid,
        user_status: "Waiting",
      });
      if (query_result.require) {
        Swal.fire({
          title: "บันทึกสำเร็จ",
          text: "ผู้แลตรวจจะตรวจสอบข้อมูลอีกครั้ง",
          icon: "success",
        });
        // history.push("/login");
      } else {
        Swal.fire("บันทึกไม่สำเร็จ", "", "error");
      }
    }
  }

  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer
        className="align-items-center"
        style={{ width: "450px", paddingTop: "20px" }}
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
                        autocomplete="off"
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
                        type="password"
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
                        type="password"
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
                        // required
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
                        // required
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
                        onChange={(e) =>
                          setUser({
                            ...user,
                            user_uid: e.target.value,
                          })
                        }
                        maxlength="12"
                        // required
                      />
                      <p style={{ fontSize: "12px" }} lassName="text-muted">
                        หมายเหตุ* เลข 12 หลัก ไม่ต้องใส่ ( - )
                      </p>
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
                  onClick={() => _handleSubmit()}
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
      </CContainer>
    </div>
  );
}
