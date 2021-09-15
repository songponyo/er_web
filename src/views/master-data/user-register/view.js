import React, { useEffect, useState } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEdit,
  // faCheck,
  faWindowClose,
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import UserModel from "../../../models/UserModel";

const user_model = new UserModel();

export default function View() {
  const [user, setUser] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const user_data = await user_model.getUserByRegister({});
    setUser(user_data.data);
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
        user_model.deleteUserByCode({ user_code: data.user }).then((res) => {
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
          กลุ่มเรียน / Class group
          <Link
            to={`/user-register/insert`}
            className="btn btn-success float-right"
          >
            <i className="fa fa-plus" aria-hidden="true"></i> เพิ่มรูปภาพ
          </Link>
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={user}
            dataTotal={user}
            rowKey=""
            columns={[
              {
                title: "รหัสประจำตัว",
                dataIndex: "user_uid",
                filterAble: true,
                ellipsis: true,
                width: 120,
                align: "center",
              },
              {
                title: "ชื่อ",
                dataIndex: "user_full_name",
                filterAble: true,
                ellipsis: true,
                width: 150,
                align: "center",
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
                      to={`/user-register/update/${cell.user_code}`}
                      title="แก้ไขรายการ"
                    >
                      <button type="button" className="btn btn-primary">
                        <FontAwesomeIcon
                          icon={faEdit}
                          size="5s"
                          color="white"
                        />{" "}
                        ข้อมูล
                      </button>
                    </Link>
                  );

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
                      /> ลบ
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
