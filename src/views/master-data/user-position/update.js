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
  Label,
  Input,
  Row,
} from 'reactstrap'
import { connect } from 'react-redux'
import { Link } from 'react-router-dom'
import Swal from 'sweetalert2'

import UserPositionModel from '../../../models/UserPositionModel'

const user_position_model = new UserPositionModel()

class Update extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      showloading: true,
      user_position_code: '',
      user_position_name: '',
    }
  }

  async componentDidMount() {
 
    const { code } = this.props.match.params

    const user_position = await user_position_model.getUserPositionByCode({ user_position_code: code })

    if (user_position.require === false) {
      Swal.fire("ข้อผิดพลาดไม่สามารถโหลดข้อมูล !", '', 'error')
      this.props.history.push('/user-position')
    } else if (user_position.data.length === 0) {
      Swal.fire("ไม่พบรายการนี้ในระบบ !", '', 'warning')
    } else {
      const {
        user_position_code,
        user_position_name,
      } = user_position.data[0]

      this.setState({
        showloading: false,
        user_position_code: user_position_code,
        user_position_name: user_position_name,
      })
    }
  }

  async _handleSubmit(event) {
    event.preventDefault()

    if (this._checkSubmit()) {
      const res = await user_position_model.updateUserPositionBy({
        user_position_code: this.state.user_position_code.trim(),
        user_position_name: this.state.user_position_name.trim(),
        updateby: this.props.USER.user_code
      })

      if (res.require) {
        Swal.fire('Save success!!', '', 'success')
        this.props.history.push('/user-position')
      } else {
        Swal.fire("Sorry, Someting worng !", '', 'error')
      }
    }
  }

  _checkSubmit() {
    if (this.state.user_position_name.trim().length === 0) {
      Swal.fire("กรุณาระบุชือตำแหน่ง / Please input Name")
      return false
    } else {
      return true
    }
  }

  render() {
  

    return (
      
      <div className="animated fadeIn">
        <Card>
        <CardHeader className="header-t-red">
            แก้ไขตำแหน่งผู้ใช้งาน
          </CardHeader>
          <Form onSubmit={this._handleSubmit.bind(this)}>
            <CardBody>
              <Row>
                <Col md="4">
                  <Label>รหัสตำแหน่ง </Label>
                  <Input
                    type="text"
                    id="user_position_code"
                    name="user_position_code"
                    value={this.state.user_position_code}
                    readOnly
                  /> 
                </Col>
                <Col md="4">
                  <FormGroup row>
                    <Label>ชื่อตำแหน่ง <font color="#F00"><b>*</b></font></Label>
                    <Input
                      type="text"
                      id="user_position_name"
                      name="user_position_name"
                      value={this.state.user_position_name}
                      onChange={(e) => this.setState({ user_position_name: e.target.value })}
                      required
                    /> 
                  </FormGroup>
                </Col>
              </Row>
            </CardBody>
            <CardFooter>
              <Button type="submit" color="success">Save</Button> 
              <Link to="/user-position"><Button color="btn btn-danger">Back</Button></Link>
            </CardFooter>
          </Form>
        </Card>
      </div>
    )
  }
}

const mapStatetoProps = (state) => {
  return {
    _USER: state._USER
  }
}

export default connect(mapStatetoProps)(Update)