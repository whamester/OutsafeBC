import { 
  API_GEOAPIFY_KEY,
  API_GEOAPIFY_URL
} from "../../constants.js";

const geocode = async (params, type) => {
  let url = "";

  if (type === "autocomplete") {
    const encodedSearchTerm = encodeURIComponent(params?.searchTerm);
    url = `${ API_GEOAPIFY_URL }autocomplete?text=${ encodedSearchTerm }&apiKey=${ API_GEOAPIFY_KEY }`;
  } else if (type === "geocode") {
    const text = encodeURIComponent(params?.text);
    url = `${ API_GEOAPIFY_URL }search?text=${ text }&apiKey=${ API_GEOAPIFY_KEY }`;
  } else if (type === "reverse-geocode") {
    url = `${ API_GEOAPIFY_URL }reverse?lat=${ params.lat }&lon=${ params.lng }&apiKey=${ API_GEOAPIFY_KEY }`;
  }

  try {
    const res = await fetch(url);
    let resJson = {};

    if (res.ok) {
      resJson = await res.json();
    } else {
      const statusCode = res.status;
      const errorMessage = await res.text();
      console.log(`Func: searchLocationSuggestion, Status: ${ statusCode }, Error: ${ errorMessage }`);
      return;
    }
    
    return resJson?.features ?? [];
  } catch (error) {
    console.log(`Func: geocode, Type: ${ type }, Error: ${ error.message }`);
    return [];
  }
};

export default geocode;
