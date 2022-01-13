import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))


class Profile extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch> 
            <Route path="/profile" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Profile