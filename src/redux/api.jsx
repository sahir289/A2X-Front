import axios from "axios";
// import { useDispatch } from "react-redux";

const endPoint = process.env.REACT_APP_BASE_URL;

const apiConfig = (flag = false) => {


  if (localStorage.getItem('accessToken')) {
    return {
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`,
        "Content-Type": flag ? "multipart/form-data" : "application/json",
      },
      method: "PUT,DELETE,POST,GET,OPTION",
    };
  }
  return { withCredentials: false };
};

export const getApi = (url, params) => {
  return axios.get(`${endPoint}${url}`, {
    params: params,
    ...apiConfig(),
  });
};

export const postApi = (url, apiData, flag) => {
  return axios.post(`${endPoint}${url}`, apiData, apiConfig(flag));
};

export const putApi = (url, apiData, flag) => {
  return axios.put(`${endPoint}${url}`, apiData, apiConfig(flag));
};

export const patchApi = (url, apiData, flag) => {
  return axios.patch(`${endPoint}${url}`, apiData, apiConfig(flag));
};


export const putApiNoHeader = (url, apiData) => {
  if (localStorage.getItem('accessToken')) {
    return axios.put(`${endPoint}${url}`, apiData, {
      headers: {
        Authorization: `bearer ${localStorage.getItem('accessToken')}`,
      },
    });
  } else {
    // If there's no access token, return an error response or handle it as needed.
    return Promise.reject("No access token available");
  }
};

export const deleteApi = (url) => {
  return axios.delete(`${endPoint}${url}`, apiConfig());
};

export const deleteApiWithData = (url, apiData) => {
  return axios.delete(`${endPoint}${url}`, {
    data: apiData,
    ...apiConfig(),
  });
};


