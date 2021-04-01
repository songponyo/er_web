import React from 'react'
import { CFooter } from '@coreui/react'

const TheFooter = () => {
  return (
    <CFooter fixed={false}>
      <div>
        <a href="https://coreui.io" target="_blank" rel="noopener noreferrer"></a>
        <span className="ml-1"></span>
      </div>
      <div className="mfs-auto">
        <span className="mr-1">Powered by</span>
        <a href="http://www.revelsoft.co.th/" target="_blank" rel="noopener noreferrer">Revel Soft</a>
      </div>
    </CFooter>
  )
}

export default React.memo(TheFooter)
