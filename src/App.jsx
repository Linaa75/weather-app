import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Header";
import WeatherDisplay from "./WeatherDisplay";
import Map from "./Map";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <Routes>
          <Route path="/weatherDisplay" element={<WeatherDisplay />} />
          <Route path="/map" element={<Map />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
