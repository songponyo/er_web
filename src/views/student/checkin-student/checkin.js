import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardBody,
  CContainer,
  CCol,
  CRow,
  CLabel,
  CButton,
  CCardFooter,
} from "@coreui/react";
import { useHistory, useRouteMatch, Link } from "react-router-dom";
import Swal from "sweetalert2";
import QrcodeModel from "../../../models/QrcodeModel";
import CheckinModel from "../../../models/CheckinModel";
import { TimeController } from "../../../controller";
import ScoreModel from "../../../models/ScoreModel";
import dayjs from "dayjs";

const score_model = new ScoreModel();
const qrcode_model = new QrcodeModel();
const checkin_model = new CheckinModel();
const time_controller = new TimeController();

export default function Checkin() {
  let history = useHistory();
  let code = useRouteMatch("/checkin-student/checkin/:code");
  const [showdetail, setShowdetail] = useState(false);
  const [user, setUser] = useState([]);
  const [qrcode, setQrcode] = useState({});
  const [checkin, setCheckin] = useState({});
  const [Lat, setLat] = useState(0);
  const [Lot, setLot] = useState(0);
  const [checkinstamp, setCheckinstamp] = useState({
    checkin_time: "",
  });
  useEffect(() => {
    fetchData();
    getLocation();
  }, []);

  function getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(showPosition);
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  function showPosition(position) {
    var lat = position.coords.latitude;
    var lng = position.coords.longitude;
    setLat(lat);
    setLot(lng);
  }

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    setUser(user_session);
    let coded = code.params.code;

    const qrcode = await qrcode_model.getQrcodeByCode({
      qr_code: coded,
    });
    const date = new Date();
    let lastcode =
      "CK" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");
    const qrcode_data = await checkin_model.getCheckinLastCode({
      code: lastcode,
      digit: 4,
    });

    let room = {};
    room = qrcode.data[0];
    room.qr_code = coded;
    setQrcode(room);

    let day = {};
    day.check_code = qrcode_data.data;
    day.date = new Date();
    day.time_stamp = time_controller.reformatToTime(day.date);
    setCheckin(day);

    let url = {};
    url.qr = room.qr_code;
    url.classID = room.classgroup_code;
    _checkSubmit(user_session.user_code, url);
  } 
  async function _handleSubmit() {
    let status_in = "";
    checkin.time_stamp < checkin.time_out
      ? (status_in = "Active")
      : (status_in = "Inactive");

    let query_result = await checkin_model.insertCheckin({
      checkin_code: checkin.check_code,
      classgroup_code: qrcode.classgroup_code,
      checkin_time: time_controller.reformatToDateTime(checkin.date),
      checkin_status: status_in,
      user_code: user.user_code,
      qr_code: qrcode.qr_code,
      longitude: Lot,
      latitude: Lat,
    });
    if (query_result.require) {
      if (checkin.time_stamp < checkin.time_out) {
        Swal.fire("ทันเวลา ", "", "success");
      } else {
        Swal.fire("ไม่ทันเวลา ", "", "error").then((result) => {
          if (result) {
            score_model
              .updateScoreLeaveBy({
                user_uid: user.user_uid,
                table_name: qrcode.classgroup_table_score,
              })
              .then((res) => {
                if (res.require) {
                  Swal.fire("บันทึกเวลามาสายเรียบร้อย", "", "success");
                  window.location.reload();
                } else {
                  Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
                }
              });
          }
        });
      }
      let histy = " / checkin - student / history / " + qrcode.classgroup_code;
      history.push(histy);
    } else {
      Swal.fire("บันทึกไม่สำเร็จ", "", "error");
    }
  }

  const _checkSubmit = async (user, qr) => {
    const query_result = await checkin_model.getCheckinBy({
      keyword: user,
      owner: qr.qr,
    });
    if (query_result.data.length !== 0) {
      // console.log("query_result", query_result.data[0]);
      setCheckinstamp(query_result.data[0]);
      setShowdetail(true);
      // Swal.fire({
      //   title: "แจ้งเตือน!",
      //   text: "ไม่สามารถลงชื่อซ้ำได้",
      //   icon: "warning",
      // });
      // let histy = "/checkin-student/history/" + qr.classID;
      // history.push(histy);
      return false;
    } else {
      return true;
    }
  };

  return (
    <>
      <CContainer style={{ width: "350px", paddingTop: "20px" }}>
        <CCard>
          <CCardBody>
            <CRow>
              <CCol className="text-center">
                <CLabel style={{ fontSize: "20px" }}>
                  {qrcode.subject_code}
                </CLabel>
                <br />
                <CLabel style={{ fontSize: "20px" }}>
                  {qrcode.subject_name}
                </CLabel>
              </CCol>
              <br />
              <CCol lg="12" className="text-center">
                <CLabel style={{ fontSize: "18" }}>อาจารย์ประจำวิชา</CLabel>
                <br />
                <CLabel style={{ fontSize: "16" }}>
                  {qrcode.owner_fullname}
                </CLabel>
              </CCol>
            </CRow>
          </CCardBody>
          {showdetail !== true ? (
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
          ) : (
            <CCardFooter>
              <CContainer>
                <CRow>
                  <CCol className="text-center">
                    <CLabel style={{ fontSize: "20px" }}>เวลาที่ลงชื่อ</CLabel>
                    <br />
                    <CLabel style={{ fontSize: "20px" }}>
                      {dayjs(checkinstamp.checkin_time).format("HH:mm")}
                    </CLabel>
                  </CCol>
                </CRow>
              </CContainer>
            </CCardFooter>
          )}
        </CCard>
      </CContainer>
    </>
  );
}
