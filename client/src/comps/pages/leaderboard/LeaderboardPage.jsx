import Header from "../../global/Header";
import Background from "../../global/Background";
import Sand from "../../global/Sand";
import Loader from "../../global/Loader";
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/leaderboard.scss"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LeaderboardPage() {
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
    }, [dispatch, user.username]);
        return (
        <>
            <Header/>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <div className="leaderboard-title">Leaderboard</div>
      <div className="leaderboard-container">
        {
            leaderboard[0].leaderboard.map((user, index) => {
                return (
                    <div key={index + 1} className="leaderboard-position">
                        <div className="leaderboard-name">#{index + 1} {user.username}</div>
                        <div className="leaderboard-unique">{user.treasures}/35 Treasures</div>
                    </div>
                )
            })
        }
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