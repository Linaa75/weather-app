// import CitySelector from "./CitySelector";
import { BrowserRouter } from "react-router-dom";
import Header from "./Header";
import WeatherDisplay from "./WeatherDisplay";

function App() {
  return (
    <>
      <BrowserRouter>
        <Header></Header>
        <WeatherDisplay></WeatherDisplay>
        {/* <CitySelector></CitySelector> */}
      </BrowserRouter>
    </>
  );
}

export default App;
