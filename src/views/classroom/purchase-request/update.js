import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Form,
  FormGroup,
  Input,
  Label,
  Row,
} from 'reactstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import { DatePicker, Loading, Select, } from '../../../component/revel-strap'

import { HandleFilter, TimeFormat } from '../../../utility'

import ProductModel from '../../../models/ProductModel'
import PurchaseRequestModel from '../../../models/PurchaseRequestModel'
import PurchaseRequestListModel from '../../../models/PurchaseRequestListModel'
import StockGroupModel from '../../../models/StockGroupModel'
import SupplierModel from '../../../models/SupplierModel'
import UserModel from '../../../models/UserModel'
import StockBalance from "../../../models/StockBalanceModel";
import InvoiceCustomerListModel from "../../../models/InvoiceCustomerListModel"

const time_format = new TimeFormat()
const handle_filter = new HandleFilter()

const product_model = new ProductModel()
const purchase_request_model = new PurchaseRequestModel()
const purchase_request_list_model = new PurchaseRequestListModel()
const stock_group_model = new StockGroupModel()
const supplier_model = new SupplierModel()
const user_model = new UserModel()
const stock_balance_model = new StockBalance();
const invoice_customer_list_model = new InvoiceCustomerListModel();

class Update extends React.Component {
  constructor(props) {
    super(props)
    const now = new Date(), y = now.getFullYear(), m = now.getMonth(), d = now.getDate()
    this.state = {
      purchase_request_code: '',
      user_code: '',
      purchase_request_date: new Date(),
      purchase_request_remark: '',
      purchase_request_list: [],
      products: [],
      stock_groups: [],
      suppliers: [],
      users: [],
      average_sale_product_date_start: new Date(y, m, d, 0, 0, 0),
      average_sale_product_date_end: new Date(y, m - 3, d, 0, 0, 0),
    }
  }

  async componentDidMount() {
    this.setState({
      loading: true,
    }, async () => {
      const { code } = this.props.match.params
      let { average_sale_product_date_start, average_sale_product_date_end } = this.state;

      const purchase_request = await purchase_request_model.getPurchaseRequestByCode({ purchase_request_code: code })

      if (purchase_request.require === false) {
        Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", '', 'error')
        this.props.history.push('/purchase-request/')
      } else if (purchase_request.data.length === 0) {
        Swal.fire("ไม่พบรายการนี้ในระบบ !", '', 'warning')
        this.props.history.push('/purchase-request/')
      } else {
        const {
          purchase_request_code,
          purchase_request_date,
          purchase_request_remark,
        } = purchase_request.data[0]

        const purchase_request_list = await purchase_request_list_model.getPurchaseRequestListBy({ purchase_request_code: purchase_request_code })

        // for (let i = 0; i < purchase_request_list.data.length; i++) {
        //   const product_qty_balance_result = await stock_balance_model.getStockQtyBy({ product_code: purchase_request_list.data[i].product_code });
        //   const sale_product_qty_average_result = await invoice_customer_list_model.getInvoiceCustomerListAverageBy({ product_code: purchase_request_list.data[i].product_code, date_start: average_sale_product_date_start, date_end: average_sale_product_date_end });

        //   const product_qty = product_qty_balance_result.data[0].stock_balance_qty
        //   const sale_product_qty_average = sale_product_qty_average_result.data[0].sale_average_qty_list;

        //   purchase_request_list.data[i].product_qty_balance = product_qty
        //   purchase_request_list.data[i].sale_product_qty_average = sale_product_qty_average;
        // }

        const products = await product_model.getProductBy()
        const stock_groups = await stock_group_model.getStockGroupBy()
        const suppliers = await supplier_model.getSupplierBy()
        const users = await user_model.getUserBy()

        this.setState({
          loading: false,
          purchase_request_code: purchase_request_code,
          user_code: this.props.USER.user_code,
          purchase_request_date: time_format.strToDate(purchase_request_date),
          purchase_request_remark: purchase_request_remark,
          purchase_request_list: purchase_request_list.data,
          products: products.data,
          stock_groups: stock_groups.data,
          suppliers: suppliers.data,
          users: users.data,
        })
      }
    })
  }

