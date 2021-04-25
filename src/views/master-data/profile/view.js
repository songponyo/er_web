import React, { Component, useEffect, useState } from "react";
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
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table, Loading } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() {
  const [showloading, setShowLoading] = useState(true);
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setClassgroup(classgroup_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "Are you sure ?",
      text: "Confirm to delete " + data.classgroup_code,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        setShowLoading(true);
        classgroup_model
          .deleteClassgroupByCode({ classgroup_code: data.classgroup_code })
          .then((res) => {
            if (res.require) {
              setShowLoading(false);
              Swal.fire("Success Deleted!", "", "success");
              window.location.reload();
            } else {
              setShowLoading(false);
              Swal.fire("Sorry, Someting worng !", "", "error");
            }
          });
      }
    });
  }

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            ข้อมูลส่วนตัว / Profile
        </CCardHeader>
          <CCardBody >
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
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
                      // name="classgroup_id"
                      // value={classroom.classgroup_id}
                      // onChange={(e) => _changeFrom(e)}
                      />
                    </CFormGroup>
                  </CCol>
                </CRow>
              </CCol>

            </CRow>
          </CCardBody>
        
        </CCard>

      </div>
    </div>
  );
}
