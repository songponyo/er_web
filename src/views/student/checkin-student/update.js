import React, { useState, useEffect } from "react";
import GoogleMapReact from "google-map-react"; 
import {
  CCard,
  CCardBody,
  CContainer,
  CCol,
  CRow,
  CLabel,
  // CInput,
  CButton,
  CCardFooter,
} from "@coreui/react";
import { useHistory, useRouteMatch } from "react-router-dom";
import Swal from "sweetalert2";
import QrcodeModel from "../../../models/QrcodeModel";
import { TimeController } from "../../../controller";

const qrcode_model = new QrcodeModel();
const time_controller = new TimeController();
export default function Update() {
  let history = useHistory();
  let code = useRouteMatch("/checkin-student/update/:code");
  const [user, setUser] = useState([]);
  const [position, setPosition] = useState({});
  const [classroom, setclassroom] = useState({});
  const [checkin, setCheckin] = useState({});
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);

    const classroom = await qrcode_model.getQrcodeByCode({
      qr_code: code.params.code,
    });

    let room = {};
    room = classroom.data[0];
    setclassroom(room);

    let day = {};
    day.date = new Date();
    day.time_out = time_controller.reformatToTime(room.qr_timeout);
    day.time_stamp = time_controller.reformatToTime(day.date);
    setCheckin(day);
  }
  async function _handleSubmit() {
  //   let query_result = await checkin_model.insertQrcode({
  //     classgroup_code: checkin.classgroup_code,
  //     qr_code: checkin.qr_code,
  //     qr_No: checkin.qr_No,
  //     qr_timeout: time_out,
  //     qr_url: checkin.qr_url,
  //   });
  //   if (query_result.require) {
  //     checkin.time_stamp < checkin.time_out
  //       ? Swal.fire("บันทึกเรียบร้อย! ทันเวลา ", "", "success")
  //       : Swal.fire("บันทึกเรียบร้อย! ไม่ทันเวลา ", "", "success");
  //     // history.push("/checkin-teacher");
  //   } else {
  //     Swal.fire("บันทึกไม่สำเร็จ", "", "error");
  //   }
  }

  return (
    <>
      <CContainer style={{ width: "30%", paddingTop: "20px" }}>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <CLabel style={{ fontSize: "25px" }}>
                  {checkin.qr_timestamp}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "25px" }}>
                  {classroom.subject_code}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {classroom.subject_name}
                </CLabel>
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }}>อาจารย์ประจำวิชา</CLabel>
                <br />
                <CLabel style={{ fontSize: "16" }}>
                  {classroom.owner_fullname}
                </CLabel>
              </CCol>
              <CCol lg="12">
                <br />
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CContainer>
              <CRow>
                <CCol align="center">
                  <CButton
                    type="button"
                    color="success"
                    size="xs"
                    onClick={() => _handleSubmit()}
                  >
                    เช็คชื่อ
                  </CButton>
                </CCol>
              </CRow>
            </CContainer>
          </CCardFooter>
        </CCard>
      </CContainer>
    </>
  );
}
