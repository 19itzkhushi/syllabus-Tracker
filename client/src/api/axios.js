import axios from "axios";

const API = axios.create({
  baseURL: "https://syllabus-tracker-backend2.onrender.com", // use your backend URL
  withCredentials: true // if you're using cookies
});



// Flag to prevent multiple refresh calls at once
let isRefreshing = false;
let failedQueue = [];

// Function to process queued requests
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Response interceptor
API.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;

    // If access token is expired & not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then(() => API(originalRequest))
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const res = await axios.get(
          "http://localhost:3000/api/v1/users/refresh-token",
          { withCredentials: true }
        );

        // Optionally, store the new accessToken in memory/localStorage if you're using it manually
        // localStorage.setItem("accessToken", res.data.data.accessToken);

        processQueue(null);
        return API(originalRequest); // Retry original request
      } catch (err) {
        processQueue(err, null);
        return Promise.reject(err);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);




export default API;
