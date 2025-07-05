import { useState, useEffect } from "react";
import ThreeDayForecast from "./ThreeDayForecast";
import { FaArrowRight, FaArrowLeft } from "react-icons/fa6";

export default function WeatherDisplay() {
  const [isTemperature, setIsTemperature] = useState("");
  const [isDescription, setIsDescription] = useState("");
  const [isHumidity, setIsHumidity] = useState("");
  const [isWind, setIsWind] = useState("");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCity, setIsCity] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const toggleForecast = () => {
    setIsOpen(!isOpen);
  };

  const apiKey = import.meta.env.VITE_API_KEY;
  const DEBOUNCE_DELAY = 1000;

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedCity(isCity);
    }, DEBOUNCE_DELAY);

    return () => {
      clearTimeout(handler);
    };
  }, [isCity, DEBOUNCE_DELAY]);

  useEffect(() => {
    if (!debouncedCity) {
      setLatitude(null);
      setLongitude(null);
      setIsLoading(false);
      setIsError("");
      return;
    }

    const weather = async () => {
      setIsLoading(true);
      setIsError("");
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedCity}&limit=1&appid=${apiKey}`
        );
        if (!geoResponse.ok) throw new Error(`Error! ${geoResponse.status}`);

        const geoData = await geoResponse.json();
        const { lat, lon } = geoData[0];
        setLatitude(lat);
        setLongitude(lon);

        if (geoData.length === 0)
          throw new Error("City not found. Please check the spelling.");
      } catch (error) {
        setLatitude(null);
        setLongitude(null);
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    weather();
  }, [debouncedCity, apiKey]);

  useEffect(() => {
    if (latitude === null || longitude === null) {
      return;
    }
    const fetchWeatherData = async () => {
      setIsLoading(true);
      setIsError("");
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
        );

        if (!weatherResponse.ok)
          throw new Error(`Error! ${weatherResponse.status}`);
        const weatherData = await weatherResponse.json();

        setIsTemperature(parseInt(weatherData.main.temp));
        setIsDescription(weatherData.weather[0].description);
        setIsHumidity(parseInt(weatherData.main.humidity));
        setIsWind(parseInt(weatherData.wind.speed));
      } catch (error) {
        setLatitude(null);
        setLongitude(null);
        setIsError(error.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchWeatherData();
  }, [latitude, longitude, apiKey]);

  return (
    <div className="flex justify-center items-center pr-10 pl-10 m-40 bg-sky-700 border rounded-2xl w-full">
      {isLoading ? (
        <p className="m-auto text-white">Loading ...</p>
      ) : isError ? (
        <p className="m-auto text-white">{isError}</p>
      ) : (
        <div className="flex flex-row items-center w-full gap-7">
          <div className="flex-1 flex flex-col items-center p-7 justify-between">
            <h1 className="text-5xl text-yellow-300 pt-10 pb-5 font-medium">
              Check weather in your city!
            </h1>
            <input
              className="border-2 border-yellow-300 rounded-xl p-1 pl-3 w-full text-yellow-300 text-lg outline-transparent"
              type="text"
              placeholder="Enter your city"
              value={isCity}
              onChange={(e) => setIsCity(e.target.value)}
            />
            {debouncedCity && (
              <div className="flex pt-10 pb-10 flex-row justify-between text-lg text-sky-50 w-full">
                <div className="flex flex-col">
                  <p>Temperature</p>
                  <p>Description</p>
                  <p>Humidity</p>
                  <p>Wind speed</p>
                </div>
                <div className="flex flex-col items-end">
                  <p>{isTemperature}°C</p>
                  <p>{isDescription}</p>
                  <p>{isHumidity}%</p>
                  <p>{isWind} m/s</p>
                </div>
              </div>
            )}
            {debouncedCity && latitude !== null && longitude !== null && (
              <button
                className="text-center cursor-pointer p-3 mb-10 bg-gray-100 rounded-lg flex items-center"
                onClick={toggleForecast}
              >
                3 Day Forecast
                <span className="ml-2 inline-block transition-transform duration-300 transform">
                  {isOpen ? <FaArrowLeft /> : <FaArrowRight />}
                </span>
              </button>
            )}
          </div>

          {isOpen &&
            debouncedCity &&
            latitude !== null &&
            longitude !== null && (
              <ThreeDayForecast
                lat={latitude}
                lon={longitude}
                apiKey={apiKey}
              />
            )}
        </div>
      )}
    </div>
  );
}
