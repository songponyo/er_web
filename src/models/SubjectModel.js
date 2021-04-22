import { BaseModel } from './MainModel'

export default class SubjectModel extends BaseModel { 
  async getSubjectMaxCode(data) {
    return this.authFetch({
      url: 'subject/getSubjectMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSubjectBy(data) { 
    return this.authFetch({
      url: 'subject/getSubjectBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getSubjectByCode(data) { 
    return this.authFetch({
      url: 'subject/getSubjectByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkSubjectnameBy(data) {
    return this.authFetch({
      url: 'subject/checkSubjectnameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateSubjectBy(data) {
    return this.authFetch({
      url: 'subject/updateSubjectBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertSubject(data) {
    return this.authFetch({
      url: 'subject/insertSubject',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteSubjectByCode(data) {
    return this.authFetch({
      url: 'subject/deleteSubjectByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}