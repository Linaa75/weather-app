import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import WeatherDisplay from "./WeatherDisplay";
import Map from "./Map";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex bg-sky-50 min-h-screen">
          <Header></Header>
          <Routes>
            <Route path="/" element={<WeatherDisplay />} />
            <Route path="/WeatherDisplay" element={<WeatherDisplay />} />
            <Route path="/Map" element={<Map />} />
          </Routes>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
