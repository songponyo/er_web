import React, { Component, useEffect, useState } from "react";
import {
  CContainer,
  CRow,
  CCol,
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  faCheck,
  faWindowClose,
  faInfoCircle,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table, Loading } from "../../../component/revel-strap";
import LeaveModel from "../../../models/LeaveModel";
const leave_model = new LeaveModel();

export default function View() {
  const [showloading, setShowLoading] = useState(true);
  const [leave, setLeave] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const leave_data = await leave_model.getLeaveBy({
      owner_code : user_session.user_code
    });
    setLeave(leave_data.data);
  }

  // function _onDelete(data) {
  //   Swal.fire({
  //     title: "Are you sure ?",
  //     text: "ยืนยันที่จะลบรายการนี้" + data.leave_code,
  //     icon: "warning",
  //     showCancelButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) {
  //       setShowLoading(true);
  //       leave_model
  //         .deleteLeaveByCode({ leave_code: data.leave_code })
  //         .then((res) => {
  //           if (res.require) {
  //             setShowLoading(false);
  //             Swal.fire("ลบรายการ เรียบร้อย", "", "success");
  //             window.location.reload();
  //           } else {
  //             setShowLoading(false);
  //             Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
  //           }
  //         });
  //     }
  //   });
  // }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          คำขอลา / Leave list 
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={leave}
            dataTotal={leave}
            rowKey=""
            columns={[
              {
                title: "ชื่อวิชา",
                dataIndex: "subject_name",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "ชื่อ",
                dataIndex: "user_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "สถานะ",
                dataIndex: "leave_approve",
                render: (cell) => {
                  if (cell === "Waiting") {
                    return <span className="text-danger">รออนุมัติ</span>;
                  } else {
                    return (
                      <span className="text-success">เสร็จสิ้น</span>
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
                title: "การจัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="detail"
                      to={`/leave-form/detail/${cell.leave_code}`}
                      title="ดูรายละเอียด"
                    >
                      <button type="button" className="btn btn-info">
                        <FontAwesomeIcon
                          icon={faInfoCircle}
                          size="5s"
                          color="white"
                        />
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
      </CCard>
    </div>
  );
}
