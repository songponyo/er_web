import React, { useState, useEffect } from "react"; 
import { Link } from "react-router-dom";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCardFooter,
  CCol,
  CRow, 
  CLabel,
  CInput,
  CButton,
  CImg,
} from "@coreui/react"; 
import Swal from "sweetalert2";
import { useHistory } from "react-router-dom";
import { Uploadimage } from "../../../controller"; 

const upload_contoller = new Uploadimage();

export default function Insert() {
  let history = useHistory();
  const [image, setImage] = useState({
    img_name: {
      src: "default.png",
      file: null,
      old: "",
    },
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {};

  async function _handleSubmit() { 
    const res_upload = await upload_contoller.uploadFile({
      src: image.img_name,
      upload_path: "leave/",
    }); 
  }

  const _handleImageChange = (img_name, e) => {
    if (e.target.files.length) {
      let file = new File([e.target.files[0]], e.target.files[0].name, {
        type: e.target.files[0].type,
      });
      if (file !== undefined) {
        let reader = new FileReader();
        reader.onloadend = () => {
          let new_material = { ...image };
          new_material[img_name] = {
            src: reader.result,
            file: file,
            old: new_material[img_name].old,
          };
          setImage(new_material);
        };
        reader.readAsDataURL(file);
      }
    }
  };

  return (
    <div>
      <div className="animated fadeIn">
        <CCard>
          <CCardHeader className="header-t-red">
            รายวิชาที่ต้องการลา
          </CCardHeader>
          <CCardBody>
            <CRow>
              <CCol md="6">
                <CLabel>อัพโหลดภาพ </CLabel>
                <br />
                <CImg
                  name="logo"
                  style={{ width: "350px", alignSelf: "center" }}
                  src={image.img_name.src}
                  alt="Logo"
                />
                <br />
                <br />
                <CInput
                  type="file"
                  name="img_name"
                  style={{ border: "none" }}
                  accept="image/png, image/jpeg"
                  onChange={(e) => _handleImageChange("img_name", e)}
                />
              </CCol>
            </CRow>
          </CCardBody>

          <CCardFooter>
            <CButton
              type="submit"
              color="success"
              onClick={() => _handleSubmit()}
            >
              บันทึก
            </CButton>
            <Link to="/leave-student">
              <CButton color="btn btn-danger">ย้อนกลับ</CButton>
            </Link>
          </CCardFooter>
        </CCard>
      </div>
    </div>
  );
}
