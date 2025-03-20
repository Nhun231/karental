import { useEffect, useState, useMemo } from "react";
import axios from "axios";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import { useSelector, useDispatch } from "react-redux";
import { setAddress } from "../reducers/RentalTimeReducer";
const Dropdown = ({ label, name, value, onChange, options, disabled, error }) => (
  <div>
    <FormControl fullWidth error={!!error} sx={{ bgcolor: "white", borderRadius: "4px", }}>
      <InputLabel>{label}</InputLabel>
      <Select name={name} value={value || ""} onChange={onChange} disabled={disabled}>
        {options.map((option) => (
          <MenuItem key={option} value={option}>
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
    {error && (
      <Typography variant="caption" color="error" sx={{ bgcolor: "transparent", display: "block" }}>
        {error}
      </Typography>
    )}
  </div>
);
const HouseNumberInput = ({ value, onChange, disabled, error }) => (
  <TextField
    fullWidth
    label="House Number & Street"
    name="houseNumberStreet"
    value={value || ""}
    onChange={onChange}
    disabled={disabled}
    required
    error={!!error}
    helperText={error}
    sx={{ bgcolor: "white" }}
  />
);

export default function AddressSelector({ formData, setFormData, errorMsg, setErrorMsg, handleChange, isSearch, useRedux = false }) {
  const dispatch = useDispatch();
  const reduxAddress = useSelector((state) => state.rental.address);
  console.log("Redux - Address:", reduxAddress);
  const address = useRedux ? reduxAddress : formData;
  console.log("AddressSelector - Address:", address);

  const [addressData, setAddressData] = useState([]);


  useEffect(() => {
    axios
      .get("/database.json")
      .then((res) => setAddressData(res.data.Address_list))
      .catch((err) => console.error("Error loading address data:", err));
  }, []);


  const cities = useMemo(
    () => [...new Set(addressData.map((item) => item.City_Province))],
    [addressData]
  );

  const districts = useMemo(
    () =>
      address.cityProvince
        ? [...new Set(addressData.filter((item) => item.City_Province === address.cityProvince).map((item) => item.Disctrict))]
        : [],
    [address.cityProvince, addressData]
  );

  const wards = useMemo(
    () =>
      address.district
        ? addressData.filter((item) => item.Disctrict === address.district).map((item) => item.Ward)
        : [],
    [address.district, addressData]
  );
  const validateField = (name, value) => {
    if (!value || !value.trim()) {
      if (name === "cityProvince") return "Please select a city/province";
      if (name === "district") return "Please select a district";
      if (name === "ward") return "Please select a ward";
      if (name === "houseNumberStreet") return "";
      return "";
    }
    return "";
  };
  const handleLocalChange = (e) => {
    const { name, value } = e.target;

    if (useRedux) {
      let updatedAddress = { ...reduxAddress, [name]: value };

      if (name === "cityProvince") {
        updatedAddress = { ...updatedAddress, district: "", ward: "", houseNumberStreet: "" };
      } else if (name === "district") {
        updatedAddress = { ...updatedAddress, ward: "", houseNumberStreet: "" };
      } else if (name === "ward") {
        updatedAddress = { ...updatedAddress, houseNumberStreet: "" };
      }

      dispatch(setAddress(updatedAddress));
    } else {
      handleChange(e);

      setFormData((prev) => {
        let updatedForm = { ...prev, [name]: value };

        if (name === "cityProvince") {
          updatedForm = { ...updatedForm, district: "", ward: "", houseNumberStreet: "" };
        } else if (name === "district") {
          updatedForm = { ...updatedForm, ward: "", houseNumberStreet: "" };
        } else if (name === "ward") {
          updatedForm = { ...updatedForm, houseNumberStreet: "" };
        }

        return updatedForm;
      });
    }
    setErrorMsg((prevErrors) => {
      const validKeys = ["cityProvince", "district", "ward", "houseNumberStreet"];
      if (!validKeys.includes(name)) return prevErrors;

      const error = validateField(name, value);
      if (error) {
        return { ...prevErrors, [name]: error }; // Nếu có lỗi, cập nhật lỗi
      } else {
        const { [name]: _, ...newErrors } = prevErrors; // Nếu không có lỗi, xóa key khỏi errorMsg
        return newErrors;
      }
    })

  };

  return (
    <Grid container spacing={2}>
      {isSearch ? <></> : (<Grid item xs={12}>
        <Typography variant="h6">Address</Typography>
      </Grid>)}
      <Grid item xs={12} md={6}>
        <Dropdown label="City/Province" name="cityProvince" value={address.cityProvince} onChange={handleLocalChange} options={cities} error={errorMsg.cityProvince} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown label="District" name="district" value={address.district} onChange={handleLocalChange} options={districts} disabled={!address.cityProvince} error={errorMsg.district} />
      </Grid>
      <Grid item xs={12} md={6}>
        <Dropdown label="Ward" name="ward" value={address.ward} onChange={handleLocalChange} options={wards} disabled={!address.district} error={errorMsg.ward} />
      </Grid>
      <Grid item xs={12} md={6}>
        {isSearch ? <></> : (<HouseNumberInput value={address.houseNumberStreet} onChange={handleLocalChange} disabled={!address.ward} error={errorMsg.houseNumberStreet} />
        )}
      </Grid>
    </Grid>
  );
}
