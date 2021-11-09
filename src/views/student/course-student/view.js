import React, {  useEffect, useState } from "react"; 
import { 
  CCard,
  CCardHeader,
  CCardBody,
} from "@coreui/react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faAddressCard
} from "@fortawesome/free-solid-svg-icons";
import Swal from "sweetalert2";
import { Table } from "../../../component/revel-strap";
import ClassgroupModel from "../../../models/ClassgroupModel";
const classgroup_model = new ClassgroupModel();

export default function View() { 
  const [classgroup, setClassgroup] = useState([]);

  useEffect(() => {
    _fetchData();
  }, []);

  async function _fetchData() {
    const classgroup_data = await classgroup_model.getClassgroupBy({});
    setClassgroup(classgroup_data.data);
  }

  function _onDelete(data) {
    Swal.fire({
      title: "Are you sure ?",
      text: "ยืนยันที่จะลบรายการนี้" + data.classgroup_code,
      icon: "warning",
      showCancelButton: true,
    }).then((result) => {
      if (result.isConfirmed) { 
        classgroup_model
          .deleteClassgroupByCode({ classgroup_code: data.classgroup_code })
          .then((res) => {
            if (res.require) { 
              Swal.fire("ลบรายการ เรียบร้อย", "", "success");
              window.location.reload();
            } else { 
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
        </CCardHeader>
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
              {
                title: "#",
                dataIndex: "",
                align: "center",
                render: (cell) => {
                  const row_accessible = [];
                  row_accessible.push(
                    <Link
                      key="register"
                      to={`/course-student/register/${cell.classgroup_code}`}
                      title="สมัครสมาชิก"
                    >
                      <button type="button" className="btn btn-primary">

                        <FontAwesomeIcon
                          icon={faAddressCard}
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
