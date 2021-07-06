import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CImg
} from '@coreui/react'
import CIcon from '@coreui/icons-react'

import { AuthConsumer, } from '../role-accress/authContext'

const TheHeaderDropdown = () => {
  return (
    <AuthConsumer>
      {({ logout }) => (
        <CDropdown
          inNav
          className="c-header-nav-items mx-2"
          direction="down"
        >
          <CDropdownToggle className="c-header-nav-link" caret={false}>
            <div className="c-avatar">
              <CImg
                src={'default.png'}
                className="c-avatar-img"
                alt="admin@bootstrapmaster.com"
              />
            </div>
          </CDropdownToggle>
          <CDropdownMenu className="pt-0" placement="bottom-end">
            <CDropdownItem
              header
              tag="div"
              color="light"
              className="text-center"
            >
              <strong>Account</strong>
            </CDropdownItem> 
            <CDropdownItem >
              <CIcon name="cil-user" className="mfe-2" />Profile
            </CDropdownItem> 
            <CDropdownItem divider />
            <CDropdownItem onClick={() => logout()}>
              <CIcon name="cil-lock-locked" className="mfe-2" />Logout</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
      )}
    </AuthConsumer>
  )
}

export default TheHeaderDropdown
