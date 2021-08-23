import { BaseModel } from './MainModel'

export default class QrcodeModel extends BaseModel {

  async getQrcodeLastCode(data) {
    return this.authFetch({
      url: 'qrcode/getQrcodeLastCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getQrcodeNo(data) {
    return this.authFetch({
      url: 'qrcode/getQrcodeNo',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getQrcodeBy(data) {
    return this.authFetch({
      url: 'qrcode/getQrcodeBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getQrcodeByCode(data) {
    return this.authFetch({
      url: 'qrcode/getQrcodeByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateQrcodeBy(data) {
    return this.authFetch({
      url: 'qrcode/updateQrcodeBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertQrcode(data) {
    return this.authFetch({
      url: 'qrcode/insertQrcode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteQrcodeByCode(data) {
    return this.authFetch({
      url: 'qrcode/deleteQrcodeByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRoomid(data) {
    return this.authFetch({
      url: 'qrcode/getRoomid',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  
}