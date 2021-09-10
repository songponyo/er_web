import { BaseModel } from './MainModel'

export default class CheckinModel extends BaseModel {

  async getCheckinLastCode(data) {
    return this.authFetch({
      url: 'checkin/getCheckinLastCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCheckinNo(data) {
    return this.authFetch({
      url: 'checkin/getCheckinNo',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCheckinBy(data) {
    return this.authFetch({
      url: 'checkin/getCheckinBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getCheckinByCode(data) {
    return this.authFetch({
      url: 'checkin/getCheckinByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateCheckinBy(data) {
    return this.authFetch({
      url: 'checkin/updateCheckinBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertCheckin(data) {
    return this.authFetch({
      url: 'checkin/insertCheckin',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteCheckinByCode(data) {
    return this.authFetch({
      url: 'checkin/deleteCheckinByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoomid(data) {
    return this.authFetch({
      url: 'checkin/getRoomid',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
}