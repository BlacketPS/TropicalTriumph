import "../../../styles/home.scss";
import { Link } from "react-router-dom";
import Background from "../../../comps/global/Background";
import Sand from "../../../comps/global/Sand";

function HomePage() {
    return (
        <>
            <Background/>
            <Sand/>

            <div style={{
                position: "relative",
                bottom: "0.5vw"
            }}>
            <img draggable={false} className="logo"src="/content/logo.png" alt="TropicalTriumpth Logo"/>

            <p style={{
                textAlign: "center",
                fontSize: "2.5vw",
                position: "relative",
                bottom: "1.25vw"
            }}>Discover. Collect. Sell. Triumph.</p>
                
            <Link to="/login" style={{
                    left: "36%",
                    position: "relative"
                }}>
                <div className="button">
                    <div>Play</div>
                </div>
            </Link>
            </div>

            <p className="creditsText">Created by Xotic and zastix</p>
        </>
    )
}

export default HomePage;