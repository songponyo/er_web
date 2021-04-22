import { BaseModel } from './MainModel'

export default class LeaveModel extends BaseModel { 
  async getLeaveMaxCode(data) {
    return this.authFetch({
      url: 'leave/getLeaveMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getLeaveBy(data) { 
    return this.authFetch({
      url: 'leave/getLeaveBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getLeaveByCode(data) { 
    return this.authFetch({
      url: 'leave/getLeaveByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkLeavenameBy(data) {
    return this.authFetch({
      url: 'leave/checkLeavenameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLeaveBy(data) {
    return this.authFetch({
      url: 'leave/updateLeaveBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertLeave(data) {
    return this.authFetch({
      url: 'leave/insertLeave',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteLeaveByCode(data) {
    return this.authFetch({
      url: 'leave/deleteLeaveByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}