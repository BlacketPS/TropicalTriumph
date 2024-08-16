export default function Sand() {
    
    return (
        <>
            <div style={{
                left: 0,
                transform: "translateX(-20vw)"
            }} className="sand"></div>
            <div style={{
                right: 0,
                transform: "scaleX(-1) translateX(-20vw)"
            }} className="sand"></div>
        </>
    )
}