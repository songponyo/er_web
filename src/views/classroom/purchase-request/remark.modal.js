import React from 'react'
import {
  Button,
  Col,
  Row,
  FormGroup,
  Label,
  Input,
} from 'reactstrap'
import {
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
} from '@coreui/react'

class ModalRemark extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      purchase_request_approve_remark: '',
    }
  }

  componentDidUpdate(props_old) {
    if (props_old.show === false && this.props.show) {
      this._refreshData()
    }
  }

  _refreshData() {
    this.setState({
      purchase_request_approve_remark: '',
    })
  }

  _handleSave() {
    const { purchase_request_approve_remark } = this.state

    this.props.onSave({ purchase_request_approve_remark })
  }

  _handleClose() {
    this.props.onRefresh()
  }

  render() {
    return (
      <CModal
        size="lg"
        centered
        show={this.props.show}
        onClose={() => this._handleClose()}
      >
        <CModalHeader closeButton>
          <h4 className="m-0">ไม่อนุมัติใบร้องขอซื้อ</h4>
        </CModalHeader>
        <CModalBody>
          <Label>หมายเหตุ <font color="#F00"><b>*</b></font></Label>
          <Input
            type="text"
            value={this.state.purchase_request_approve_remark}
            onChange={(e) => this.setState({ purchase_request_approve_remark: e.target.value })}
            required
          />
          <p className="text-muted m-0">Example : -.</p>
        </CModalBody>
        <CModalFooter>
          <Button type="button" color="success" onClick={() => this._handleSave()}>ยืนยัน</Button>
          <Button type="button" onClick={() => this._handleClose()}>ยกเลิก</Button>
        </CModalFooter>
      </CModal>
    )
  }
}

export default ModalRemark