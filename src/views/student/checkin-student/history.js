import React, { useEffect, useState } from "react";
import {
  CCardFooter,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
} from "@coreui/react";
import { Link } from "react-router-dom";
// import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  // faCheck,
  // faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "../../../component/revel-strap";
import CheckinModel from "../../../models/CheckinModel";
import { TimeController } from "../../../controller";

const time_controller = new TimeController();
const checkin_model = new CheckinModel();

export default function History() {
  const [showloading, setShowLoading] = useState(true);
  const [checkin, setCheckin] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const checkin_data = await checkin_model.getCheckinBy({
      user_code: user_session.user_code,
    });

    setCheckin(checkin_data.data);
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">บันทึกการเข้าเรียน</CCardHeader>
        <CCardBody>
          <Table
            showRowNo={false}
            dataSource={checkin}
            dataTotal={checkin}
            rowKey=""
            columns={[
              {
                title: "ครั้งที่",
                dataIndex: "qr_No",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "เวลาเข้าเรียน",
                dataIndex: "checkin_time",
                render: (cell) => {
                  let time = time_controller.reformatToTime(cell); 
                  return time
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "สถานะเรียน",
                dataIndex: "checkin_status",
                render: (cell) => { 
                  if (cell === "Active") {
                    return <span className="text-success">เข้าเรียน</span>;
                  } else {
                    return (
                      cell !== "Deactive" 
                    ? <span className="text-danger">ล่าช้า</span>
                    : <span className="text-danger">ลา</span>
                      
                      
                    );
                  }
                },
                filters: [
                  { text: "เสร็จสิ้น", value: "complete" },
                  { text: "รออนุมัติ", value: "Waiting" },
                ],
                align: "center",
                width: 120,
              },
              {  
                title: "เมนูจัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="update"
                      to={`/checkin-student/checkin/${cell.qr_code}`}
                      title="เช็คชื่อ"
                    >
                      <button type="button" className="btn btn-warning">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />{" "}
                        เช็คชื่อ
                      </button>
                    </Link>
                  );
                  return row_accessible;
                },
                width: 120,
              },
            ]}
          />
        </CCardBody>
        <CCardFooter>
          <Link to="/checkin-student">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
