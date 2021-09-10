import React, { useState, useEffect } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { faAddressBook, faQrcode } from "@fortawesome/free-solid-svg-icons";
import { Link, useHistory, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "../../../component/revel-strap";
import { TimeController } from "../../../controller"; 
import CheckinModel from "../../../models/CheckinModel";
 
const time_controller = new TimeController();
const checkin_model = new CheckinModel();

export default function Detail() {
  let code = useRouteMatch("/checkin-teacher/detail/:code");
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const qrcode_data = await checkin_model.getCheckinByCode({ 
      qr_code: code.params.code, 
    });

    setClassgroup(qrcode_data.data);
  }

  async function _handleSubmit() {}

  const _changeFrom = (e) => {
    const { value, name } = e.target;
    let new_data = { ...classgroup };
    new_data[name] = value;
    setClassgroup(new_data);
  };

  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน / Name list
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
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
                dataIndex: "owner_fullname",
                filterAble: true,
                ellipsis: true,
                width: 150,
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
                // filters: [
                //   { text: "เสร็จสิ้น", value: "complete" },
                //   { text: "รออนุมัติ", value: "Waiting" },
                // ],
                align: "center",
                width: 120,
              },
              // {
              //   title: "จัดการ",
              //   dataIndex: "",
              //   align: "center",
              //   render: (cell) => {
              //     const row_accessible = [];

              //     row_accessible.push(
              //       <Link
              //         key="update"
              //         to={`/checkin-teacher/qrcode/${cell.classgroup_code}`}
              //         title="สร้างรายการเช็คชื่อ"
              //       >
              //         <button type="button" className="btn btn-warning">
              //           <FontAwesomeIcon
              //             icon={faQrcode}
              //             size="5s"
              //             color="white"
              //           /> แก้ไข
              //         </button>
              //       </Link>
              //     ); 

              //     return row_accessible;
              //   },
              //   width: 120,
              // },
            ]}
          />
        </CCardBody>
      </CCard>
    </>
  );
}
