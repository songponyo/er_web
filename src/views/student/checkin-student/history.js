import React, { useEffect, useState } from "react";
import {
  CCardFooter,
  CCard,
  CCardHeader,
  CCardBody,
  CButton,
} from "@coreui/react";
import { Link, useRouteMatch } from "react-router-dom";
// import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"; 
import {
  faEdit,
  // faCheck,
  // faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import { Table } from "../../../component/revel-strap"; 
import QrcodeModel from "../../../models/QrcodeModel";
import dayjs from "dayjs"; 

const qrcode_model = new QrcodeModel();

export default function History() {
  let code = useRouteMatch("/checkin-student/history/:code");
  const [checkin, setCheckin] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const checkin_data = await qrcode_model.getQrcodeBy({
      keyword: code.params.code,
      // owner: user_session.user_code
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
                title: "เวลาเช็คชื่อ",
                dataIndex: "qr_timeout",
                render: (cell) => {
                  if (cell != null) {
                    let time = dayjs(cell).format('HH:mm');
                    return time;
                  } else {
                    return (
                      <span className="text-danger">ไม่มีการเช็คชื่อ</span>
                    );
                  }
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "เวลาเข้าเรียน",
                dataIndex: "checkin_time",
                render: (cell) => {
                  if (cell != null) {
                    let time = dayjs(cell).format('HH:mm');
                    return time;
                  } else {
                    return (
                      <span className="text-danger">ไม่มีการเช็คชื่อ</span>
                    );
                  }
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "สถานะเรียนเรียน",
                dataIndex: "checkin_status",
                render: (cell) => {
                  if (cell === "Active") {
                    return <span className="text-success">ทันเวลา</span>;
                  } else {
                    return cell !== "Inactive" ? (
                      cell !== "Leave" ? (
                        <span className="text-danger">ขาดเรียน</span>
                      ) : (
                        <span className="text-danger">ลา</span>
                      )
                    ) : (
                      <span className="text-danger">ไม่ทันเวลา</span>
                    );
                  }
                },
                filters: [
                  { text: "ทันเวลา", value: "Active" },
                  { text: "ไม่ทันเวลา", value: "Inactive" },
                  { text: "ลา", value: "Leave" },
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
                      key="checkin"
                      to={`/checkin-student/checkin/${cell.qr_code_check}`}
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
