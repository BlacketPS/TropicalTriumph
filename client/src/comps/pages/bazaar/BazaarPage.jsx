import Header from "../../global/Header";
import Background from "../../global/Background";
import Sand from "../../global/Sand";
import Loader from "../../global/Loader";
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/bazaar.scss"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function BazaarPage() {
    const [user, setUser] = useState(useSelector(state => state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let modalRef = useRef(null);
    const [modal, setModal] = useState({
        header: "",
        content: "",
        buttons: {}
    });
    const [listings, setListings] = useState([]);
    let loaderRef = useRef(null);

    useEffect(() => {
        const closeModal = (e) => e.key === "Escape" ? modalRef.current.style.display = "none" : null;
        document.addEventListener("keydown", closeModal);

        return () => document.removeEventListener("keydown", closeModal);
    }, []);

    useEffect(() => {
        loaderRef.current.style.display = "flex";
        axios.get("/api/user").then((res) => {
            if (res.data.error) return navigate('/logout');
            dispatch({type: "SET_USER", payload: res.data.user});
            setUser(res.data.user);
            axios.get("/api/bazaar").then((res) => {
                if (res.data.error) return navigate('/logout');
                setListings(res.data.bazaar);
                loaderRef.current.style.display = "none";
            });
        });
    }, [dispatch, user.username]);
    return (
        <>
            <Header/>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <div onClick={
                () => {
                    loaderRef.current.style.display = "flex";
                    axios.get(`/api/bazaar?item=${user.id}`).then((res) => {
                        if (res.data.error) return navigate('/logout');
                        setListings(res.data.bazaar);
                        loaderRef.current.style.display = "none";
                    });
                }
            } className="bazaar-listings-button-container" style={{
                overflow: "hidden"
            }}>
                <div className="bazaar-listings-button-container-inside">Your Listings</div>
            </div>

            <div onClick={
                () => {
                    loaderRef.current.style.display = "flex";
                    axios.get("/api/bazaar").then((res) => {
                        if (res.data.error) return navigate('/logout');
                        setListings(res.data.bazaar);
                        loaderRef.current.style.display = "none";
                    });
                }
            } className="bazaar-clear-button-container" style={{
                overflow: "hidden"
            }}>
                <div className="bazaar-clear-button-container-inside">Clear</div>
            </div>

            <div className="bazaar-title">Bazaar</div>
            <div className="bazaar-shell-count-container">
                <div className="bazaar-shell-count">
                    <img style={{
                        userSelect: "none"
                    }} draggable={false} className="bazaar-shell-icon" alt="Shell" src="/content/shell-icon.png"></img>
                    <div className="bazaar-shell-count-inside">{user.shells.toLocaleString()}</div>
                </div>
            </div>
            <div className="bazaar-container">
                <div className="bazaar-selector">
                {
                    Object.keys(user.treasures).map(category => {
                        return Object.keys(user.treasures[category]).map((treasure, index) => {
                            return (
                                <div style={{
                                    userSelect: "none"
                                }} key={index} onClick={
                                    () => {
                                        loaderRef.current.style.display = "flex";
                                        axios.get(`/api/bazaar?item=${treasure}`).then((res) => {
                                            if (res.data.error) return navigate('/logout');
                                            setListings(res.data.bazaar);
                                            loaderRef.current.style.display = "none";
                                        });
                                    }
                                } className="bazaar-selector-item">
                                    <img style={{
                                        userSelect: "none"
                                    }} draggable={false} className="bazaar-selector-item-image" src={`/content/items/${category}/${treasure}.png`} alt={treasure}></img>
                                </div>
                            );
                        });
                    })
                }
                </div>
                <div className="bazaar-results-text">Results:</div>
                <div className="bazaar-listings">
                    <div className="bazaar-listings-inside">
                    {
                        listings.map((listing, index) => {
                            return (
                                <div style={{
                                    userSelect: "none"
                                }} key={index} onClick={
                                    () => {
                                        if (listing.seller === user.username) {
                                            loaderRef.current.style.display = "flex";
                                            axios.post("/api/bazaar/remove", {
                                                id: listing.id
                                            }).then((res) => {
                                                if (res.data.error) return navigate('/logout');
                                                listings.splice(listings.indexOf(listing), 1);
                                                setListings([...listings]);
                                                loaderRef.current.style.display = "none";
                                            });
                                        } else {
                                            modalRef.current.style.display = "flex";
                                            let buttons;
                                            if (user.shells < listing.price) buttons = {
                                                "Not Enough Shells": () => modalRef.current.style.display = "none"
                                            } 
                                            else buttons = {
                                                "Yes": () => {
                                                    modalRef.current.style.display = "none";
                                                    loaderRef.current.style.display = "flex";
                                                    axios.post("/api/bazaar/buy", {
                                                        id: listing.id
                                                    }).then((res) => {
                                                        if (res.data.error) return setModal({
                                                                header: "Error",
                                                                content: res.data.reason,
                                                                buttons: {
                                                                    "Ok": () => {
                                                                        modalRef.current.style.display = "none";
                                                                    }
                                                                }
                                                            }), modalRef.current.style.display = "flex", loaderRef.current.style.display = "none";
                                                        
                                                        dispatch({type: "SET_USER", payload: {
                                                            ...user,
                                                            shells: user.shells - listing.price,
                                                        }});
                                                        setUser({
                                                            ...user,
                                                            shells: user.shells - listing.price,
                                                        });
                                                        listings.splice(listings.indexOf(listing), 1);
                                                        setListings([...listings]);
                                                        loaderRef.current.style.display = "none";
                                                    });
                                                },
                                                "No": () => modalRef.current.style.display = "none"
                                            }
                                            setModal({
                                                header: listing.item,
                                                content: `Are you sure you want to buy this treasure for ${listing.price.toLocaleString()} shells?`,
                                                buttons
                                            });
                                        }
                                    }
                                } className="bazaar-item">
                                    <img style={{
                                        userSelect: "none"
                                    }} draggable={false} className="bazaar-item-image" src={
                                        Object.entries(user.treasures).flatMap(([category, treasures]) => Object.entries(treasures).map(([treasure, _]) => ({ [treasure]: `/content/items/${category}/${treasure}.png` }))).reduce((acc, obj) => ({ ...acc, ...obj }), {})[listing.item]
                                    } alt={listing.item}/>
                                    <div className="bazaar-item-author">{listing.seller}</div>
                                    <div className="bazaar-item-price">
                                        <img draggable={false} style={{
                                            width: "10%",
                                            position: "relative",
                                            top: "0.1vw",
                                            marginRight: "0.15vw",
                                            userSelect: "none"
                                        }} src="/content/shell-icon.png" alt="Shell"/>
                                        {listing.price.toLocaleString()} 
                                    </div>
                                </div>
                            );
                        })
                    }
                    </div>
                </div>
            </div>

            <div ref={modalRef} style={{
                    display: "none"
                }} className="modal">
                    <div className="modal-container">
                        <div style={{
                            position: "relative",
                            bottom: "0.5vw",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                        }}>
                            <div className="modal-header">{modal.header}</div>
                            <div dangerouslySetInnerHTML={
                                {__html: modal.content}
                            } className="modal-content"></div>
                            <div className="modal-buttons">
                                {
                                    Object.keys(modal.buttons).map(button => {
                                        return (
                                            <div key={button} onClick={() => {
                                                modal.buttons[button]();
                                            }} style={{
                                                fontSize: "1.25vw",
                                                boxShadow: "inset 0 -0.25vw rgba(0, 0, 0, 0.2)"
                                            }} className="button">{button}</div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
        </>
    )
}