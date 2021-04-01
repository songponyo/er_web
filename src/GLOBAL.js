const GROBAL = {

  BASE_SERVER: {
    URL: 'http://localhost:3302/',
    URL_IO: 'ws://localhost:3003/',
    URL_IMG: 'http://localhost:3302/',
    URL_UPLOAD: 'http://localhost:3302/upload-file/',
    URL_DELETE: 'http://localhost:3302/delete-file/',
    URL_EXPORT: 'http://localhost/export/',
  },
  ACCESS_TOKEN: {
    'x-access-token': localStorage.getItem("x-access-token"),
  },
}

export default GROBAL