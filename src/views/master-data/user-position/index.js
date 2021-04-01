import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))

const DEFINE_PERMISSION = {
  permission_view: true,
  permission_add: true,
  permission_edit: true,
  permission_approve: true,
  permission_cancel: true,
  permission_delete: true,
}

class UserPosition extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/user-position/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/user-position/update/:code" render={props => <Update {...props}  {...this.props.SESSION}/>} />
            <Route path="/user-position" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default UserPosition