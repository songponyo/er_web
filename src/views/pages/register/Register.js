import React, { useState } from 'react';
import { Link } from 'react-router-dom'
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
  CContainer,
  CImg
} from "@coreui/react";
import CIcon from '@coreui/icons-react'

const Register = () => {
  const [user, setUser] = React.useState({
    user_username: '',
    user_password: '',
    user_passwordre: '',
    user_prefix: '',
    fname: '',
    lname: '',
    id_student: '',
    faculty: '',
    program: '',
    phone: '',
    id_line: '',

  })
 
  console.log("user",user);

  const _changeFrom = (e) => {
    const { value, name } = e.target; 
    setUser({...user,['name']:value});
  };
  // async _handleSubmit = () => {

  //     const res = await user_model.insertUser({
  //       user_code: this.state.user_code.trim(),
  //       license_code: this.state.license_code,
  //       user_position_code: this.state.user_position_code,
  //       user_prefix: this.state.user_prefix,
  //       user_name: this.state.user_name.trim(),
  //       user_lastname: this.state.user_lastname.trim(),
  //       user_tel: this.state.user_tel.trim(),
  //       user_email: this.state.user_email.trim(),
  //       user_address: this.state.user_address.trim(),
  //       user_zipcode: this.state.user_zipcode.trim(),
  //       user_username: this.state.user_username.trim(),
  //       user_password: this.state.user_password.trim(),
  //       user_profile_image: user_profile_image,
  //       user_status: this.state.user_status,
  //       addby: this.props.USER.user_code,
  //     });

  //     if (res.require) {
  //       Swal.fire("Save success!!", "", "success");
  //       this.props.history.push("/user");
  //     } else {
  //       Swal.fire("Sorry, Someting worng !", "", "error");
  //     }
  //   }
  // }
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer className="align-items-center" >
        <CCard >
          <CCardHeader className="header-t-red">
            สมัครสมาชิก / register
        </CCardHeader>
          <CCardBody >
          <CRow>
              <CCol>
                <CRow>
                  <CCol md="4">
                    <CFormGroup>
                      <CLabel>
                        ชื่อผู้ใช้
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        รหัสผ่าน
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ยืนยันรหัสผ่าน
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>

            </CRow>
            <CRow >
              <CCol >
                <CRow>
                  <CCol md="1">
                    <CFormGroup>
                      <CLabel>
                        คำนำหน้า
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        ชื่อ
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        นามสกุล
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="4">
                    <CFormGroup>
                      <CLabel>
                        รหัสนักศึกษา
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>

                </CRow>
              </CCol>

            </CRow>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="4">
                    <CFormGroup>
                      <CLabel>
                        คณะ
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        สาขา
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>

            </CRow>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="4">
                    <CFormGroup>
                      <CLabel>
                        Email
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                  <CCol md="3">
                    <CFormGroup>
                      <CLabel>
                        เบอร์โทรศัพท์
                    </CLabel>
                      <CInput
                        type="text"
                      name="user_id"
                      value={user.user_id}
                      onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>

            </CRow>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="4">
                    <CLabel>
                     รูปโปรไฟล์
                    </CLabel>
                    {/* <CImg
                src={user.user_image.src}
                alt="Logo"
                width="60"
                className="img-circle-profile"
              />
              <br />
              <br /> */}
                    <CInput
                      type="file"
                      name="user_image"
                      accept="image/png, image/jpeg"
                    // onChange={(e) => _handleImageChange("user_image", e)}
                    />
                  </CCol>

                </CRow>
              </CCol>

            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              color="success"
              // onClick={() => _handleSubmit()}
            >
              สมัครสมาชิก
          </CButton>
            <Link to="/Login">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>

      </CContainer>
    </div>
  )
}

export default Register
