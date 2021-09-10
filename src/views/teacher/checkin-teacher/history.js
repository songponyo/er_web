import React, { useState, useEffect } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { faAddressBook, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "../../../component/revel-strap";

import QrcodeModel from "../../../models/QrcodeModel";
import { TimeController } from "../../../controller";

const qrcode_model = new QrcodeModel();
const time_controller = new TimeController();

export default function History() {
  let history = useHistory();
  let code = useRouteMatch("/checkin-teacher/history/:code");
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));
    const qrcode_data = await qrcode_model.getQrcodeBy({
      keyword: code.params.code,
      owner: user_session.user_code,
    }); 
    setClassgroup(qrcode_data.data);
  }

  async function _handleSubmit() {}

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    setClassgroup({ ...classgroup, [name]: value });
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน / Name list
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={false}
            dataSource={classgroup}
            dataTotal={classgroup}
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
                title: "วันที่",
                dataIndex: "qr_timeout",
                render: (cell) => {
                  let time = time_controller.reformatToDate(cell); 
                  return time
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "เวลาเข้าเช็คชื่อ",
                dataIndex: "qr_timeout",
                render: (cell) => {
                  let time = time_controller.reformatToTime(cell); 
                  return time
                },
                filterAble: true,
                align: "center",
                width: 120,
              },  
              {
                title: "จัดการ",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];

                  row_accessible.push(
                    <Link
                      key="detail"
                      to={`/checkin-teacher/detail/${cell.qr_code}`}
                      title="รายชื่อที่เข้าเรียน"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faAddressBook}
                          size="5s"
                          color="white"
                        /> รายชื่อ
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
    </>
  );
}
