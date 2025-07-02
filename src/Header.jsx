import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="header">
      <ul className="header-menu">
        <li>
          <Link to="/WeatherDisplay">Weather</Link>
        </li>
        <li>
          <Link to="/Map">Map</Link>
        </li>
      </ul>
    </div>
  );
}
