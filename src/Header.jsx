import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/WeatherDisplay">Weather</Link>
        </li>
        <li>
          <Link to="/CitySelector">Map</Link>
        </li>
      </ul>
    </div>
  );
}
