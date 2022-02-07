import React, { useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit, faWindowClose } from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import LeaveModel from "../../../models/LeaveModel";
const leave_model = new LeaveModel();

export default function View() {
  // const [showloading, setShowLoading] = useState(true);
  const [leave, setLeave] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const leave_data = await leave_model.getLeaveBy({
      addby: user_session.user_code,
    });
    setLeave(leave_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "คุณแน่ใจใช่ไหม",
      text: "ยืนยันที่จะลบรายการนี้",
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) {
        // setShowLoading(true);
        leave_model
          .deleteLeaveByCode({ leave_code: data.leave_code })
          .then((res) => {
            if (res.require) {
              // setShowLoading(false);
              Swal.fire("ลบเรียบร้อย", "", "success");
              window.location.reload();
            } else {
              // setShowLoading(false);
              Swal.fire("ขออภัย มีบางอย่างผิดพลาด", "", "error");
            }
          });
      }
    });
  }

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">
          รายการคำร้องขอ
          <Link
            to={`/leave-student/insert`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> ยื่นขออนุญาติ
          </Link>
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
                    return <p>รออนุมัติ</p>
                  } else {
                    return cell !== "NotAccept" ? (
                      <span className="text-success">อนุมัติ</span>
                    ) : (
                      <span className="text-danger">ไม่อนุมัติ</span>
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
                  if (cell.leave_approve !== "Waiting") {
                    row_accessible.push(
                      <Link
                        key="detail"
                        to={`/leave-student/detail/${cell.leave_code}`}
                        title="รายละเอียดคำร้อง"
                      >
                        <button type="button" className="btn btn-success">
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="5s"
                            color="white"
                          />{" "}
                          รายละเอียด
                        </button>
                      </Link>
                    );
                  } else {
                    row_accessible.push(
                      <Link
                        key="update"
                        to={`/leave-student/update/${cell.leave_code}`}
                        title="แก้ไข"
                      >
                        <button type="button" className="btn btn-warning">
                          <FontAwesomeIcon
                            icon={faEdit}
                            size="5s"
                            color="white"
                          />{" "}
                          แก้ไข
                        </button>
                      </Link>
                    );
                  }

                  row_accessible.push(
                    <button
                      type="button"
                      className={"btn btn-danger"}
                      onClick={() => _onDelete(cell)}
                    >
                      <FontAwesomeIcon
                        icon={faWindowClose}
                        size="5s"
                        color="white"
                      />{" "}
                      ลบ
                    </button>
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
