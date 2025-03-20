import * as React from "react";
import {
  Typography,
  Box,
  Button,
  Rating,
  Select,
  MenuItem,
} from "@mui/material";
import { useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation, Autoplay } from "swiper/modules";
import { getCarDetail, setCar } from "../../reducers/carFetchReducer";
import { getBookingDetail, setInfor } from "../../reducers/rentCarReducer";
import { useDispatch, useSelector } from "react-redux";
import { Skeleton } from "@mui/material";
import TabEditBooking from "./TabEditBooking";
import Header from "../Header";
import NavigateBreadcrumb from "../common/NavigateBreadcrumb";
import Footer from "../Footer";
import Swal from "sweetalert2";
import dayjs from "dayjs";
import duration from "dayjs/plugin/duration";
dayjs.extend(duration);

export default function EditBookingDescription() {
  const dispatch = useDispatch();

  //get carId from session
  //   const carId = sessionStorage.getItem("selectedCarId");
  const {
    carData = {},
    status,
    error,
  } = useSelector((state) => state.carFetch);

  const { infor = {} } = useSelector((state) => state.rentCar);

  const [images, setImages] = useState([]);
  const [value, setValue] = useState(0);
  const statusColors = {
    CONFIRMED: "green",
    "IN-PROGRESS": "orange",
    "PENDING DEPOSIT": "red",
    COMPLETED: "blue",
    CANCELLED: "grey",
    "PENDING PAYMENT": "red",
    "WAITTING PAYMENT": "yellow",
  };

  //function get data car detail
  useEffect(() => {
    const fetchAndProcessCarData = async () => {
      try {
        const bookingData = await dispatch(getBookingDetail()).unwrap();
        if (!bookingData?.data) return;
        const data = await dispatch(
          getCarDetail({
            carId: bookingData.data.carId, // Lấy carId từ bookingData
            pickUpTime: "2025-03-30T06:00:00",
            dropOffTime: "2025-03-31T06:59:00",
          })
        ).unwrap();

        if (!data?.data) return;

        // pick image from IndexedDB if exist, else not pick from API
        const front = data?.data?.carImageFront;
        const back = data?.data?.carImageBack;
        const left = data?.data?.carImageLeft;
        const right = data?.data?.carImageRight;

        // update list image display
        setImages([front, back, left, right].filter(Boolean));

        const pickUp = dayjs(bookingData?.data?.pickUpTime);
        const dropOff = dayjs(bookingData?.data?.dropOffTime);

        const minutes = dropOff.diff(pickUp, "minute"); // Tính số phút giữa hai thời điểm
        const days = Math.ceil(minutes / (24 * 60)); // Chuyển phút thành số ngày làm tròn lên
        dispatch(setInfor({ ...infor, days }));
      } catch (err) {
        console.error("Fetch failed:", err);
      }
    };

    fetchAndProcessCarData();
  }, [dispatch]);

  return (
    <>
      <Header></Header>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <NavigateBreadcrumb />
      </Box>
      <Box sx={{ mx: "auto", maxWidth: "1200px" }}>
        <Typography
          variant="h4"
          style={{ marginTop: "30px", marginLeft: "10%", fontWeight: "bold" }}
        >
          Booking Details
        </Typography>
        <div style={{ display: "flex" }}>
          <div>
            <Box
              sx={{
                width: "500px",
                margin: "50px 150px",
                marginRight: "50px",
                mt: 4,
                border:
                  images.length === 0 && status !== "loading"
                    ? "2px dashed gray"
                    : "none",
                borderRadius: "8px",
                height: "300px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {status === "loading" || images.length === 0 ? (
                <Skeleton variant="rectangular" width={500} height={300} />
              ) : error ? (
                <Typography variant="body1" color="error">
                  Failed to load images
                </Typography>
              ) : (
                <Swiper
                  modules={[Navigation, Autoplay]}
                  navigation
                  autoplay={{ delay: 3000 }}
                >
                  {images.map((src, index) => (
                    <SwiperSlide key={index}>
                      <img
                        src={src}
                        alt={`Slide ${index + 1}`}
                        style={{
                          width: "100%",
                          height: "300px",
                          objectFit: "cover",
                          borderRadius: "8px",
                        }}
                      />
                    </SwiperSlide>
                  ))}
                </Swiper>
              )}
            </Box>
          </div>
          <div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4" style={{ marginTop: "30px" }}>
                {carData?.data?.brand ? (
                  `${carData.data.brand} ${carData.data.model}`
                ) : (
                  <Skeleton variant="text" width={200} height={40} />
                )}
              </Typography>
            </div>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ marginTop: "10px" }}
            >
              <ul>
                <li>From: {infor?.data?.pickUpTime}</li>
                <li>To: {infor?.data?.dropOffTime}</li>
              </ul>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Number of day:</Box>
              <Box sx={{ flex: "2" }}>{infor?.days}</Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Base price:</Box>
              <Box sx={{ flex: "2", color: "red" }}>
                {infor?.data?.basePrice ? (
                  <>
                    {new Intl.NumberFormat("en-US").format(
                      infor.data.basePrice
                    )}
                    K
                  </>
                ) : (
                  <Skeleton variant="text" width={50} />
                )}
                <span style={{ color: "black" }}> /day</span>
              </Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Total:</Box>
              <Box sx={{ flex: "2", color: "red" }}>
                {infor?.data?.totalPrice ? (
                  <>
                    {new Intl.NumberFormat("en-US").format(
                      infor.data.totalPrice
                    )}
                    K
                  </>
                ) : (
                  <Skeleton variant="text" width={50} />
                )}
              </Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Deposit:</Box>
              <Box sx={{ flex: "2", color: "red" }}>
                {infor?.data?.deposit ? (
                  <>
                    {new Intl.NumberFormat("en-US").format(infor.data.deposit)}K
                  </>
                ) : (
                  <Skeleton variant="text" width={50} />
                )}
              </Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Booking No.:</Box>
              <Box sx={{ flex: "2" }}>{infor?.data?.bookingNumber}</Box>
            </Typography>

            <Typography
              variant="h6"
              component={"div"}
              sx={{ display: "flex", alignItems: "center", marginTop: "10px" }}
            >
              <Box sx={{ flex: "1", fontWeight: "bold" }}>Booking status:</Box>
              <Box sx={{ flex: "2", color: statusColors[infor?.data?.status] }}>
                {infor?.data?.status}
              </Box>
            </Typography>
          </div>
        </div>

        <TabEditBooking></TabEditBooking>
      </Box>
      <Footer />
    </>
  );
}
