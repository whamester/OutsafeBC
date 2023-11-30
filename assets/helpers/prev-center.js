import { PREV_CENTER } from '../../constants.js';

export const setPrevCenter = (data) => {
  try{
    localStorage.setItem(PREV_CENTER, JSON.stringify(data));
  } catch (error) {
    console.error(error);
  }
}

export const getPrevCenter = (key) => {
  try {
    let data = localStorage.getItem(PREV_CENTER);
    data = data ? JSON.parse(data) : {};
    return key ? data[key] : data;
  } catch (error) {
    console.error(error);
    return {};
  }
}

export const checkPrevCenter = () => {
  try {
    return !!Object.keys(getPrevCenter()).length;
  } catch (error) {
    console.error(error);
    return false;
  }
}

export const clearPrevCenter = () => {
  try{
    localStorage.removeItem(PREV_CENTER);
  } catch (error) {
    console.error(error);
  }
}
