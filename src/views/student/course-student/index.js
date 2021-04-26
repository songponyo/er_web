import React, { Component } from 'react'
import { HashRouter, Route, Switch } from 'react-router-dom'

const View = React.lazy(() => import('./view'))
const Insert = React.lazy(() => import('./insert'))
const Register = React.lazy(() => import('./register'))

class Coursestudent extends Component {
  render() {
    return (
      <HashRouter>
        <React.Suspense>
          <Switch>
            <Route exact path="/course-student/insert" render={props => <Insert {...props} {...this.props.SESSION}/>}  />
            <Route exact path="/course-student/register/:code" render={props => <Register {...props} {...this.props.SESSION}/>}  />
            <Route path="/course-student" render={props => <View {...props} {...this.props.SESSION} />} />
          </Switch>
        </React.Suspense>
      </HashRouter>
    )
  }
}

export default Coursestudent