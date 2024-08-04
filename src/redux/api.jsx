import axios from "axios";
import { parseErrorFromAxios } from "../utils/utils";


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

export const getApi = async (url, params) => {
  try {
    const response = await axios.get(`${endPoint}${url}`, {
      params: params,
      ...apiConfig(),
    });
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name) {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const postApi = async (url, apiData, flag) => {
//   return axios.post(`${endPoint}${url}`, apiData, apiConfig(flag)).catch((err) => {
//     if (err?.response?.data?.error?.name) {
//       localStorage.clear()
//     }
//   });
// };
export const postApi = async (url, apiData, flag) => {
  try {
    const response = await axios.post(`${endPoint}${url}`, apiData, apiConfig(flag));
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name) {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const putApi = async (url, apiData, flag) => {
//   return axios.put(`${endPoint}${url}`, apiData, apiConfig(flag)).catch((err) => {
//     if (err?.response?.data?.error?.name) {
//       localStorage.clear()
//     }
//   });
// };
export const putApi = async (url, apiData, flag) => {
  try {
    const response = await axios.put(`${endPoint}${url}`, apiData, apiConfig(flag));
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name==="") {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const patchApi = (url, apiData, flag) => {
//   return axios.patch(`${endPoint}${url}`, apiData, apiConfig(flag));
// };
export const patchApi = async (url, apiData, flag) => {
  try {
    const response = await axios.patch(`${endPoint}${url}`, apiData, apiConfig(flag));
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name) {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const putApiNoHeader = (url, apiData) => {
//   if (localStorage.getItem('accessToken')) {
//     return axios.put(`${endPoint}${url}`, apiData, {
//       headers: {
//         Authorization: `bearer ${localStorage.getItem('accessToken')}`,
//       },
//     });
//   } else {
//     // If there's no access token, return an error response or handle it as needed.
//     return Promise.reject("No access token available");
//   }
// };
export const putApiNoHeader = async (url, apiData) => {
  try {
    if (localStorage.getItem('accessToken')) {
      const response = await axios.put(`${endPoint}${url}`, apiData, {
        headers: {
          Authorization: `bearer ${localStorage.getItem('accessToken')}`,
        },
      });
      return {
        data: response.data,
        error: null,
      };
    } else {
      return {
        data: null,
        error: {
          error: null,
          message: "No access token available",
        }
      };
    }
  } catch (err) {
    console.log("🚀 ~ putApiNoHeader ~ err:", err)
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const deleteApi = (url) => {
//   return axios.delete(`${endPoint}${url}`, apiConfig());
// };

export const deleteApi = async (url) => {
  try {
    const response = await axios.delete(`${endPoint}${url}`, apiConfig());
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name) {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

// export const deleteApiWithData = (url, apiData) => {
//   return axios.delete(`${endPoint}${url}`, {
//     data: apiData,
//     ...apiConfig(),
//   });
// };
export const deleteApiWithData = async (url, apiData) => {
  try {
    const response = await axios.delete(`${endPoint}${url}`, {
      data: apiData,
      ...apiConfig(),
    });
    return {
      data: response.data,
      error: null,
    };
  } catch (err) {
    if (err?.response?.data?.error?.name) {
      // localStorage.clear();
    }
    return { data: null, error: parseErrorFromAxios(err) };
  }
};

