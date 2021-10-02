import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert')) 

class Prefix extends React.Component {
  render() {
    const { permission_add, permission_edit } = this.props.SESSION.PERMISSION;

    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route
              exact
              path="/prefix/insert"
              render={(props) => <Insert {...props} />}
            /> 
            <Route
              path="/prefix"
              render={(props) => <View {...props} {...this.props.SESSION} />}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}
export default Prefix