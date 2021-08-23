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
  const [checkin, setCheckin] = useState({});
  const encoded = useQrEncode(qrcode.text /* object with options (if needed) */);
  const decoded = useQrDecode(encoded /* object with options (if needed) */);

  useEffect(() => {
    fetchData();
  }, []);
 

  const generateQrCode = () => {
    if (checkin.qr_timeout) {
      setQrcode({ ...qrcode, 'show': true, text:"https://elearning-21dc5.firebaseapp.com/#/checkin-student/update/?roomId=" + checkin.qr_code })
    }
    else { setQrcode({ ...qrcode, 'show': false }) }
  }


  async function fetchData() {
    const date = new Date();
    let lastcode = "";
    lastcode =
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
      checkin.classgroup_time_start = time_controller.reformatToTime(
        checkin.classgroup_time_start
      );
      checkin.classgroup_time_end = time_controller.reformatToTime(
        checkin.classgroup_time_end
      );
      checkin.qr_timeout = "";
      await setCheckin(checkin);
    }
  }

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await qrcode_model.insertQrcode({
        classgroup_code: checkin.classgroup_code,
        qr_code: checkin.qr_code,
        qr_No: checkin.qr_No,
        qr_timestamp: time_controller.reformatToDateTime(new Date()),
        qr_timeout: checkin.qr_timeout,
      });
      if (query_result.require) {
        Swal.fire("Save success!!", "", "success");
      } else {
        Swal.fire("Sorry, Someting worng !", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (checkin.qr_timeout === "") {
      Swal.fire({
        title: "Warning!",
        text: "โปรดระบุ เวลาหมดสิทธิ์เช็คชื่อ",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
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
                    <CLabel>ระบุเวลาที่เปิดให้เช็คชื่อ (วินาที)</CLabel>
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
                    <div alignItems="center">
                      <br />
                      <CButton
                        color="primary"
                        onClick={() => generateQrCode()}
                      >
                        สร้างคิวอาร์โค้ด
                      </CButton>
                      <br />
                      {qrcode.show ? (
                        <>
                          <img src={encoded} /> <p>{decoded}</p>{" "}
                        </>
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
