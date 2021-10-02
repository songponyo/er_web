import { BaseModel } from './MainModel'

export default class PrefixModel extends BaseModel { 
  async getPrefixMaxCode(data) {
    return this.authFetch({
      url: 'prefix/getPrefixMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPrefixBy(data) { 
    return this.authFetch({
      url: 'prefix/getPrefixBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getPrefixByCode(data) { 
    return this.authFetch({
      url: 'prefix/getPrefixByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkPrefixnameBy(data) {
    return this.authFetch({
      url: 'prefix/checkPrefixnameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updatePrefixBy(data) {
    return this.authFetch({
      url: 'prefix/updatePrefixBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertPrefix(data) {
    return this.authFetch({
      url: 'prefix/insertPrefix',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deletePrefixByCode(data) {
    return this.authFetch({
      url: 'prefix/deletePrefixByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}