import React from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))

class Subject extends React.Component {
  render() {
    const { permission_add, permission_edit } = this.props.SESSION.PERMISSION;

    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route
              exact
              path="/subject/insert"
              render={(props) => <Insert {...props} />}
            />
            <Route
              exact
              path="/subject/update/:code"
              render={(props) => <Update {...props} />}
            />
            <Route
              path="/subject"
              render={(props) => <View {...props} {...this.props.SESSION} />}
            />
          </Switch>
        </React.Suspense>
      </HashRouter>
    );
  }
}
export default Subject