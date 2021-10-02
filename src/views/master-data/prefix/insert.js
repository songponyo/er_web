import React, { useState } from "react";
import { Link } from "react-router-dom";
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
} from "@coreui/react";
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";

import PrefixModel from "../../../models/PrefixModel";
const prefix_model = new PrefixModel();

export default function Insert() {
  let history = useHistory();
  const [prefix, setPrefix] = useState({
    prefix_code: "",
    prefix_name: "",
  });

  async function _handleSubmit() {
    if (_checkSubmit()) {
      let query_result = await prefix_model.insertPrefix({
        prefix_code: prefix.prefix_code,
        prefix_name_th: prefix.prefix_name,
      });

      if (query_result.require) {
        Swal.fire("บันทึกเรียบร้อย", "", "success");
        history.push("/course");
      } else {
        Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
      }
    }
  }

  const _checkSubmit = () => {
    if (prefix.prefix_code === "") {
      Swal.fire({
        title: "แจ้งเตือน!",
        text: "โปรดเช็คชื่อรายวิชา",
        icon: "warning",
      });
      return false;
    } else {
      return true;
    }
  };

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setPrefix({ ...prefix, [name]: value });
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            เพิ่มคำนำหน้า
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol>
                <CRow>
                  <CCol md="3">
                    <CLabel>
                      คำนำหน้า{" "}
                      <font color="#F00">
                        <b>*</b>
                      </font>
                    </CLabel>
                    <CInput
                      type="text"
                      name="prefix_code"
                      value={prefix.prefix_code}
                      onChange={(e) => _changeFrom(e)}
                      // disabled
                    />
                    <p className="text-muted">ตัวอย่าง : นาย </p>
                  </CCol> 
                </CRow>
              </CCol>
            </CRow>
          </CCardBody>
          <CCardFooter>
            <CButton
              type="submit"
              color="success"
              onClick={() => _handleSubmit()}
            >
              บันทึก
            </CButton>
            <Link to="/course">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
