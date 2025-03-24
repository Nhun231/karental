import axios from "axios";

const BASE_URL = "http://54.151.174.204:8080/karental";
const CAR_URL = "http://localhost:8080/karental/car";
const BOOK_URL = "http://localhost:8080/karental/booking";
export const registerUser = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/user/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.message || "Registration failed");
    }
    return data; // return Json response
  } catch (error) {
    console.error(error);
    throw error;
  }
};
export const checkUniqueEmail = async (email) => {
  try {
    const response = await fetch(`${BASE_URL}/user/check-unique-email`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(email),
      
    });
    return response.json();
  } catch (error) {
    console.error("Error checking email:", error);
    return null;
  }
};
export const login = async (userData) => {
  try {
    const response = await fetch(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
      credentials: "include",
    });
    const data = await response.json();
    if (!response.ok) {
      alert(data.message);
      throw new Error("Login failed");
    }
    return data;
  } catch (error) {
    console.error("Error:", error);
    throw error;
  }
};
export const forgotPasswordEmailFunction = async (email) =>{
  try{
    const response = await axios.get(`${BASE_URL}/auth/forgot-password/${email}`,{
      withCredentials: true,
    })
    return response;
  }catch(error){
    console.log('Error in email: ', error)
  }
}
export const forgotPasswordVerify = async (token) =>{
  try{
    const response = axios.get(`${BASE_URL}/auth/forgot-password/verify?t=${token}`,{
      withCredentials: true,
    })
    return response;
  }catch(error){
    console.log('Error in change password: ', error)
  }
}
export const forgotPasswordChange = async (formChangePassword) =>{
  try{
    const response = axios.put(`${BASE_URL}/auth/forgot-password/change`, formChangePassword, {
      withCredentials:true
    })
    return response;
  }catch(error){
    console.log(error)
  }

}

export const getUserProfile = async () => {
  try {
    const response = await axios.get(`${BASE_URL}/edit-profile`, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};
export const updateUserProfile = async (formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit-profile`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating profile:", error);
    alert(error.response?.data?.message || "Update failed");
    throw error;
  }
};
export const updateUserPassword = async (formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/edit-password`, formData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error updating password:", error);
    alert(error.response?.data?.message || "Password update failed");
    throw error;
  }
};
export const getCarDetail = async (formData) => {
  try {
    const requestUrl = `${CAR_URL}/customer/car-detail`;
    const response = await axios.get(requestUrl, {
      params: formData,
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Response data:", error.response?.data);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};


export const getSearchResult = async (searchParams) => {
  try {
    const url = `${CAR_URL}/search-car`;
    console.log("Request URL:", url);
    const response = await axios.get(`${CAR_URL}/customer/search-car`, {
      params: {
        address: searchParams.address,
        pickUpTime: searchParams.pickUpTime,
        dropOffTime: searchParams.dropOffTime,
        page: searchParams.page || 0,
        size: searchParams.size || 10,
        sort: searchParams.sort || "productionYear,DESC",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get search results failed");
    throw error;
  }
};

export const getMyBookings = async (searchParams) => {
  try {
    const response = await axios.get(`${BOOK_URL}/customer/my-bookings`, {
      params: {
        page: searchParams.page || 0,
        size: searchParams.size || 10,
        sort: searchParams.sort || "createdAt,DESC",
      },
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error:", error);
    alert(error.response?.data?.message || "Get data failed");
    throw error;
  }
};