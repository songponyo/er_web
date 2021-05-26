import React, { useState, useEffect } from "react";
import QRCode from 'qrcode';
import QrReader from 'react-qr-reader';



import {
    CCard,
    CCardHeader,
    CCardBody,
    CCardFooter,
    CCol,
    CRow,
    CFormGroup,
    CLabel,
    CInput,
    CButton,
    CContainer,
} from "@coreui/react";
import Swal from "sweetalert2";
import { Link, useHistory, useRouteMatch } from "react-router-dom";

import ClassgroupModel from "../../../models/ClassgroupModel"
import ScoreModel from "../../../models/ScoreModel"

const score_model = new ScoreModel();
const classgroup_model = new ClassgroupModel();


export default function Qrcode() {
    let history = useHistory();
    const [showloading, setShowLoading] = useState(true);
    let code = useRouteMatch("/checkin-teacher/qrcode/:code");
    const [text, setText] = useState('');
    const [imageUrl, setImageUrl] = useState('');
    const [scanResultFile, setScanResultFile] = useState('');
    const [scanResultWebCam, setScanResultWebCam] = useState('');
    const [classes, setClasses] = useState()
    const [qrRef, setQrRef] = useState(null)



    useEffect(() => {
        fetchData();
    }, []);
    async function fetchData() {
        const user_session = await JSON.parse(localStorage.getItem(`session-user`));

    }


    const generateQrCode = async () => {
        try {
            const response = await QRCode.toDataURL(text);
            setImageUrl(response);
        } catch (error) {
            console.log(error);
        }
    }
    const handleErrorFile = (error) => {
        console.log(error);
    }
    const handleScanFile = (result) => {
        if (result) {
            setScanResultFile(result);
        }
    }
    const onScanFile = () => {
        qrRef.current.openImageDialog();
    }
    const handleErrorWebCam = (error) => {
        console.log(error);
    }
    const handleScanWebCam = (result) => {
        if (result) {
            setScanResultWebCam(result);
        }
    }




    return (
        <>
            <CContainer>
                <CCard>
                    <CCardHeader className="header-t-red">
                        รายชื่อเข้าเรียน / Name list
                    </CCardHeader>
                    <CCardBody>
                        <CRow>
                            <CCol>
                                <CInput label="Enter Text Here" onChange={(e) => setText(e.target.value)} />
                                <br />
                                <CButton color="primary" onClick={() => generateQrCode()}>Generate</CButton>
                                <br />
                                <br />
                                <br />
                                {imageUrl ? (
                                    <a href={imageUrl} download>
                                        <img src={imageUrl} alt="img" />
                                    </a>) : null}
                            </CCol>
                            <CCol>

                            </CCol>
                        </CRow>

                    </CCardBody>
                </CCard>
            </CContainer>
        </>
    );
}
