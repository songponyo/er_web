import { BaseModel } from './MainModel'

export default class TopicModel extends BaseModel { 
  async getTopicByLastCode(data) {
    return this.authFetch({
      url: 'topic/getTopicByLastCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTopicBy(data) { 
    return this.authFetch({
      url: 'topic/getTopicBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTopicByCode(data) { 
    return this.authFetch({
      url: 'topic/getTopicByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getTopicByClassCode(data) { 
    return this.authFetch({
      url: 'topic/getTopicByClassCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkTopicnameBy(data) {
    return this.authFetch({
      url: 'topic/checkTopicnameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTopicBy(data) {
    return this.authFetch({
      url: 'topic/updateTopicBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertTopic(data) { 
    return this.authFetch({
      url: 'topic/insertTopic',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteTopicByCode(data) {
    return this.authFetch({
      url: 'topic/deleteTopicByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateTopicLeaveBy(data) {
    return this.authFetch({
      url: 'topic/updateTopicLeaveBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
  




}