  async _handleSubmit(event) {
    event.preventDefault()
    if (this._checkSubmit()) {
      this.setState({
        loading: true,
      }, async () => {
        const res = await purchase_request_model.updatePurchaseRequestBy({
          purchase_request_code: this.state.purchase_request_code,
          user_code: this.state.user_code,
          purchase_request_date: time_format.strToDate(this.state.purchase_request_date),
          purchase_request_remark: this.state.purchase_request_remark,
          updateby: this.props.USER.user_code,
          purchase_request_list: this.state.purchase_request_list.map(item => ({
            purchase_request_list_code: item.purchase_request_list_code,
            product_code: item.product_code,
            supplier_code: item.supplier_code,
            stock_group_code: item.stock_group_code,
            purchase_request_list_qty: item.purchase_request_list_qty,
            purchase_request_list_remark: item.purchase_request_list_remark,
          })),
        })

        this.setState({
          loading: false,
        }, () => {
          if (res.require) {
            Swal.fire({ title: "บันทึกข้อมูลสำเร็จ !", icon: "success", })
            this.props.history.push('/purchase-request/')
          } else {
            Swal.fire({ title: "เกิดข้อผิดพลาดในการบันทึก !", icon: "error", })
          }
        })
      })
    }
  }

  _checkSubmit() {
    if (this.state.user_code === "") {
      Swal.fire("กรุณาระบุผู้ร้องขอ / Please input Employee")
      return false
    } else {
      for (let i = 0; i < this.state.purchase_request_list.length; i++) {
        let { product_code, supplier_code, stock_group_code, purchase_request_list_qty } = this.state.purchase_request_list[i]

        if (product_code === '') {
          Swal.fire("กรุณาระบุสินค้า / Please input Product")
          return false
        } else if (purchase_request_list_qty === '') {
          Swal.fire("กรุณาระบุจำนวนสินค้า / Please input Qty")
          return false
        }
      }

      return true
    }
  }

  _addRow() {
    this.setState(state => {
      return {
        purchase_request_list: [
          ...state.purchase_request_list, {
            purchase_request_list_code: '',
            product_code: '',
            supplier_code: '',
            stock_group_code: '',
            purchase_request_list_qty: '',
            purchase_request_list_remark: '',
          }
        ],
      }
    })
  }

  _deleteRow(idx) {
    this.setState(state => {
      state.purchase_request_list.splice(idx, 1)

      return {
        purchase_request_list: state.purchase_request_list,
      }
    })
  }

  _handleListSelect = async (key, e, idx) => {
    let { products, purchase_request_list, average_sale_product_date_start, average_sale_product_date_end } = this.state;

    if (purchase_request_list[idx][key] !== e) {
      if (key === 'product_code') {
        const product = products.find(val => val.product_code === e)

        if (product === undefined) {
          purchase_request_list[idx].product_code = ''
        } else {
          const product_qty_balance_result = await stock_balance_model.getStockQtyBy({ product_code: product.product_code });
          const sale_product_qty_average_result = await invoice_customer_list_model.getInvoiceCustomerListAverageBy({ product_code: product.product_code, date_start: average_sale_product_date_start, date_end: average_sale_product_date_end });
          const product_qty_balance = product_qty_balance_result.data[0].stock_balance_qty;
          const sale_product_qty_average = sale_product_qty_average_result.data[0].sale_average_qty_list;

          purchase_request_list[idx].product_qty_balance = product_qty_balance;
          purchase_request_list[idx].sale_product_qty_average = sale_product_qty_average;
          purchase_request_list[idx].product_code = e
          purchase_request_list[idx].stock_group_code = product.stock_group_code
        }
      } else {
        purchase_request_list[idx][key] = e
      }

      this.setState({ purchase_request_list: purchase_request_list, })
    }
  }

  _handleListChange = (e, idx) => {
    const { name, value } = e.target

    if (handle_filter._inputFilter(e)) {
      let { purchase_request_list } = this.state

      purchase_request_list[idx][name] = value

      this.setState({ purchase_request_list: purchase_request_list, })
    }
  }

