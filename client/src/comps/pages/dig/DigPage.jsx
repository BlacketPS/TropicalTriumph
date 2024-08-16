import Header from "../../global/Header";
import Background from "../../global/Background";
import Sand from "../../global/Sand";
import Loader from "../../global/Loader";
import { useState, useRef, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux";
import "../../../styles/dig.scss"
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function DigPage() {
    const [user, setUser] = useState(useSelector(state => state.user));
    const dispatch = useDispatch();
    const navigate = useNavigate();
    let modalRef = useRef(null);
    let shovelRef = useRef(null);
    const [modal, setModal] = useState({
        header: "",
        content: "",
        buttons: {}
    });
    let loaderRef = useRef(null);

    useEffect(() => {
        const closeModal = (e) => e.key === "Escape" ? modalRef.current.style.display = "none" : null;
        document.addEventListener("keydown", closeModal);

        document.addEventListener("mousemove", (e) => {
            if (!shovelRef.current) return;
            if (e.target.className === "sandbox") {
                shovelRef.current.style.left = `${e.clientX - (shovelRef.current.clientWidth / 2)}px`;
                shovelRef.current.style.top = `${e.clientY - (shovelRef.current.clientHeight / 2)}px`;
                document.body.style.cursor = "none";
                shovelRef.current.style.visibility = "visible";
            }
            else {
                document.body.style.cursor = "";
                shovelRef.current.style.visibility = "hidden";
            }
        });

        return () => {
            document.removeEventListener("mousemove");
            document.removeEventListener("keydown", closeModal);
            document.body.style.cursor = "";
        }
    }, []);

    useEffect(() => {
        loaderRef.current.style.display = "flex";
        axios.get("/api/user").then((res) => {
          if (res.data.error) return navigate("/logout");
          dispatch({ type: "SET_USER", payload: res.data.user });
          setUser(res.data.user);
          loaderRef.current.style.display = "none";
        });
    }, [dispatch, navigate, user.username]);

    return (
        <>
            <Header/>
            <div className="shell-count-container">
                <div className="shell-count-inside">
                    <img style={{
                        userSelect: "none"
                    }} draggable={false} src="/content/shell-icon.png" alt="Shells" className="shell-count-icon"/> <div className="shell-count-text">{user.shells.toLocaleString()}</div>
                </div>
            </div>
            <Background/>
            <Sand/>
            <Loader ref={loaderRef}/>

            <img draggable={false} ref={shovelRef} src={
                user.shovel <= 0 ? "/content/shovels/stone.png" :
                user.shovel === 1 ? "/content/shovels/iron.png" :
                user.shovel === 2 ? "/content/shovels/ruby.png" :
                user.shovel === 3 ? "/content/shovels/gold.png" :
                user.shovel >= 4 ? "/content/shovels/diamond.png" : "/content/shovels/stone.png"
            } alt="Shovel" className="shovel"/>

            <div onClick={() => console.log(1)} className="sandbox">
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