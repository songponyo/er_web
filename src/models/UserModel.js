import { BaseModel } from './MainModel'

export default class UserModel extends BaseModel {
  async checkLogin(data) {
    return this.directFetch({
      url: 'user/checkLogin',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkUser(data) {
    return this.directFetch({
      url: 'user/checkUser',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserByRegister(data) {
    return this.directFetch({
      url: 'user/getUserByRegister',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserMaxCode(data) {
    return this.authFetch({
      url: 'user/getUserMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserBy(data) { 
    return this.authFetch({
      url: 'user/getUserBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getUserByCode(data) { 
    return this.authFetch({
      url: 'user/getUserByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkUsernameBy(data) {
    return this.authFetch({
      url: 'user/checkUsernameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateUserBy(data) {
    return this.authFetch({
      url: 'user/updateUserBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertUser(data) {
    return this.authFetch({
      url: 'user/insertUser',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async registertUser(data) {
    return this.authFetch({
      url: 'user/registertUser',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async unregister(data) {
    return this.authFetch({
      url: 'user/unregister',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteUserByCode(data) {
    return this.authFetch({
      url: 'user/deleteUserByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}