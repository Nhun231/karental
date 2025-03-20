import { useState, useEffect } from "react";
import {
    Breadcrumbs,
    Link,
    Typography,
    Box
} from "@mui/material";
import Header from "../components/Header"
import SearchForm from "../components/SearchForm"
import { useSearchParams } from "react-router-dom";
import { getSearchResult } from "../services/UserServices";
import SearchResults from "../components/SearchResult";
import dayjs from "dayjs";
import PaginationComponent from "../components/Pagination";
import Footer from "../components/Footer";
export const SearchResult = () => {
    const [errorMsg, setErrorMsg] = useState({});
    const [totalElement, setTotalElement] = useState(0);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [cars, setCars] = useState([]);
    const [page, setPage] = useState(parseInt(searchParams.get("page")) || 1);
    const [pageSize, setPageSize] = useState(
        parseInt(searchParams.get("size")) || 10
    );
    const [totalPages, setTotalPages] = useState(1);
    const [sortOption, setSortOption] = useState("newest");
    const address = searchParams.get("address") || "";
    console.log("s", address)
    const pickUpTime = searchParams.get("pickUpTime") || "";
    const dropOffTime = searchParams.get("dropOffTime") || "";
    const getSortQuery = (option) =>
    ({
        newest: "productionYear,DESC",
        oldest: "productionYear,ASC",
        priceHigh: "basePrice,DESC",
        priceLow: "basePrice,ASC",
    }[option] || "productionYear,DESC");
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const params = {
                    address,
                    pickUpTime: dayjs(pickUpTime).format("YYYY-MM-DDTHH:mm:ss"),
                    dropOffTime: dayjs(dropOffTime).format("YYYY-MM-DDTHH:mm:ss"),
                    page: page - 1,
                    size: pageSize,
                    sort: getSortQuery(sortOption),
                };
                const response = await getSearchResult(params);
                setCars(response.data.content || []);
                setTotalPages(response.data.totalPages || 1);
                setTotalElement(response.data.totalElements || 0);
            } catch (error) {
                console.error("Failed to fetch car data:", error);
                setErrorMsg({ message: "Failed to load search results." });
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [address, pickUpTime, dropOffTime, page, pageSize, sortOption]);
    if (loading) return <p>Loading...</p>;
    return (
        <div>
            {/* Header */}
            <Header></Header>
            {/* Breadcrumbs */}
            <Breadcrumbs sx={{ mx: "auto", maxWidth: "1200px", py: 1, px: 2 }}>
                <Link underline="hover" color="inherit" href="/">
                    Home
                </Link>
                <Typography color="text.primary">Search Results</Typography>
            </Breadcrumbs>

            <SearchForm errorMsg={errorMsg} setErrorMsg={setErrorMsg} searchParams={searchParams}></SearchForm>
            <SearchResults CarData={cars} totalElement={totalElement} setSortOption={setSortOption} sortOption={sortOption} setPage={setPage}></SearchResults>
            {/* Pagination */}
            <PaginationComponent
                page={page - 1}
                totalPages={totalPages}
                onPageChange={(newPage) => setPage(newPage + 1)}
                pageSize={pageSize}
                onPageSizeChange={(size) => {
                    setPageSize(size);
                    setPage(1);
                }}
            />
            <Box sx={{ mt: 4 }}>
                <Footer />
            </Box>
        </div >
    )
}