import GLOBAL from '../GLOBAL'

export default class FileController {
  async uploadFile(data) {
    const { upload_path, src } = data

    if (src.file === undefined && src.file === null) {
      return { require: false, err: 'file not found!' }
    } else {
      const form_data = new FormData()

      form_data.append('upload_path', upload_path)
      form_data.append('files', src.file)

      const res_upload = await fetch(GLOBAL.FILE_SERVER.URL_UPLOAD, {
        method: 'post',
        headers: {},
        body: form_data
      }).then((response) => response.json().then((responseJson) => {
        return responseJson
      })).catch((error) => {
        return { require: false, data: [], err: error }
      })
      return res_upload
    }
  }


  async deleteFile(data) {
    return fetch(GLOBAL.FILE_SERVER.URL_DELETE, {
      method: 'post',
      headers: GLOBAL.AUTH_HEADERS,
      body: JSON.stringify(data)
    }).then((response) => response.json().then((responseJson) => {
      return responseJson
    })).catch((error) => {
      return { require: false, data: [], err: error }
    })
  }
}