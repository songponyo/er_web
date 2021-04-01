import React from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  FormGroup,
  Row,
} from "reactstrap";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

import { Loading } from "../../../component/revel-strap";

import ModalRemark from "./remark.modal";

import { TimeFormat } from "../../../utility";

import InvoiceCustomerListModel from "../../../models/InvoiceCustomerListModel";
import PurchaseRequestModel from "../../../models/PurchaseRequestModel";
import PurchaseRequestListModel from "../../../models/PurchaseRequestListModel";
import StockBalance from "../../../models/StockBalanceModel";

const time_format = new TimeFormat();

const invoice_customer_list_model = new InvoiceCustomerListModel();
const purchase_request_model = new PurchaseRequestModel();
const purchase_request_list_model = new PurchaseRequestListModel();
const stock_balance_model = new StockBalance();

class Detail extends React.Component {
  constructor(props) {
    super(props);
    const now = new Date(),
      y = now.getFullYear(),
      m = now.getMonth(),
      d = now.getDate();
    this.state = {
      loading: true,
      show_modal: false,
      purchase_request_code: "",
      user_name: "",
      purchase_request_date: "",
      purchase_request_approve_status: "",
      purchase_request_approve_date: "",
      purchase_request_approve_by: "",
      purchase_request_revise_code: "",
      purchase_request_revise_no: "",
      purchase_request_approve_remark: "",
      purchase_request_cancel: "",
      purchase_request_status: "",
      addby_name: "",
      addby: "",
      adddate: "",
      updateby_name: "",
      lastupdate: "",
      average_sale_product_date_start: new Date(y, m, d, 0, 0, 0),
      average_sale_product_date_end: new Date(y, m - 3, d, 0, 0, 0),
      purchase_request_lists: [],
      purchase_orders: [],
    };
  }

  componentDidMount() {
    this._fetchData();
  }
  async componentDidUpdate(props_old) {
    if (this.props.location.pathname !== props_old.location.pathname) {
      this._fetchData();
    }
  }

