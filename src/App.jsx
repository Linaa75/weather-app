import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import WeatherDisplay from "./WeatherDisplay";
import AirPolution from "./AirPolution";
import ThemeProvider from "./ThemeContext";

function App() {
  return (
    <>
      <BrowserRouter>
        <ThemeProvider>
          <div className="flex bg-sky-50 min-h-screen dark:bg-gray-800">
            <Header></Header>
            <Routes>
              <Route path="/" element={<WeatherDisplay />} />
              <Route path="/WeatherDisplay" element={<WeatherDisplay />} />
              <Route path="/AirPolution" element={<AirPolution />} />
            </Routes>
          </div>
        </ThemeProvider>
      </BrowserRouter>
    </>
  );
}

export default App;
