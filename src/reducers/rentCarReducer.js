import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"; // API gọi đến backend
import { toast } from "react-toastify";
import { getFileFromDB } from "../Helper/indexedDBHelper";

export const fetchInforProfile = createAsyncThunk(
  "rentCar/fetchInforProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:8080/karental/user/edit-profile",
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Get profile failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Get Profile Successful! 🎉", {
      //   position: "top-right",
      // });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Profile Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error.");
    }
  }
);

export const getWallet = createAsyncThunk(
  "rentCar/getWallet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:8080/karental/booking/get-wallet",
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Get wallet failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Get Wallet Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Wallet Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error.");
    }
  }
);

export const createBooking = createAsyncThunk(
  "rentCar/createBooking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      const state = getState();
      if (state.rentCar.infor.driver === false) {
        const renter = state.rentCar.infor.data;
        Object.entries(renter).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("driver", false);
        // for (let pair of formData.entries()) {
        //   console.log(`🔹 ${pair[0]}:`, pair[1]);
        // }
      } else {
        const renter = state.rentCar.infor.renter;
        const file = await getFileFromDB("driverDrivingLicense");
        formData.append("driverDrivingLicense", file);
        Object.entries(renter).forEach(([key, value]) => {
          formData.append(key, value);
        });
        formData.append("driver", true);
        // for (let pair of formData.entries()) {
        //   console.log(`🔹 ${pair[0]}:`, pair[1]);
        // }
      }
      formData.append(
        "pickUpLocation",
        "Tỉnh Hà Giang, Thành phố Hà Giang, Phường Quang Trung,abc"
      );
      formData.append("pickUpTime", "2025-03-30T06:00:00");
      formData.append("dropOffTime", "2025-03-31T06:59:00");
      formData.append("paymentType", state.rentCar.infor.paymentType);
      formData.append("carId  ", "2d91cde8-65ee-4c5d-b600-6cdc52092318");

      // for (let pair of formData.entries()) {
      //   console.log(`🔹 ${pair[0]}:`, pair[1]);
      // }
      const response = await fetch(
        "http://localhost:8080/karental/booking/customer/create-book",
        {
          method: "POST",
          credentials: "include", // Để gửi cookie nếu cần
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Create booking failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      toast.success("🚗 Create Booking Successful! 🎉", {
        position: "top-right",
      });
      return data;
    } catch (error) {
      return rejectWithValue(error.message || "Network error.");
    }
  }
);

