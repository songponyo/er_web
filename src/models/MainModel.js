import GLOBAL from "../GLOBAL";
const qs = require('qs')

class MainModel {
  async directEndpointFetch(endpoint, data) {
    const response = await fetch(endpoint, {
      method: data.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: data.body,
    })
      .then((response) =>
        response.json().then((responseJson) => {
          return responseJson;
        })
      )
      .catch((error) => {
        return { require: false, data: [], err: error };
      });

    return response;
  }

  async authEndpointFetch(endpoint, data) {
    const response = await fetch(endpoint, {
      method: data.method,
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        ...GLOBAL.ACCESS_TOKEN,
      },
      body: data.body,
    })
      .then((response) =>
        response.json().then((responseJson) => {
          return responseJson;
        })
      )
      .catch((error) => {
        return { require: false, data: [], err: error };
      });

    if (response.unauthorized) {
      console.log("unauthorized", response.error);

      localStorage.clear();
      window.location.reload();
    }

    return response;
  } 
}

export class BaseModel extends MainModel {
  async directFetch(data) {
    return await this.directEndpointFetch(
      GLOBAL.BASE_SERVER.URL + data.url,
      data
    );
  }
  async authFetch(data) {
    return await this.authEndpointFetch(
      GLOBAL.BASE_SERVER.URL + data.url,
      data
    );
  }

  // async authLineFetch(data) {
  //   return await this.authLineEndpointFetch(
  //     GLOBAL.BASE_SERVER.URL + data.url,
  //     data
  //   );
  // }
}
