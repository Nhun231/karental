import {
    Breadcrumbs,
    Link,
    Typography,
    Grid,
    Tabs,
    Tab,
    Box,
} from "@mui/material";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCarDetail } from "../services/UserServices";
import { CarOverView } from "../components/CarOverView";
import { BasicInformation } from "../components/BasicInformation";
import { DetailsComponent } from "../components/DetailsComponent";
import { TermofUse } from "../components/TermofUse";
import { useSelector, useDispatch } from "react-redux";
import { setRentalTime } from "../reducers/RentalTimeReducer";
import dayjs from "dayjs";

const CarDetail = () => {
    // Get id from URL
    const { id } = useParams();
    // State to store carData
    const [CarData, setCarData] = useState(null);
    // State to manage loading status
    const [loading, setLoading] = useState(true);
    // State to manage selected tab
    const [tabIndex, setTabIndex] = useState(0);
    // Get pickUp and dropOff Time from Redux store
    const pickUpTime = useSelector((state) => state.rental.pickUpTime);
    const dropOffTime = useSelector((state) => state.rental.dropOffTime);
    // Access dispatch function from Redux
    const dispatch = useDispatch();
    // Handle rentaltime change by update pickUp and dropOff Time in Redux store
    const handleRentalTimeChange = (newPickUpTime, newDropOffTime) => {
        const pickUpTime = dayjs(newPickUpTime);
        const dropOffTime = dayjs(newDropOffTime);
        dispatch(setRentalTime({ pickUpTime: pickUpTime, dropOffTime: dropOffTime }));
    };
    // Fetch CarData from API when component mounts
    // TODO: Separate this API to two section: getCarData, getAvailability
    useEffect(() => {
        async function getCarData() {
            if (!id || !pickUpTime || !dropOffTime) return; // Block if lacks of data

            const formData = { carId: id, pickUpTime, dropOffTime };
            console.log(formData)
            try {
                setLoading(true);
                const response = await getCarDetail(formData);
                setCarData(response.data);
            } catch (error) {
                console.error("Failed to fetch car data:", error);
            } finally {
                setLoading(false);
            }
        }
        getCarData();
    }, [id, pickUpTime, dropOffTime]);

    if (loading) return <p>Loading...</p>;

    return (
        <div>
            {/* Header */}
            <Header />

            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Link underline="hover" color="inherit" href="/"> {/* TODO: fix link search result */}
                    Search Results
                </Link>
                <Typography color="text.primary">Car Detail</Typography>
            </Breadcrumbs>

            <div className="page-content" style={{ marginBottom: "40px" }}>
                {/* Car Overview */}
                <Grid container spacing={3} sx={{ maxWidth: "1200px", mx: "auto", mt: 2 }}>
                    <CarOverView CarData={CarData} large={true} onRentalTimeChange={handleRentalTimeChange} />
                </Grid>

                {/* Tabs */}
                <Box sx={{ maxWidth: "1200px", mx: "auto", mt: 4 }}>
                    <Tabs value={tabIndex} onChange={(event, newValue) => setTabIndex(newValue)}>
                        <Tab label="Basic Information" />
                        <Tab label="Details" />
                        <Tab label="Term of use" />
                    </Tabs>

                    {/* Tab Content */}
                    <Box sx={{
                        border: "1px solid #ccc",
                        padding: 2,
                        textAlign: "left",
                        borderRadius: 1,
                        m: 0
                    }}>
                        {tabIndex === 0 && <BasicInformation CarData={CarData} />}
                        {tabIndex === 1 && <DetailsComponent CarData={CarData} />}
                        {tabIndex === 2 && <TermofUse CarData={CarData} />}
                    </Box>
                </Box>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
};

export default CarDetail;
