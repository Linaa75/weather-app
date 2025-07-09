import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import { IoIosSunny } from "react-icons/io";
import { FaMoon } from "react-icons/fa";

export default function Header() {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="fixed t-0 l-0 z-1000 bg-sky-700/50 p-7 w-full backdrop-blur-md dark:bg-gray-800">
      <ul className="flex justify-end gap-10 text-sky-950 text-lg font-semibold dark:text-white">
        <li className="hover:text-sky-800">
          <Link to="/WeatherDisplay">Weather</Link>
        </li>
        <li className="hover:text-sky-800">
          <Link to="/AirPolution">Air Polution</Link>
        </li>
        <button
          onClick={toggleTheme}
          className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600"
        >
          {theme === "light" ? <IoIosSunny /> : <FaMoon />}
        </button>
      </ul>
    </div>
  );
}
