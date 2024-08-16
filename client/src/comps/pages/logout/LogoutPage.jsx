import Background from "../../../comps/global/Background";
import Sand from "../../../comps/global/Sand";
import Loader from "../../../comps/global/Loader";
import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";

export default function LogoutPage() {
    const navigate = useNavigate();
    const user = useSelector((state) => state);
    const dispatch = useDispatch();
    let loaderRef = useRef(null);

    useEffect(() => {
        loaderRef.current.style.display = "flex";
        axios.get("/api/logout").then(() => {
            dispatch({ type: "LOGOUT" });
            navigate("/login");
        });
    }, []);
    
    return (
        <>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>
        </>
    )
}