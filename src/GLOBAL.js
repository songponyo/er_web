const GROBAL = {
 
  BASE_SERVER: {
    URL: 'https://elearning-api-ggqvmbmuha-as.a.run.app/', 
    URL_UPLOAD: 'gs://elearnning-b40d1.appspot.com/images',  
    URL_EXPORT: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/export/',
  },
  // BASE_SERVER: {
  //   URL: 'http://localhost:3302/',  
  //   URL_UPLOAD: 'gs://elearnning-b40d1.appspot.com/images',
  //   URL_EXPORT: 'https://elearnning-api-sdz6ykksaq-as.a.run.app/export/',
  // },
  ACCESS_TOKEN: {
    'x-access-token': localStorage.getItem("x-access-token"),
  },
  Main_url: {
    URL: "https://elearnning-b40d1.web.app/#/"
  }
  // ACCESS_LINE_TOKEN: {
  //   'client_id': 'IKNreceUxpACgWqkIwGHpz',
  //   'client_secret': 'jacKgAODAs3ZbhdxKt861vG9OdpSytwFcVujlKA0Sun'
  // },
}

export default GROBAL