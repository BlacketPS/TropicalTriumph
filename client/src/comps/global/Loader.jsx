import { forwardRef } from 'react';

export default forwardRef((props, ref) => (
    <div style={{
        display: "none"
    }} ref={ref} className="modal">
        <div className="loader">
            <img style={{
                userSelect: "none"
            }} draggable={false} alt="Loading..." className="ball" src="/content/loading-ball.png"></img>
        </div>
    </div>
));