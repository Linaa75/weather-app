import { Link } from "react-router-dom";

export default function Header() {
  return (
    <div className="fixed t-0 l-0 z-1000 bg-sky-700/50 p-7 w-full backdrop-blur-md">
      <ul className="flex justify-end gap-10 text-sky-950 text-lg font-semibold">
        <li className="hover:text-sky-800">
          <Link to="/WeatherDisplay">Weather</Link>
        </li>
        <li className="hover:text-sky-800">
          <Link to="/Map">Map</Link>
        </li>
      </ul>
    </div>
  );
}