export const getBookingDetail = createAsyncThunk(
  "rentCar/getBookingDetail",
  async (carId, { rejectWithValue }) => {
    try {
      const response = await fetch(
        "http://localhost:8080/karental/booking/customer/20250315-00000003",
        {
          method: "GET",
          credentials: "include", // Để gửi cookie nếu cần
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Fetch car failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      // toast.success("🚗 Fetch Car Successful! 🎉", { position: "top-right" });
      return data;
    } catch (error) {
      toast.error("🚗 Fetch Car Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const saveBooking = createAsyncThunk(
  "rentCar/saveBooking",
  async (_, { getState, rejectWithValue }) => {
    try {
      const formData = new FormData();
      const state = getState();

      const renter = state.rentCar.infor.data;

      if (state.rentCar.infor.data.driver === true) {
        const file = await getFileFromDB("driverDrivingLicense");
        if (file) {
          // Chỉ thêm nếu file không phải null hoặc undefined
          formData.append("driverDrivingLicense", file);
        }
      }

      Object.entries(renter).forEach(([key, value]) => {
        formData.append(key, value);
      });

      console.log(state.rentCar.infor.data.driver);
      for (let pair of formData.entries()) {
        console.log(`🔹 ${pair[0]}:`, pair[1]);
      }

      const response = await fetch(
        `http://localhost:8080/karental/booking/customer/edit-book/20250315-00000003`,
        {
          method: "PUT",
          credentials: "include",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorMessage = await response.text();
        return rejectWithValue(errorMessage || "Save booking failed.");
      }

      const text = await response.text();
      if (!text) return rejectWithValue("No data received.");

      const data = JSON.parse(text);
      if (!data) return rejectWithValue("Invalid car data.");

      toast.success("🚗 Save Booking Successful! 🎉", {
        position: "top-right",
      });
      return data;
    } catch (error) {
      toast.error("🚗 Save Booking Failed! 🎉", { position: "top-right" });
      return rejectWithValue(error.message || "Network error");
    }
  }
);

export const rentCarSlice = createSlice({
  name: "rentCar",
  initialState: {
    infor: {
      renter: {},
    },
    statusBooking: "idle",
    errorsBooking: {},
  },
  reducers: {
    setInfor: (state, action) => {
      state.infor = {
        ...state.infor,
        ...action.payload,
      };
    },
    setErrorsBooking: (state, action) => {
      state.errorsBooking = {
        ...state.errorsBooking,
        ...action.payload,
      };
    },
    setStepBooking: (state, action) => {
      state.step = action.payload;
    },

    handleNext: (state) => {
      const currentYear = new Date().getFullYear();
      const dobYear = new Date(state.infor.renter.driverDob).getFullYear();

      let newErrors = {};
      if (state.infor.driver) {
        if (!state.infor.renter.driverFullName) {
          newErrors.fullName = "Full name is required.";
        }
        if (!state.infor.renter.driverDob) {
          newErrors.dob = "Date of birth is required.";
        } else if (currentYear - dobYear < 18) {
          newErrors.dob = "You must be at least 18 years old.";
        }
        if (
          !state.infor.renter.driverPhoneNumber ||
          !/^\d{10}$/.test(state.infor.renter.driverPhoneNumber)
        ) {
          newErrors.phoneNumber = "Phone number is required.";
        }
        if (
          !state.infor.renter.driverNationalId ||
          !/^\d{9,12}$/.test(state.infor.renter.driverNationalId)
        ) {
          newErrors.nationalId = "National ID is required.";
        }
        if (!state.infor.renter.drivingLicenseName) {
          newErrors.drivingLicenseUrl = "Driving license is required.";
        }
        if (!state.infor.renter.driverCityProvince) {
          newErrors.addressCityProvince = "City/Province is required.";
        }
        if (!state.infor.renter.driverDistrict) {
          newErrors.addressDistrict = "District is required.";
        }
        if (!state.infor.renter.driverWard) {
          newErrors.addressWard = "Ward is required.";
        }
        if (!state.infor.renter.driverHouseNumberStreet) {
          newErrors.addressHouseNumberStreet = "House number is required.";
        }
        if (!state.infor.renter.driverEmail) {
          newErrors.email = "Email is required.";
        }
        if (
          state.infor.renter.driverEmail &&
          !/^\S+@\S+\.\S+$/.test(state.infor.renter.driverEmail)
        ) {
          newErrors.email = "Invalid email format.";
        }
      }

      state.errorsBooking = newErrors;

      if (Object.keys(newErrors).length > 0) {
        toast.error("⚠️ Please fulfill all the fields!");
        return;
      } else {
        toast.success("🚗 Add Renter information Successful! 🎉", {
          position: "top-right",
        });
      }
    },

    handleSaveBooking: (state) => {
      const currentYear = new Date().getFullYear();
      const dobYear = new Date(state.infor.data.driverDob).getFullYear();

      let newErrors = {};
      if (state.infor.data.driver) {
        if (!state.infor.data.driverFullName) {
          newErrors.fullName = "Full name is required.";
        }
        if (!state.infor.data.driverDob) {
          newErrors.dob = "Date of birth is required.";
        } else if (currentYear - dobYear < 18) {
          newErrors.dob = "You must be at least 18 years old.";
        }
        if (
          !state.infor.data.driverPhoneNumber ||
          !/^\d{10}$/.test(state.infor.data.driverPhoneNumber)
        ) {
          newErrors.phoneNumber = "Phone number is required.";
        }
        if (
          !state.infor.data.driverNationalId ||
          !/^\d{9,12}$/.test(state.infor.data.driverNationalId)
        ) {
          newErrors.nationalId = "National ID is required.";
        }
        if (!state.infor.data.driverDrivingLicenseUrl) {
          newErrors.drivingLicenseUrl = "Driving license is required.";
        }
        if (!state.infor.data.driverCityProvince) {
          newErrors.addressCityProvince = "City/Province is required.";
        }
        if (!state.infor.data.driverDistrict) {
          newErrors.addressDistrict = "District is required.";
        }
        if (!state.infor.data.driverWard) {
          newErrors.addressWard = "Ward is required.";
        }
        if (!state.infor.data.driverHouseNumberStreet) {
          newErrors.addressHouseNumberStreet = "House number is required.";
        }
        if (!state.infor.data.driverEmail) {
          newErrors.email = "Email is required.";
        }
      }

      state.errorsBooking = newErrors;

      if (Object.keys(newErrors).length > 0) {
        toast.error("⚠️ Please fulfill all the fields!");
        return;
      }
      // else {
      //   toast.success("🚗 Add Renter information Successful! 🎉", {
      //     position: "top-right",
      //   });
      // }
    },
  },

  extraReducers: (builder) => {
    builder.addCase(fetchInforProfile.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(fetchInforProfile.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";

      state.infor = {
        ...action.payload,
        driver: false,

        renter: {
          driverFullName: "",
          driverDob: "",
          driverPhoneNumber: "",
          driverNationalId: "",
          drivingLicenseUrl: "",
          driverCityProvince: "",
          drivingLicenseName: "",
          driverDistrict: "",
          driverWard: "",
          driverHouseNumberStreet: "",
          driverEmail: "",
        },

        paymentType: "",
        addressCityProvince: "",
        addressDistrict: "",
        addressWard: "",
        addressHouseNumberStreet: "",
      };
    });
    builder.addCase(fetchInforProfile.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });

    builder.addCase(getWallet.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(getWallet.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.wallet = action.payload;
    });
    builder.addCase(getWallet.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(createBooking.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(createBooking.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.wallet = action.payload;
    });
    builder.addCase(createBooking.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(getBookingDetail.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(getBookingDetail.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(getBookingDetail.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
    builder.addCase(saveBooking.pending, (state) => {
      state.statusBooking = "loading";
    });
    builder.addCase(saveBooking.fulfilled, (state, action) => {
      state.statusBooking = "succeeded";
      state.infor = action.payload;
    });
    builder.addCase(saveBooking.rejected, (state, action) => {
      state.statusBooking = "failed";
      state.errorsBooking = action.error.message;
    });
  },
});

export const {
  setInfor,
  setErrorsBooking,
  setStepBooking,
  handleNext,
  handleSaveBooking,
} = rentCarSlice.actions;

export default rentCarSlice.reducer;
