import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="navbar">
            <Link to="/">
                <img style={{
                    userSelect: "none"
                }} draggable={false} className="logo-small" alt="Palm Tree Logo" src="/content/logo-small.png"></img>
            </Link>
            <div className="navbar-right">
                <Link to="/stats" className="fas fa-chart-column navbar-icon"></Link>
                <Link to="/dig" className="fas fa-shovel navbar-icon"></Link>
                <Link to="/bazaar" className="fas fa-gavel navbar-icon"></Link>
                <Link to="/leaderboard" className="fas fa-trophy navbar-icon"></Link>
                <Link to="/rewards" className="fas fa-gift navbar-icon"></Link>
                <Link to="/logout" className="fas fa-right-from-bracket navbar-icon"></Link>
            </div>
        </div>
    )
}