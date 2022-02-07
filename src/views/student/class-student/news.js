import React, { useState, useEffect } from "react";
import {
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CFormGroup,
  CLabel,
  CFormText,
  CForm,
  CImg,
} from "@coreui/react";
import dayjs from "dayjs";
import "dayjs/locale/th";
import Swal from "sweetalert2";
import { useRouteMatch } from "react-router-dom";
import { Menu, Calendar, Badge } from "antd";

import NewsModel from "../../../models/NewsModel";
import ClassgroupModel from "../../../models/ClassgroupModel";
// import LineModel from "../../../models/LineModel";

const news_model = new NewsModel();
const classgroup_model = new ClassgroupModel();
// const line_model = new LineModel();

export default function News() {
  let code = useRouteMatch("/class-student/news/:code");
  // const [news, setNews] = useState({
  //   news_head: "",
  //   news_code: "",
  //   news_detail: "",
  //   news_notice_day: "",
  //   news_time: "",
  //   news_image: "",
  //   classgroup_code: "",
  //   adddate: "",
  //   addby: "",
  // });

  const [feednews, setFeednews] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchFeedData();
    setIsLoading(true);
  }, []);
  // console.log("news", news);

  async function fetchFeedData() {
    const news_feed = await news_model.getNewsByCode({
      classgroup_code: code.params.code,
    });
    setFeednews(news_feed.data);
  }

  function getDateData(value) {
    let dateformat = dayjs(value._d).format("DD-MM-YYYY");
    let appointment = feednews
      .filter((appoint) => appoint.news_notice_day !== null)
      .map((item) => {
        return item.news_notice_day;
      });

    let aptt = appointment.map((items) => {
      if (dateformat === items) {
        return <Badge status="warning"></Badge>;
      }
    });
    return aptt || [];
  }

  function dateCellRender(value) {
    const num = getDateData(value);
    return num ? (
      <div className="notes-month">
        <section>{num}</section>
      </div>
    ) : null;
  }

  return (
    <div align="center">
      {!isLoading ? (
        <div>
          <CImg src="https://cdn.dribbble.com/users/108183/screenshots/4543219/loader_backinout.gif" />
        </div>
      ) : (
        <>
          <CRow>
            <CCol xl="8">
              <CCard style={{ width: "100%", fontSize: "20px" }}>
              <CCardHeader
                  className="header-t-red"
                  style={{ fontSize: "20px" }}
                >ฟีดข่าว</CCardHeader>
                <CCardBody>
                  {/* inform */}
                  {feednews.map((data) => {
                    return (
                      <CCard>
                        <CCardHeader align="left">
                          <CRow>
                            <CCol>
                              <CForm>
                                <CFormGroup>
                                  <CLabel style={{ fontSize: "15px" }}>
                                    {data.owner_fullname}
                                  </CLabel>
                                  {/* <br /> */}
                                  <CFormText style={{ fontSize: "10px" }}>
                                    {dayjs(data.adddate)
                                      .locale("th")
                                      .format("DD MMMM YYYY")}
                                  </CFormText>
                                </CFormGroup>
                              </CForm>
                            </CCol>
                          </CRow>
                          {/* <CRow>
                            <CCol>{data.news_detail}</CCol>
                          </CRow> 
                          <CRow>
                            <CCol style={{fontSize : "15px"}}> <strong>วันที่นัดหมาย</strong> {data.news_notice_day}</CCol>
                          </CRow> */}
                        </CCardHeader>
                        <CCardBody fontSize="15px" align="left">
                          <CRow>
                            <CCol>{data.news_detail}</CCol>
                          </CRow>
                          <CRow>
                            <CCol style={{ fontSize: "15px" }}>
                              {" "}
                              <strong>วันที่นัดหมาย</strong>{" "}
                              {data.news_notice_day}
                            </CCol>
                          </CRow>
                        </CCardBody>
                      </CCard>
                    );
                  })}
                </CCardBody>
              </CCard>
            </CCol>
            <CCol>
              <CRow>
                <CCol>
                  <div className="site-calendar-demo-card">
                    <Calendar
                      fullscreen={false}
                      dateCellRender={dateCellRender}
                      // monthCellRender={monthCellRender}
                    />
                  </div>
                </CCol>
              </CRow>
            </CCol>
          </CRow>
        </>
      )}
    </div>
  );
}
