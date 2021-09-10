const GROBAL = {
 
  // BASE_SERVER: {
  //   URL: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/', 
  //   URL_UPLOAD: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/upload-file/',  
  //   URL_EXPORT: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/export/',
  // },
  BASE_SERVER: {
    URL: 'http://localhost:3302/',  
    URL_UPLOAD: 'http://localhost:3302/upload-file/',
    URL_DELETE: 'http://localhost:3302/delete-file/', 
  },
  ACCESS_TOKEN: {
    'x-access-token': localStorage.getItem("x-access-token"),
  },
}

export default GROBAL