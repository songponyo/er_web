import { BaseModel } from './MainModel'

export default class LineModel extends BaseModel {
  async notifyredirect(data) { 
    return this.authFetch({
      url: 'notifyredirect',
      method: 'POST',
      body: JSON.stringify(data),
    })
  } 
}