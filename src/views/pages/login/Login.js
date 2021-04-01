import React from 'react'
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from 'reactstrap'

import { AuthConsumer, } from '../../../role-accress/authContext'

const Login = () => {
  const [user, setUser] = React.useState({
    user_username: '',
    user_password: '',
  })

  return (
    <AuthConsumer>
      {({ initiateLogin }) => {
        return (
          <div className="c-app c-default-layout flex-row align-items-center">
            <Container>
              <Row className="justify-content-center">
                <Col md="6">
                  <CardGroup>
                    <Card className="p-4">
                      <CardBody>
                        <Form onSubmit={() => initiateLogin({ user_username: user.user_username, user_password: user.user_password, })}>
                          <h1>Login</h1>
                          <p className="text-muted">Sign In to your account</p>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fa fa-user"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              placeholder="Username"
                              value={user.user_username}
                              onChange={(e) => setUser({ ...user, user_username: e.target.value })}
                              autoComplete="username"
                              required
                            />
                          </InputGroup>
                          <InputGroup className="mb-4">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText>
                                <i className="fa fa-lock"></i>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="password"
                              placeholder="Password"
                              value={user.user_password}
                              onChange={(e) => setUser({ ...user, user_password: e.target.value })}
                              autoComplete="current-password"
                              required
                            />
                          </InputGroup>
                          <Row>
                            <Col xs="6">
                              <Button color="primary" className="px-4">Login</Button>
                            </Col>
                          </Row>
                        </Form>
                      </CardBody>
                    </Card>
                  </CardGroup>
                </Col>
              </Row>
            </Container>
          </div>
        )
      }}
    </AuthConsumer>
  )
}

export default Login