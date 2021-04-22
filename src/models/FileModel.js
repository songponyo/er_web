import { BASE_SERVER } from './MainModel'

export default class FileModel extends BASE_SERVER {
    async uploadFile(data) {
        return this.authFetch({
            url: 'upload-file',
            method: 'POST',
            body: JSON.stringify(data),
        })
    }

    async deleteFile(data) {
        return this.authFetch({
            url: 'delete-file',
            method: 'POST',
            body: JSON.stringify(data),
        })
    }
}