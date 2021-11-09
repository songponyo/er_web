import React, { useEffect, useState } from "react"; 
import { 
  CCard,
  CCardFooter,
  CButton,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";  
import { Table } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function Grouplist() { 
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setClassgroup(classgroup_data.data);
  }
 

  return (
    <div>
      <CCard>
        <CCardHeader className="header-t-red">กลุ่มเรียนทั้งหมด</CCardHeader>
        <CCardBody>
          <Table
            showRowNo={true}
            dataSource={classgroup}
            dataTotal={classgroup}
            rowKey=""
            columns={[
              {
                title: "กลุ่มเรียน",
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
              // {
              //   title: "#",
              //   dataIndex: "",
              //   align: "center",
              //   render: (cell) => {
              //     const row_accessible = [];
              //     row_accessible.push(
              //       <Link
              //         key="register"
              //         to={`/course-student/register/${cell.classgroup_code}`}
              //         title="สมัครสมาชิก"
              //       >
              //         <button type="button" className="btn btn-primary">

              //           <FontAwesomeIcon
              //             icon={faAddressCard}
              //             size="5s"
              //             color="white"
              //           />
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
        <CCardFooter>
          <Link to="/class-group">
            <CButton color="btn btn-danger">ย้อนกลับ</CButton>
          </Link>
        </CCardFooter>
      </CCard>
    </div>
  );
}
