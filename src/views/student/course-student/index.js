import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Update = React.lazy(() => import('./update'))

class Coursestudent extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/course-student/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/course-student/update/:code" render={props => <Update {...props} {...this.props.SESSION}/>}  />
            <Route path="/course-student" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Coursestudent