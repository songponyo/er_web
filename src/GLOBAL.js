const GROBAL = {
 
  // BASE_SERVER: {
  //   URL: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/', 
  //   URL_UPLOAD: 'gs://elearnning-323808.appspot.com/images',  
  //   URL_EXPORT: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/export/',
  // },
  BASE_SERVER: {
    URL: 'http://localhost:3302/',  
    URL_UPLOAD: 'gs://elearnning-323808.appspot.com/images',
    URL_EXPORT: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/export/',
  },
  ACCESS_TOKEN: {
    'x-access-token': localStorage.getItem("x-access-token"),
  },
}

export default GROBAL