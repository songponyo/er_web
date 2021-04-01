import React, { useState, useEffect, } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CCreateElement,
  CSidebar,
  CSidebarBrand,
  CSidebarNav,
  CSidebarNavDivider,
  CSidebarNavTitle,
  CSidebarMinimizer,
  CSidebarNavDropdown,
  CSidebarNavItem,
} from '@coreui/react'
import logo from '../assets/icons/logo.png'; // with import
import CIcon from '@coreui/icons-react'

import accessMenu from './Menu'
// sidebar nav config
// import navigation from './_nav'

const TheSidebar = (props) => {
  const dispatch = useDispatch()
  const show = useSelector(state => state.sidebarShow)

  const { PERMISSIONS } = props

  const [navigations, setNavigation] = useState([])

  useEffect(() => {
    setNavigation(accessMenu({ PERMISSIONS, }))
  }, [PERMISSIONS])
  return (
    <CSidebar show={show} onShowChange={(val) => dispatch({ type: 'set', sidebarShow: val })}>
      {/* <img src={logo} className="mx-auto d-block bottom-shadow" alt="Responsive image" style={{ width: '100%', marginTop: "15px" }}></img> */}
      <CSidebarNav className="">
        {/* <h6 className="head-font">
          ERP<br />
          Enterprise resource planning
        </h6> */}
        <CCreateElement
          items={navigations}
          components={{
            CSidebarNavDivider,
            CSidebarNavDropdown,
            CSidebarNavItem,
            CSidebarNavTitle
          }}
        />
      </CSidebarNav>
      <CSidebarMinimizer className="c-d-md-down-none" />
    </CSidebar>
  )
}

export default React.memo(TheSidebar)
