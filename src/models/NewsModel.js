import { BaseModel } from './MainModel'

export default class NewsModel extends BaseModel { 
  async getNewsByLastCode(data) {
    return this.authFetch({
      url: 'news/getNewsByLastCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getNewsBy(data) { 
    return this.authFetch({
      url: 'news/getNewsBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getNewsByCode(data) { 
    return this.authFetch({
      url: 'news/getNewsByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  } 
 
  async updateNewsBy(data) {
    return this.authFetch({
      url: 'news/updateNewsBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertNews(data) { 
    return this.authFetch({
      url: 'news/insertNews',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteNewsByCode(data) {
    return this.authFetch({
      url: 'news/deleteNewsByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  } 

}