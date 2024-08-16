import { useNavigate } from "react-router-dom";
import Background from "../../global/Background";
import Sand from "../../global/Sand";
import Loader from "../../global/Loader";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useSelector, useDispatch } from 'react-redux';

axios.defaults.withCredentials = true;

function LoginPage() {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [modal, setModal] = useState({
        header: "",
        content: "",
        buttons: {}
    });
    let modalRef = useRef(null);
    let loaderRef = useRef(null);
    const navigate = useNavigate();
    const [user, setUser] = useState(useSelector(state => state.user));
    const dispatch = useDispatch();

    useEffect(() => {
        const closeModal = (e) => e.key === "Escape" ? modalRef.current.style.display = "none" : null;
        document.addEventListener("keydown", closeModal);

        return () => document.removeEventListener("keydown", closeModal);
    }, []);

    useEffect(() => {
        loaderRef.current.style.display = "flex";
        axios.get("/api/user").then((res) => {
            loaderRef.current.style.display = "none";
            if (res.data.error) return;
            else navigate("/stats")
        });
    }, [navigate, user.id]);

    return (
        <>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <div style={{
                display: "flex",
                justifyContent: "center",
                alignContent: "center",
                flexDirection: "column",
                background: "#257079",
                padding: "3vw 10vw",
                borderRadius: "2vw",
                boxShadow: "inset 0 -1vw rgba(0, 0, 0, 0.2)"
            }}>

            <p style={{
                fontSize: "3vw",
                textAlign: "center",
                position: "relative",
                bottom: "1vw"
            }}>Login</p>

            <div style={{
                position: "relative",
                bottom: "1vw"
            }}>

            <div
                style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                gap: "2vw",
                position: "relative",
                bottom: "1vw"
            }}>

                <input onChange={(a) => setUsername(a.target.value)} className="input" placeholder="Username" type="text" maxLength="16"></input>
                <input onChange={(a) => setPassword(a.target.value)} className="input" placeholder="Password" type="password"></input>
                <div onClick={() => {
                    if (username === "" && password === "") return 
                    loaderRef.current.style.display = "flex";
                    axios.post("/api/login", {
                        username: username,
                        password: password
                    }).then((res) => {
                        if (res.data.error) {
                            loaderRef.current.style.display = "none";
                            setModal({
                                header: "Error",
                                content: res.data.reason,
                                buttons: {
                                    "Okay": () => {
                                        modalRef.current.style.display = "none";
                                    }
                                }
                            })
                            modalRef.current.style.display = "flex";
                            return;
                        }

                        axios.get("/api/user").then((res) => {
                            if (res.data.error) return navigate("/logout");
                            dispatch({ type: "SET_USER", payload: res.data.user })
                            setUser(res.data.user);
                            navigate("/stats");
                        });
                    });
                }} style={{
                    fontSize: "2vw",
                    boxShadow: "inset 0 -0.75vw rgba(0, 0, 0, 0.2)"
                }} className="button">
                    <div>Login</div>
                </div>

                <p style={{
                    fontSize: "1.5vw"
                }}>You must use your Blacket account credentials to login.</p>

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
                            <div className="modal-content">{modal.content}</div>
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

            </div>

            </div>

            </div>
        </>
    )
}

export default LoginPage;