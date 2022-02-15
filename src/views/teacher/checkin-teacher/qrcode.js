import React, { useState, useEffect } from "react";
import { useQrEncode, useQrDecode } from "react-qr-hooks";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CInput,
  CLabel,
  CButton,
  CContainer,
} from "@coreui/react";
import Swal from "sweetalert2";
import { useHistory, useRouteMatch } from "react-router-dom"; 
import { TimeController } from "../../../controller";
import ClassgroupModel from "../../../models/ClassgroupModel";
import QrcodeModel from "../../../models/QrcodeModel";
import dayjs from "dayjs";
import GROBAL from "../../../GLOBAL";

const qrcode_model = new QrcodeModel();
const time_controller = new TimeController();
const classgroup_model = new ClassgroupModel();

export default function Qrcode() {
  let history = useHistory();
  let code = useRouteMatch("/checkin-teacher/qrcode/:code");
  const [qrcode, setQrcode] = useState({
    text: "",
    show: false,
  });
  const [checkin, setCheckin] = useState({
    qr_url: "",
  });
  //img
  const encoded = useQrEncode(qrcode.text);
  //link qrcode
  const decoded = useQrDecode(encoded);
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const date = new Date();
    let lastcode =
      "QR" +
      date.getFullYear() +
      (date.getMonth() + 1).toString().padStart(2, "0");

    const qrcode_data = await qrcode_model.getQrcodeLastCode({
      code: lastcode,
      digit: 4,
    });

    const qr_No = await qrcode_model.getQrcodeNo({
      classgroup_code: code.params.code,
    });

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });

    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      history.push("/checkin-teacher");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      history.push("/checkin-teacher");
    } else {
      let checkin = {};
      checkin = class_group.data[0];
      checkin.qr_code = qrcode_data.data;
      checkin.qr_No = qr_No.data;
      checkin.classgroup_time_start =  dayjs.tz(checkin.classgroup_time_start).format('HH:mm')
      checkin.time_start = checkin.classgroup_time_start
      checkin.classgroup_time_end =  dayjs.tz(checkin.classgroup_time_end).format('HH:mm')
      checkin.qr_timeout = "";
      checkin.qr_url = "";
      setCheckin(checkin);
    }
  }

  async function _handleSubmit(url) {
    if (_checkSubmit()) { 
      let out = checkin.qr_timeout;
      let day = dayjs().format("YYYY-MM-DD ") + checkin.time_start; 
      let time_out = dayjs(day).add(out, "minute").format("YYYY-MM-DD HH:mm"); 

      let query_result = await qrcode_model.insertQrcode({
        classgroup_code: checkin.classgroup_code,
        qr_code: checkin.qr_code,
        qr_No: checkin.qr_No,
        qr_timeout: time_out,
        qr_url: url,
      });
      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย!!", "", "success");
        
      } else {
        Swal.fire("บันทึกไม่สำเร็จ", "", "error");
      }
    }
  }

  function seturl(e) {
    return new Promise((resolve, reject) => {
      let url =
        // "https://elearnning-b40d1.web.app/#/"
        GROBAL.Main_url.URL +
        "checkin-student/checkin/" +
        checkin.qr_code;
      setCheckin({ ...checkin, qr_url: url });
      return resolve(url);
    });
  }

  const createQrcode = async () => {
    let createQrcode = await generateQrCode();
    if (!createQrcode) return false;
  };

  const generateQrCode = async () => {
    if (checkin.qr_timeout) {
      let url = await seturl();
      _handleSubmit(url);
      setQrcode({ ...qrcode, text: url, show: true });
      if (url) return true;
    } else {
      alert("โปรดระบุเวลา");
      setQrcode({ ...qrcode, show: false });
      return false;
    }
  };

  
  const _checkSubmit = () => {
    if (checkin.qr_timeout === "" || checkin.qr_timeout > 60) {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดระบุ เวลาหมดสิทธิ์เช็คชื่อไม่เกิน 60 นาที",
        icon: "warning",
      });
      return false;
    }
    return true;
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setCheckin({ ...checkin, [name]: value });
  };

  return (
    <>
      <CContainer>
        <CCard>
          <CCardHeader className="header-t-red">สร้างคิวอาร์โค้ด</CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="12">
                <CRow>
                  <CCol md="2">
                    <CLabel>วันที่ : </CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>
                      {" "}
                      {time_controller.reformatToDate(new Date())}
                    </CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>รหัสวิชา</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>{checkin.subject_code}</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>อาจารย์ผู้สอน</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>{checkin.user_fullname}</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>ครั้งที่ : </CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>{checkin.qr_No}</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>ชื่อวิชา</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>{checkin.subject_name}</CLabel>
                  </CCol>
                  <CCol>
                    <CLabel>เวลาเรียน</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>
                      {checkin.classgroup_time_start} -{" "}
                      {checkin.classgroup_time_end}{" "}
                    </CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>กลุ่มนักศึกษา</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CLabel>{checkin.classgroup_id}</CLabel>
                  </CCol>

                  <CCol md="2">
                    <CLabel>ระบุเวลาที่เปิดให้เช็คชื่อ (นาที)</CLabel>
                  </CCol>
                  <CCol md="2">
                    <CInput
                      type="number"
                      min="0"
                      name="qr_timeout"
                      value={checkin.qr_timeout}
                      onChange={(e) => _changeFrom(e)}
                    />
                  </CCol>

                  <CCol md="12">
                    <div>
                      <br />
                      <CButton color="primary" onClick={() => createQrcode()}>
                        สร้างคิวอาร์โค้ด
                      </CButton>
                      <br />
                      {qrcode.show ? (
                        <div>
                          <img src={encoded} style={{width : "300px"}} />
                          <p>{decoded}</p>
                        </div>
                      ) : null}
                    </div>
                  </CCol>
                </CRow>
              </CCol>
            </CRow>
          </CCardBody>
        </CCard>
      </CContainer>
    </>
  );
}
