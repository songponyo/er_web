import { BaseModel } from './MainModel'

export default class ClassgroupModel extends BaseModel { 
  async getClassgroupMaxCode(data) {
    return this.authFetch({
      url: 'classgroup/getClassgroupMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getClassgroupBy(data) { 
    return this.authFetch({
      url: 'classgroup/getClassgroupBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getClassgroupByCode(data) { 
    return this.authFetch({
      url: 'classgroup/getClassgroupByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkClassgroupnameBy(data) {
    return this.authFetch({
      url: 'classgroup/checkClassgroupnameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateClassgroupBy(data) {
    return this.authFetch({
      url: 'classgroup/updateClassgroupBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertClassgroup(data) {
    return this.authFetch({
      url: 'classgroup/insertClassgroup',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteClassgroupByCode(data) {
    return this.authFetch({
      url: 'classgroup/deleteClassgroupByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}