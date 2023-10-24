// Constants
import { API_URL } from "../../constants.js";

const apiRequest = (endpoint, {method, body, ...customConfig} = {}) => {
  const headers = {'Content-Type': 'application/json'}
  const config = {
    method: method,
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (["POST", "PUT", "PATCH"].includes(method)) config.body = JSON.stringify(body);

  return window
    .fetch(`${ API_URL }/${ endpoint }`, config)
    .then(async response => {
      if (response.ok) {
        return await response.json();
      } else {
        const statusCode = response.status;
        const errorMessage = await response.text();
        console.log(`Status: ${ statusCode }, Error: ${ errorMessage }, Endpoint: ${ endpoint }`);
        return {};
      }
    }).catch(error => {
      console.log(`Error: ${ error.message }, Endpoint: ${ endpoint }`);
      return {};
    });
}

export default apiRequest;
