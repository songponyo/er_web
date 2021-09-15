import React, { useState, useEffect } from "react";
import ExcelPage from "../../../component/excelPage";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter, 
  CButton,
} from "@coreui/react";
import Swal from "sweetalert2";
import { Link, useHistory, useRouteMatch } from "react-router-dom"; 
import ClassgroupModel from "../../../models/ClassgroupModel";
 
const classgroup_model = new ClassgroupModel(); 
export default function Update() {
  let history = useHistory();
  const [showloading, setShowLoading] = useState(true);
  let code = useRouteMatch("/class-group/excel/:code");
  const [classroom, setClassroom] = useState({
    classgroup_code: "",
    classgroup_id: "",
    classgroup_number: "",
    subject_code: "",
    user_code: "",
    addby: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const class_group = await classgroup_model.getClassgroupByCode({
      classgroup_code: code.params.code,
    });

    if (class_group.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
      history.push("/class-group");
    } else if (class_group.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
      history.push("/class-group");
    } else {
      await setClassroom(class_group.data[0]);
    }
  }
  return (
    <div className="animated fadeIn">
      <CCard>
        <CCardHeader className="header-t-red">รายชื่อ / Name list</CCardHeader>
        <CCardBody>
          <ExcelPage data={classroom} />
        </CCardBody>
        <CCardFooter> 
          <Link to="/class-group">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
