import { BaseModel } from './MainModel'

export default class LicenseModel extends BaseModel {
  async getLicenseMaxCode(data) {
    return this.authFetch({
      url: 'license/getLicenseMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getLicenseBy(data) {
    return this.authFetch({
      url: 'license/getLicenseBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getLicenseByCode(data) {
    return this.authFetch({
      url: 'license/getLicenseByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateLicenseBy(data) {
    return this.authFetch({
      url: 'license/updateLicenseBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertLicense(data) {
    return this.authFetch({
      url: 'license/insertLicense',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteLicenseByCode(data) {
    return this.authFetch({
      url: 'license/deleteLicenseByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}