  _fetchData() {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const { code } = this.props.match.params;
        let {
          average_sale_product_date_start,
          average_sale_product_date_end,
        } = this.state;

        const purchase_request = await purchase_request_model.getPurchaseRequestByCode(
          { purchase_request_code: code }
        );
        if (purchase_request.require === false) {
          Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", "", "error");
          this.props.history.push("/purchase-request/");
        } else if (purchase_request.data.length === 0) {
          Swal.fire("ไม่พบรายการนี้ในระบบ !", "", "warning");
          this.props.history.push("/purchase-request/");
        } else {
          const {
            purchase_request_code,
            user_name,
            purchase_request_date,
            purchase_request_approve_status,
            purchase_request_approve_date,
            purchase_request_approve_by,
            purchase_request_revise_code,
            purchase_request_revise_no,
            purchase_request_approve_remark,
            purchase_request_cancel,
            addby_name,
            adddate,
            updateby_name,
            lastupdate,
          } = purchase_request.data[0];

          const purchase_request_lists = await purchase_request_list_model.getPurchaseRequestListBy(
            { purchase_request_code: purchase_request_code }
          );

          // for (let i = 0; i < purchase_request_lists.data.length; i++) {
          //   const product_qty_balance_result = await stock_balance_model.getStockQtyBy(
          //     { product_code: purchase_request_lists.data[i].product_code }
          //   );
          //   const sale_product_qty_average_result = await invoice_customer_list_model.getInvoiceCustomerListAverageBy(
          //     {
          //       product_code: purchase_request_lists.data[i].product_code,
          //       date_start: average_sale_product_date_start,
          //       date_end: average_sale_product_date_end,
          //     }
          //   );

          //   const product_qty =
          //     product_qty_balance_result.data[0].stock_balance_qty;
          //   const sale_product_qty_average =
          //     sale_product_qty_average_result.data[0].sale_average_qty_list;

          //   purchase_request_lists.data[i].product_qty_balance = product_qty;
          //   purchase_request_lists.data[
          //     i
          //   ].sale_product_qty_average = sale_product_qty_average;
          // }

          const purchase_orders = await purchase_request_model.getPurchaseRequestOrderByCode(
            { purchase_request_code: purchase_request_code }
          );

          this.setState({
            loading: false,
            show_modal: false,
            purchase_request_code: purchase_request_code,
            user_name: user_name,
            purchase_request_date: time_format.strToDate(purchase_request_date),
            purchase_request_approve_status: purchase_request_approve_status,
            purchase_request_approve_date: time_format.strToDate(
              purchase_request_approve_date
            ),
            purchase_request_approve_by: purchase_request_approve_by,
            purchase_request_revise_code: purchase_request_revise_code,
            purchase_request_revise_no: purchase_request_revise_no,
            purchase_request_approve_remark: purchase_request_approve_remark,
            purchase_request_cancel: purchase_request_cancel,
            addby_name: addby_name,
            adddate: time_format.strToDate(adddate),
            updateby_name: updateby_name,
            lastupdate: time_format.strToDate(lastupdate),
            purchase_request_lists: purchase_request_lists.data,
            purchase_orders: purchase_orders.data,
          });
        }
      }
    );
  }
  _onApproved() {
    this.setState({
      loading: true,
    }, async () => {
      if (this._checkSubmit()) {
        const result = await purchase_request_model.approvePurchaseRequestBy({
          purchase_request_code: this.state.purchase_request_code,
          purchase_request_approve_status: "Approve",
          purchase_request_approve_by: this.props.USER.user_code,
          purchase_request_approve_remark: "",
        })
        this.setState({
          loading: false,
        }, () => {
          if (result.require) {
            Swal.fire({ title: "อนุมัติสำเร็จ !", icon: "success", })
            this.props.history.push('/purchase-request')
          } else {
            Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error", })
          }
        })
      } else {
        this.setState({
          loading: false,
        })
      }
    })
  }
  _checkSubmit() {
    if (this.state.purchase_request_lists.length) {
      for (let i = 0; i < this.state.purchase_request_lists.length; i++) {
        let {
          product_code,
          purchase_request_list_qty,
        } = this.state.purchase_request_lists[i];
        if (product_code === "") {
          Swal.fire("กรุณาระบุสินค้า / Please input Product");
          return false;
        } else if (purchase_request_list_qty === "") {
          Swal.fire("กรุณาระบุจำนวนสินค้า / Please input Qty");
          return false;
        }
      }
      return true;
    } else {
      return false;
    }
  }

  _onNotApproved(data) {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const result = await purchase_request_model.approvePurchaseRequestBy({
          purchase_request_code: this.state.purchase_request_code,
          purchase_request_approve_status: "not_Approve",
          purchase_request_approve_by: this.props.USER.user_code,
          purchase_request_approve_remark: data.purchase_request_approve_remark,
        });

        this.setState(
          {
            loading: false,
          },
          () => {
            if (result.require) {
              Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success" });
              this.props.history.push("/purchase-request");
            } else {
              Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error" });
            }
          }
        );
      }
    );
  }

  _onWaiting() {
    this.setState(
      {
        loading: true,
      },
      async () => {
        const result = await purchase_request_model.approvePurchaseRequestBy({
          purchase_request_code: this.state.purchase_request_code,
          purchase_request_approve_status: "Waiting",
          purchase_request_approve_by: this.props.USER.user_code,
        });

        this.setState(
          {
            loading: false,
          },
          () => {
            if (result.require) {
              Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success" });
              this.props.history.push("/purchase-request");
            } else {
              Swal.fire({ title: "เกิดข้อผิดพลาด !", icon: "error" });
            }
          }
        );
      }
    );
  }

  _exportData() {
    var f = document.getElementById("form_export");

    f.purchase_request.value = JSON.stringify({
      purchase_request_code: this.state.purchase_request_code,
      user_name: this.state.user_name,
      purchase_request_date: time_format.showDateTH(
        this.state.purchase_request_date
      ),
      purchase_request_approve_remark: this.state.purchase_request_approve_remark,
    });
    f.purchase_request_lists.value = JSON.stringify(
      this.state.purchase_request_lists
    );

    f.action = `http://localhost/giftshop_export/?export=purchase_request`;
    f.submit();
  }

  render() {
    const { permission_approve } = this.props.PERMISSION;

    const approve_button = [];

    if (permission_approve && this.state.purchase_request_cancel === 0) {
      if (this.state.purchase_request_approve_status === "Waiting") {
        approve_button.push(
          <Button
            key="approve"
            className="btn-success"
            type="button"
            onClick={() => this._onApproved()}
          >
            อนุมัติ
          </Button>
        );
        approve_button.push(
          <Button
            key="not-approve"
            className="btn-danger"
            style={{ marginLeft: "5px" }}
            type="button"
            onClick={() => this.setState({ show_modal: true })}
          >
            ไม่อนุมัติ
          </Button>
        );
      } else if (!this.state.purchase_orders.length) {
        approve_button.push(
          <Button
            key="wait"
            type="button"
            className="btn-warning"
            color="warning"
            onClick={() => this._onWaiting()}
          >
            รออนุมัติ
          </Button>
        );
      }
    }
    return (
      <div className="animated fadeIn">
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader className="header-t-red">
            รายละเอียดใบร้องขอซื้อ [{" "}
            <font color="#ffc107">
              {this.state.purchase_request_approve_status}
            </font>{" "}
            ]
          </CardHeader>
          <CardBody>
            <FormGroup className="text-right">
              <Button color="danger" onClick={() => this._exportData()}>
                <i className="fa fa-print" aria-hidden="true"></i> Print PDF
              </Button>
            </FormGroup>
            <Row>
              <Col md="8">
                <Card>
                  <CardBody>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ width: 90 }}>
                            <b>ผู้ร้องขอ </b>
                          </td>
                          <td>{this.state.user_name}</td>
                        </tr>
                        <tr>
                          <td style={{ verticalAlign: "top" }}>
                            <b>หมายเหตุ </b>
                          </td>
                          <td style={{ whiteSpace: "pre-line" }}>
                            {this.state.purchase_request_approve_remark}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
              <Col md="4">
                <Card>
                  <CardBody>
                    <table>
                      <tbody>
                        <tr>
                          <td style={{ width: 120 }}>
                            <b>เลขที่ร้องขอซื้อ </b>
                          </td>
                          <td style={{ paddingLeft: 15 }}>
                            {this.state.purchase_request_code}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            <b>ร้องขอเมื่อ </b>
                          </td>
                          <td style={{ paddingLeft: 15 }}>
                            {time_format.showDateTH(
                              this.state.purchase_request_date
                            )}
                          </td>
                        </tr>
                        {this.state.purchase_orders.length ? (
                          <tr>
                            <td style={{ verticalAlign: "top" }}>
                              <b>เลขที่ใบสั่งซื้อ </b>
                            </td>
                            <td style={{ paddingLeft: 15 }}>
                              {this.state.purchase_orders.map((item) => (
                                <div>
                                  <Link
                                    to={
                                      `/purchase-order/detail/` +
                                      item.purchase_order_code
                                    }
                                  >
                                    {item.purchase_order_code}
                                  </Link>
                                </div>
                              ))}
                            </td>
                          </tr>
                        ) : null}
                      </tbody>
                    </table>
                  </CardBody>
                </Card>
              </Col>
            </Row>
            <table className="table table-bordered table-hover">
              <thead style={{ backgroundColor: "lightgray" }}>
                <tr>
                  <th style={{ textAlign: "center", width: 48 }}>ลำดับ </th>
                  <th style={{ textAlign: "center" }}>รหัสสินค้า </th>
                  <th style={{ textAlign: "center" }}>รายละเอียด </th>
                  <th style={{ textAlign: "center" }}>ผู้ขาย </th>
                  <th style={{ textAlign: "center" }}>คลังสินค้า </th>
                  <th style={{ textAlign: "center", width: 160 }}>จำนวน </th>
                  {/* <th style={{ textAlign: "center", width: 160 }}>
                    จำนวนคงเหลือในคลัง{" "}
                  </th> */}
                  {/* <th style={{ textAlign: "center", width: 160 }}>
                    ยอดขายเฉลี่ย 3 เดือน{" "}
                  </th> */}
                  <th style={{ textAlign: "center" }}>หมายเหตุ </th>
                </tr>
              </thead>
              <tbody>
                {this.state.purchase_request_lists.map((item, idx) => (
                  <tr key={idx}>
                    <td style={{ textAlign: "center" }}>{idx + 1}</td>
                    <td>{item.product_code}</td>
                    <td>{item.product_name}</td>
                    <td>{item.supplier_name}</td>
                    <td style={{ textAlign: "center" }}>
                      {item.stock_group_name}
                    </td>
                    <td style={{ textAlign: "center" }}>
                      {item.purchase_request_list_qty}
                    </td>
                    {/* <td style={{ textAlign: "center" }}>
                      {item.product_qty_balance}
                    </td> */}
                    {/* <td style={{ textAlign: "center" }}>
                      {item.sale_product_qty_average}
                    </td> */}
                    <td>{item.purchase_request_list_remark}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="text-muted small">
              เพิ่มโดย : {this.state.addby_name}{" "}
              {time_format.showDateTimeTH(this.state.adddate)}
            </div>
            <div className="text-muted small">
              แก้ไขล่าสุด : {this.state.updateby_name}{" "}
              {time_format.showDateTH(this.state.lastupdate)}
            </div>
            <div className="d-none">
              <form id="form_export" method="post" target="_blank">
                <input name="purchase_request" />
                <input name="purchase_request_lists" />
              </form>
            </div>
          </CardBody>
          <CardFooter className="text-right">
            {approve_button}
            <Link to="/purchase-request">
              <Button type="button">Back </Button>
            </Link>
          </CardFooter>
        </Card>
        <ModalRemark
          show={this.state.show_modal}
          data={{ purchase_request_code: this.state.purchase_request_code }}
          onRefresh={() => this.setState({ show_modal: false })}
          onSave={this._onNotApproved.bind(this)}
        />
      </div>
    );
  }
}

export default Detail;
