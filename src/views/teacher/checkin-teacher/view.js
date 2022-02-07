import React, {  useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAddressBook, faQrcode } from "@fortawesome/free-solid-svg-icons"; 
import { Table, } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() { 
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const classgroup_data = await classgroup_model.getClassgroupBy({
      owner: user_session.user_code,
    });
    setClassgroup(classgroup_data.data);
  }

  // function _onDelete(data) {
  //   Swal.fire({
  //     title: "Are you sure ?",
  //     text:
  //       "Confirm to delete " +
  //       data.classgroup_id +
  //       "   " +
  //       data.subject_fullname,
  //     icon: "warning",
  //     showCancelButton: true,
  //   }).then((result) => {
  //     if (result.isConfirmed) { 
  //       classgroup_model
  //         .deleteClassgroupByCode({
  //           classgroup_code: data.classgroup_code,
  //           table_name: data.classgroup_table_score,
  //         })
  //         .then((res) => {
  //           if (res.require) { 
  //             Swal.fire("ลบรายการ เรียบร้อย", "", "success");
  //             window.location.reload();
  //           } else { 
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
          รายการเช็คชื่อกลุ่มเรียน
          {/* <Link to={`/checkin-teacher/insert`} className="btn btn-success float-right">
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มกลุ่มเรียน
          </Link> */}
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={false}
            dataSource={classgroup}
            dataTotal={classgroup}
            rowKey=""
            columns={[
              {
                title: "รหัสกลุ่มเรียน",
                dataIndex: "classgroup_id",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "รหัสวิชา",
                dataIndex: "subject_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "ผู้รับผิดชอบ",
                dataIndex: "user_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
              },
              {
                title: "จัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

                  row_accessible.push(
                    <Link
                      key="qrcode"
                      to={`/checkin-teacher/qrcode/${cell.classgroup_code}`}
                      title="สร้างรายการเช็คชื่อ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faQrcode}
                          size="5s"
                          color="white"
                        />{" "}
                        คิวร์อาร์โค้ด
                      </button>
                    </Link>
                  );

                  row_accessible.push(
                    <Link
                      key="้history"
                      to={`/checkin-teacher/history/${cell.classgroup_code}`}
                      title="รายชื่อที่เข้าเรียน"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faAddressBook}
                          size="5s"
                          color="white"
                        />{" "}
                        ประวัติเช็คชื่อ
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
