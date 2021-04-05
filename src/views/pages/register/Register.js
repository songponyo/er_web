import React, { useState } from 'react';
import {
  CButton,
  CCard,
  CCardBody,
  CCardFooter,
  CCol,
  CContainer,
  CForm,
  CInput,
  CInputGroup,
  CInputGroupPrepend,
  CInputGroupText,
  CRow
} from '@coreui/react'
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

  const checkpassword = (e) => {
    const { value, name } = e.target;
    let users = { ...user};
    users [name] = value;
   console.log(value);
   console.log(name);
    }
 
  return (
    <div className="c-app c-default-layout flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md="9" lg="7" xl="6">
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>สมัครสมาชิก</h1>
                  <p className="text-muted">สร้างบัญชีของคุณ</p>
                  <CInputGroup className="mb-3">
                    <CInput type="text"
                      value={user.user_username}
                      onChange={(e) => setUser({ ...user, user_username: e.target.value })}
                      placeholder="Username" autoComplete="username" />
                  </CInputGroup>
                  
                  
                  <CInputGroup className="mb-3">
                    <CInput type="password" 
                    value={user.user_password}
                    onChange={(e) => setUser({ ...user, user_password: e.target.value })}
                    placeholder="Password" autoComplete="new-password" />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInput type="password" name="user_passwordre"
                    value={user.user_passwordre}
                    onChange={(e) => checkpassword(e)}
                    placeholder="Repeat password" autoComplete="user_passwordre" />
                  </CInputGroup>
                    <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.user_prefix}
                    onChange={(e) => setUser({ ...user, user_prefix: e.target.value })}
                    placeholder="คำนำหน้า" autoComplete="user_prefix" />
                  </CInputGroup>
                   <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.fname}
                    onChange={(e) => setUser({ ...user, fname: e.target.value })}
                    placeholder="ชื่อ" autoComplete="fname" />
                  </CInputGroup>
                   <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.lname}
                    onChange={(e) => setUser({ ...user, lname: e.target.value })}
                    placeholder="นามสกุล" autoComplete="lname" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.id_student}
                    onChange={(e) => setUser({ ...user, id_student: e.target.value })}
                    placeholder="รหัสนักศึกษา" autoComplete="id_student" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.faculty}
                    onChange={(e) => setUser({ ...user, faculty: e.target.value })}
                    placeholder="คณะ" autoComplete="faculty" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.program}
                    onChange={(e) => setUser({ ...user, program: e.target.value })}
                    placeholder="สาขาวิชา" autoComplete="program" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.phone}
                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                    placeholder="เบอร์โทรศัพท์" autoComplete="phone" />
                  </CInputGroup>
                  <CInputGroup className="mb-3">

                    <CInput type="text" 
                    value={user.id_line}
                    onChange={(e) => setUser({ ...user, id_line: e.target.value })}
                    placeholder="ไอดีไลน์" autoComplete="id_line" />
                  </CInputGroup>
                  <CButton color="success" block>Create Account</CButton>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
