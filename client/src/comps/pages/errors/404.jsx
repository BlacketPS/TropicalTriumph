import Background from "../../../comps/global/Background";
import Sand from "../../../comps/global/Sand";

export default function NotFoundPage() {
    return (
        <>
            <Background/>
            <Sand/>

            <div style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center"
            }}>
            <img draggable={false} className="logo" src="/content/logo.png" alt="TropicalTriumpth Logo"/>

            <p style={{
                textAlign: "center",
                fontSize: "2.5vw",
                position: "relative",
                bottom: "1.25vw"
            }}>The page you were looking for was not found.</p>
            </div>
        </>
    )
}