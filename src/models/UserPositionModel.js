import { BaseModel } from './MainModel'

export default class UserPositionModel extends BaseModel {
  async getUserPositionMaxCode(data) {
    return this.authFetch({
      url: 'user-position/getUserPositionMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserPositionBy(data) {
    return this.authFetch({
      url: 'user-position/getUserPositionBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserPositionByCode(data) {
    return this.authFetch({
      url: 'user-position/getUserPositionByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUserPositionBy(data) {
    return this.authFetch({
      url: 'user-position/updateUserPositionBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertUserPosition(data) {
    return this.authFetch({
      url: 'user-position/insertUserPosition',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteUserPositionByCode(data) {
    return this.authFetch({
      url: 'user-position/deleteUserPositionByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}