  render() {
    const product_options = this.state.products.map(item => ({
      label: '[' + item.product_code + ']' + item.product_name, value: item.product_code,
    }))

    const stock_group_options = this.state.stock_groups.map(item => ({
      label: item.stock_group_name, value: item.stock_group_code,
    }))

    const supplier_options = this.state.suppliers.map(item => ({
      label: item.supplier_name, value: item.supplier_code,
    }))
    const user_options = this.state.users.map(item => ({
      label: item.user_name + ' ' + item.user_lastname, value: item.user_code,
    }))

    return (
      <div className="animated fadeIn">
        <Loading show={this.state.loading} />
        <Card>
          <CardHeader className="header-t-red">
          แก้ไขใบร้องขอซื้อ / Update Purchase Request  
          </CardHeader>
          <Form onSubmit={this._handleSubmit.bind(this)}>
            <CardBody>
              <Row>
                <Col md="7">
                  <Row>
                    <Col md="4">
                      <FormGroup>
                        <Label>  เลขที่ใบขอซื้อ / Purchase Request <font color="#F00"><b>*</b></font></Label>
                        <Input
                          type="text"
                          value={this.state.purchase_request_code}
                          readOnly
                        />
                        <p className="text-muted">Example : PR01255491122.</p>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>  วันที่ / Date <font color="#F00"><b>*</b></font>  </Label>
                        <DatePicker
                          format={"DD/MM/YYYY"}
                          value={this.state.purchase_request_date}
                          onChange={(e) => this.setState({ purchase_request_date: e })}
                        />
                        <p className="text-muted">Example : 01/01/2020.</p>
                      </FormGroup>
                    </Col>
                    <Col md="4">
                      <FormGroup>
                        <Label>  ผู้ร้องขอ / Request name <font color="#F00"><b>*</b></font>   </Label>
                        <Select
                          options={user_options}
                          value={this.state.user_code}
                          onChange={(e) => this.setState({ user_code: e })}
                        />
                        <p className="text-muted">Example : พนักงาน.</p>
                      </FormGroup>
                    </Col>
                    <Col md="7">
                      <FormGroup>
                        <Label> หมายเหตุ / Remark </Label>
                        <Input
                          type="input"
                          value={this.state.purchase_request_remark}
                          onChange={(e) => this.setState({ purchase_request_remark: e.target.value })}
                        />
                        <p className="text-muted">Example : -.</p>
                      </FormGroup>
                    </Col>
                  </Row>
                </Col>
              </Row>
              <table className="table table-bordered table-hover">
                <thead style={{ backgroundColor: "lightgray" }}>
                  <tr>
                    <th style={{ textAlign: 'center', width: 36, }}>ลำดับ </th>
                    <th style={{ textAlign: 'center', minWidth: 160, }}>สินค้า </th>
                    <th style={{ textAlign: 'center', minWidth: 160, }}>ผู้ขาย </th>
                    <th style={{ textAlign: 'center', minWidth: 120, }}>คลังสินค้า </th>
                    <th style={{ textAlign: 'center', width: 140, }}>จำนวน </th>
                    <th style={{ textAlign: 'center', width: 48, }}> </th>
                  </tr>
                </thead>
                <tbody>
                  {this.state.purchase_request_list.map((item, idx) => (
                    <tr key={idx}>
                      <td style={{ textAlign: 'center', verticalAlign: 'middle', }}>{idx + 1}</td>
                      <td>
                        <Select
                          options={product_options}
                          value={item.product_code}
                          onChange={(e) => this._handleListSelect('product_code', e, idx)}
                        />
                        <Input
                          type="text"
                          name="purchase_request_list_remark"
                          value={item.purchase_request_list_remark}
                          onChange={(e) => this._handleListChange(e, idx)}
                          placeholder="หมายเหตุ"
                        />
                        {/* <div><Label style={{ paddingTop: "10px" }}> <font color="#F00">{"สินค้าคงเหลือ : " + item.product_qty_balance + " ชิ้น"}</font> </Label></div>
                        <div><Label> <font color="#F00">{"ยอดขายเฉลี่ย 3 เดือน  : " + item.sale_product_qty_average + " ชิ้น"}</font></Label></div> */}
                      </td>
                      <td>
                        <Select
                          options={supplier_options}
                          value={item.supplier_code}
                          onChange={(e) => this._handleListSelect("supplier_code", e, idx)}
                        />
                      </td>
                      <td>
                        <Select
                          options={stock_group_options}
                          value={item.stock_group_code}
                          onChange={(e) => this._handleListSelect('stock_group_code', e, idx)}
                        />
                      </td>
                      <td>
                        <Input
                          type="text"
                          name="purchase_request_list_qty"
                          className="integer text-center"
                          value={item.purchase_request_list_qty}
                          onChange={(e) => this._handleListChange(e, idx)}
                        />
                      </td>
                      <td className="text-center">
                        <button type="button" className="icon-button color-danger" onClick={() => this._deleteRow(idx)} title="ลบรายการ" >
                          <i className="fa fa-times-circle" aria-hidden="true" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className="text-center">
                <button type="button" className="icon-button color-danger" onClick={() => this._addRow()}>
                  <i className="fa fa-plus" aria-hidden="true" /> เพิ่มรายการสินค้า / Add new Product
                </button>
              </div>
            </CardBody>
            <CardFooter className="text-right">
              <Button className="btn-primary" type="button" > Print </Button>
              <Button className="btn-success" type="submit" > Save </Button>
              <Link to="/purchase-request"> <Button className="btn-danger" type="button"> Cancel </Button> </Link>
            </CardFooter>
          </Form>
        </Card>
      </div>
    )
  }
}


export default (Update)