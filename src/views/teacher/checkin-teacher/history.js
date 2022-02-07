import React, { useState, useEffect } from "react";
import { CCard, CCardHeader, CCardBody } from "@coreui/react";
import { faAddressBook } from "@fortawesome/free-solid-svg-icons";
import { Link, useRouteMatch } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Table } from "../../../component/revel-strap";
import dayjs from "dayjs"; 
import QrcodeModel from "../../../models/QrcodeModel";

const qrcode_model = new QrcodeModel(); 


 
export default function History() { 
  let code = useRouteMatch("/checkin-teacher/history/:code");
  const [classgroup, setClassgroup] = useState([]);


  useEffect(() => {
    fetchData();
  }, []);
  async function fetchData() {
    // const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    const qrcode_data = await qrcode_model.getQrcodeBy({
      keyword: code.params.code,
      // owner: user_session.user_code,
    }); 
    let classArr = {}
    classArr.classname = qrcode_data.data[0].subject_fullname
    classArr.Arr = qrcode_data.data 
    setClassgroup(classArr);
  } 
 
  return (
    <>
      <CCard>
        <CCardHeader className="header-t-red">
          รายชื่อเข้าเรียน วิชา {classgroup.classname}
        </CCardHeader>
        <CCardBody>
          <Table
            showRowNo={false}
            dataSource={classgroup.Arr}
            dataTotal={classgroup.Arr} 
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
              // {
              //   title: "รหัสวิชา",
              //   dataIndex: "subject_fullname",
              //   filterAble: true,
              //   ellipsis: true,
              //   width: 150,
              //   align: "center",
              // },
              {
                title: "วันที่",
                dataIndex: "qr_timeout",
                render: (cell) => {
                  let time = dayjs(cell).format('DD/MM/YYYY')  
                  return time;
                },
                filterAble: true,
                align: "center",
                width: 120,
              },
              {
                title: "เวลาเข้าเช็คชื่อ",
                dataIndex: "qr_timeout",
                render: (cell) => {
                  let time = dayjs.tz(cell).format("HH:mm"); 
                  return time;
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
                      to={`/checkin-teacher/detail/${cell.qr_code}-${cell.classgroup_code}`}
                      title="รายชื่อที่เข้าเรียน"
                    >
                      <button type="button" className="btn btn-success">
                        <FontAwesomeIcon
                          icon={faAddressBook}
                          size="5s"
                          color="white"
                        />{" "}
                        รายชื่อ
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
