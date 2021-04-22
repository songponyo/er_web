import { BaseModel } from './MainModel'

export default class ScoreModel extends BaseModel { 
  async getScoreMaxCode(data) {
    return this.authFetch({
      url: 'score/getScoreMaxCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getScoreBy(data) { 
    return this.authFetch({
      url: 'score/getScoreBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getScoreByCode(data) { 
    return this.authFetch({
      url: 'score/getScoreByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async checkScorenameBy(data) {
    return this.authFetch({
      url: 'score/checkScorenameBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async updateScoreBy(data) {
    return this.authFetch({
      url: 'score/updateScoreBy',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async insertScore(data) { 
    return this.authFetch({
      url: 'score/insertScore',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async deleteScoreByCode(data) {
    return this.authFetch({
      url: 'score/deleteScoreByCode',
      method: 'POST',
      body: JSON.stringify(data),
    })
  }
}