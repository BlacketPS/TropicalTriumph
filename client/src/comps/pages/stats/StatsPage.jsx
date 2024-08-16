import Header from "../../global/Header";
import Background from "../../../comps/global/Background";
import Sand from "../../../comps/global/Sand";
import Loader from "../../../comps/global/Loader";
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/stats.scss"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StatsPage() {
    const [user, setUser] = useState(useSelector(state => state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let modalRef = useRef(null);
    const leaderboard = useState({
        leaderboard: [],
        position: 0
    });
    const [modal, setModal] = useState({
        header: "",
        content: "",
        buttons: {}
    });
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
            axios.get("/api/leaderboard").then((res) => {
                if (res.data.error) return navigate('/logout');
                leaderboard[1]({
                    leaderboard: res.data.leaderboard,
                    position: res.data.position
                });
                loaderRef.current.style.display = "none";
            });
        });
    }, []);
    return (
        <>
            <Header/>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <div className="container">
                <div className="left-column">
                    <div className="stats-container">
                        <div className="shovel-avatar-container">
                            <img draggable={false} style={{
                                userSelect: "none",
                            }} onClick={() => {
                                let buttons = {};
                                if (user.shovel < 4) buttons = {
                                    "Upgrade": () => {
                                        if (user.shells < [25000, 100000, 250000, 500000][user.shovel]) return setModal({
                                            header: "Error",
                                            content: `You need ${([25000, 100000, 250000, 500000][user.shovel] - user.shells).toLocaleString()} more shells to upgrade your shovel.`,
                                            buttons: {
                                                "Okay": () => modalRef.current.style.display = "none"
                                            }
                                        });
                                        modalRef.current.style.display = "none";
                                        loaderRef.current.style.display = "flex";
                                        axios.post("/api/upgrade").then((res) => {
                                            if (res.data.error) return setModal({
                                                header: "Error",
                                                content: res.data.reason,
                                                buttons: {
                                                    "Okay": () => modalRef.current.style.display = "none"
                                                }
                                            }), modalRef.current.style.display = "flex", loaderRef.current.style.display = "none";
                                            user.shovel += 1;
                                            user.shells -= [25000, 100000, 250000, 500000][user.shovel - 1];
                                            dispatch({type: "SET_USER", payload: user});
                                            setUser({...user});
                                            modalRef.current.style.display = "flex";
                                            setModal({
                                                header: "Shovel",
                                                content: `You have successfully upgraded your shovel to the ${["iron", "ruby", "gold", "diamond"][user.shovel - 1]} tier.`,
                                                buttons: {
                                                    "Okay": () => modalRef.current.style.display = "none"
                                                }
                                            });
                                            loaderRef.current.style.display = "none";
                                        });
                                    },
                                    "Cancel": () => modalRef.current.style.display = "none"
                                } 
                                else buttons = {
                                    "Okay" : () => modalRef.current.style.display = "none"
                                }
                                setModal({
                                    header: "Shovel",
                                    content: user.shovel <= 0 ? "Are you sure you want to upgrade your shovel to the iron tier for 25,000 shells?<br>Your shovel can dig up treasures every 20 seconds." :
                                    user.shovel === 1 ? "Are you sure you want to upgrade your shovel to the ruby tier for 100,000 shells?<br>Your shovel can dig up treasures every 15 seconds." :
                                    user.shovel === 2 ? "Are you sure you want to upgrade your shovel to the gold tier for 250,000 shells?<br>Your shovel can dig up treasures every 10 seconds." :
                                    user.shovel === 3 ? "Are you sure you want to upgrade your shovel to the diamond tier for 500,000 shells?<br>Your shovel can dig up treasures every 5 seconds." :
                                    user.shovel >= 4 ? "You have the highest tier shovel." : "Are you sure you want to upgrade your shovel to the iron tier for 25,000 shells?<br>Your shovel can dig up treasures every 20 seconds.",
                                    buttons: buttons
                                });
                                modalRef.current.style.display = "flex";
                            }} className="shovel-avatar" src={
                                user.shovel <= 0 ? "/content/shovels/stone.png" :
                                user.shovel === 1 ? "/content/shovels/iron.png" :
                                user.shovel === 2 ? "/content/shovels/ruby.png" :
                                user.shovel === 3 ? "/content/shovels/gold.png" :
                                user.shovel >= 4 ? "/content/shovels/diamond.png" : "/content/shovels/stone.png"
                            } alt="Shovel"></img>
                        </div>
                        <div className="stats">
                            <div><img draggable={false}  className="stats-icon" style={{ userSelect: "none" }} src="/content/user-icon.png" alt="User Icon"/>{user.username}</div>
                            <div><img draggable={false}  className="stats-icon" style={{ userSelect: "none" }} src={
                                leaderboard[0].position === 1 ? "/content/trophy-icon-gold.png" :
                                leaderboard[0].position === 2 ? "/content/trophy-icon-silver.png" :
                                leaderboard[0].position === 3 ? "/content/trophy-icon-bronze.png" :
                                leaderboard[0].position >= 4 && leaderboard[0].position <= 10 ? "/content/trophy-icon-10.png" :
                                leaderboard[0].position >= 11 && leaderboard[0].position <= 25 ? "/content/trophy-icon-25.png" :
                                "/content/trophy-icon-other.png"
                            } alt="Trophy Icon"/>Position #{leaderboard[0].position.toLocaleString()}</div>
                            <div style={{
                                position: "relative",
                                top: "5.5vw"
                            }}>
                                <div><img draggable={false}  className="stats-icon" style={{ userSelect: "none" }} src="/content/shell-icon.png" alt="Shell Icon"/>Shells: {user.shells.toLocaleString()}</div>
                                <div><img draggable={false}  className="stats-icon" style={{ userSelect: "none" }} src="/content/treasure-icon.png" alt="Treasure Icon"/>Treasures Found: {user.miscellaneous.treasures.toLocaleString()}</div>
                                <div><img draggable={false}  className="stats-icon" style={{ userSelect: "none" }} src="/content/treasure-icon.png" alt="Treasure Icon"/>Unique Treasures: {Object.values(user.treasures).flatMap(category => Object.keys(category).filter(treasure => category[treasure] > 0)).length.toLocaleString()}</div>
                            </div>
                        </div>
                    </div>
                    <div className="history-container">
                        <div className="history-item-container">
                            {
                                user.miscellaneous.history.length === 0 ? <div className="no-history-text">You have no history of any dug up treasures.</div> : 
                                user.miscellaneous.history.map((item, index) => {
                                    let image = "";
                                    Object.keys(user.treasures).forEach(category => {
                                        Object.keys(user.treasures[category]).forEach(treasure => {
                                            if (treasure === item.name) image = `/content/items/${category}/${treasure}.png`;
                                        });
                                    });
                                    return (
                                        <div key={index} className="history-item">
                                            <div className="history-item-name">x{item.quantity} {item.name}</div>
                                            <img draggable={false}  className="history-item-image" src={image} alt={item.name}></img>
                                            <div className="history-item-date">{new Date(item.date).toLocaleString()}</div>
                                        </div>
                                    );
                                })
                            }
                        </div>
                    </div>
                </div>
                <div className="sandbox-container">
                    <div className="sandbox-item-container">
                        {
                            Object.keys(user.treasures).map(category => {
                                return Object.keys(user.treasures[category]).map(treasure => {
                                    return (
                                        <div style={{
                                            userSelect: "none"
                                        }} key={treasure} onClick={
                                            () => {
                                                if (user.treasures[category][treasure] <= 0) return;
                                                modalRef.current.style.display = "flex";
                                                setModal({
                                                    header: treasure,
                                                    content: `Do you want to sell or list this treasure?`,
                                                    buttons: {
                                                        "Sell": () => {
                                                            let prices = [
                                                                1,
                                                                5,
                                                                10,
                                                                25,
                                                                100,
                                                                2500,
                                                                10000
                                                            ];

                                                            let price;
                                                            Object.keys(user.treasures).forEach(category => {
                                                                if (Object.keys(user.treasures[category]).includes(treasure)) price = prices[Object.keys(user.treasures[category]).indexOf(treasure)];
                                                            });
                                                            setModal({
                                                                header: `Sell ${treasure}(s) for ${price.toLocaleString()} shell(s) each:`,
                                                                content: `
                                                                <input style="margin-top: 1vw; width: 10vw;" class="input" placeholder="Quantity" type="text"></input> <div style="display: inline;font-size: 3vw;margin-left: 1vw;top: 0.5vw;position: relative;">/ ${user.treasures[category][treasure].toLocaleString()}</div>
                                                                `,
                                                                buttons: {
                                                                    "Sell": () => {
                                                                        if (modalRef.current.children[0].children[0].children[1].children[0].value === "") return;
                                                                        if (modalRef.current.children[0].children[0].children[1].children[0].value === 0) return;
                                                                        modalRef.current.style.display = "none";
                                                                        loaderRef.current.style.display = "flex";
                                                                        axios.post("/api/sell", {
                                                                            treasure: treasure,
                                                                            quantity: parseInt(modalRef.current.children[0].children[0].children[1].children[0].value)
                                                                        }).then(res => {
                                                                            if (res.data.error) return setModal({
                                                                                header: "Error",
                                                                                content: res.data.reason,
                                                                                buttons: {
                                                                                    "Okay": () => modalRef.current.style.display = "none"
                                                                                }
                                                                            }), modalRef.current.style.display = "flex", loaderRef.current.style.display = "none";
                                                                            user.shells += price * parseInt(modalRef.current.children[0].children[0].children[1].children[0].value);
                                                                            user.treasures[category][treasure] -= modalRef.current.children[0].children[0].children[1].children[0].value;
                                                                            dispatch({type: "SET_USER", payload: user});
                                                                            setUser({...user});
                                                                            loaderRef.current.style.display = "none";
                                                                        }).catch(err => {
                                                                            loaderRef.current.style.display = "none";
                                                                        });
                                                                    },
                                                                    "Cancel": () => modalRef.current.style.display = "none"
                                                                }
                                                            })
                                                            setTimeout(() => { 
                                                                modalRef.current.children[0].children[0].children[1].children[0].oninput = () => {
                                                                    if (/[^0-9]/.test(modalRef.current.children[0].children[0].children[1].children[0].value)) modalRef.current.children[0].children[0].children[1].children[0].value = modalRef.current.children[0].children[0].children[1].children[0].value.replace(/[^0-9]/g, "");
                                                                    if (modalRef.current.children[0].children[0].children[1].children[0].value > user.treasures[category][treasure]) modalRef.current.children[0].children[0].children[1].children[0].value = user.treasures[category][treasure];
                                                                }
                                                            }, 1);
                                                        },
                                                        "List": () => {
                                                            setModal({
                                                                header: `List ${treasure} treasure for how many shells?`,
                                                                content: `
                                                                <input style="margin-top: 1vw; width: 10vw;" class="input" placeholder="Price" type="text"></input>
                                                                `,
                                                                buttons: {
                                                                    "List": () => {
                                                                        if (modalRef.current.children[0].children[0].children[1].children[0].value === "") return;
                                                                        if (modalRef.current.children[0].children[0].children[1].children[0].value === 0) return;
                                                                        modalRef.current.style.display = "none";
                                                                        loaderRef.current.style.display = "flex";
                                                                        axios.post("/api/bazaar/list", {
                                                                            item: treasure,
                                                                            price: parseInt(modalRef.current.children[0].children[0].children[1].children[0].value)
                                                                        }).then(res => {
                                                                            if (res.data.error) return setModal({
                                                                                header: "Error",
                                                                                content: res.data.reason,
                                                                                buttons: {
                                                                                    "Okay": () => modalRef.current.style.display = "none"
                                                                                }
                                                                            }), modalRef.current.style.display = "flex", loaderRef.current.style.display = "none";
                                                                            user.treasures[category][treasure]--;
                                                                            dispatch({type: "SET_USER", payload: user});
                                                                            setUser({...user});
                                                                            loaderRef.current.style.display = "none";
                                                                        }).catch(err => {
                                                                            loaderRef.current.style.display = "none";
                                                                        });
                                                                    },
                                                                    "Cancel": () => modalRef.current.style.display = "none"
                                                                }
                                                            })
                                                            setTimeout(() => { 
                                                                modalRef.current.children[0].children[0].children[1].children[0].oninput = () => {
                                                                    if (/[^0-9]/.test(modalRef.current.children[0].children[0].children[1].children[0].value)) modalRef.current.children[0].children[0].children[1].children[0].value = modalRef.current.children[0].children[0].children[1].children[0].value.replace(/[^0-9]/g, "");
                                                                    if (modalRef.current.children[0].children[0].children[1].children[0].value > 999999999) modalRef.current.children[0].children[0].children[1].children[0].value = 999999999;
                                                                }
                                                            }, 1);
                                                        },
                                                        "Cancel": () => modalRef.current.style.display = "none"
                                                    }
                                                });
                                            }
                                        } className="sandbox-item" aria-disabled={user.treasures[category][treasure] <= 0}>
                                            <img draggable={false}  className="sandbox-item-image" src={`/content/items/${category}/${treasure}.png`} alt={treasure}></img>
                                            {
                                                user.treasures[category][treasure] > 0 &&
                                                <div className="sandbox-item-quantity">x{user.treasures[category][treasure]}</div>
                                            }
                                        </div>
                                    );
                                });
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