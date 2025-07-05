import { useState, useEffect } from "react";
import ThreeDayForecast from "./ThreeDayForecast";

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
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : isError ? (
        <p>{isError}</p>
      ) : (
        <div className="container">
          <h1>Check weather in your city!</h1>
          <input
            type="text"
            placeholder="Enter your city"
            value={isCity}
            onChange={(e) => setIsCity(e.target.value)}
          />
          {debouncedCity && (
            <div className="data">
              <div className="text-line">
                <p>Temperature</p>
                <p>Description</p>
                <p>Humidity</p>
                <p>Wind speed</p>
              </div>
              <div className="measurement-line">
                <p>{isTemperature}°C</p>
                <p>{isDescription}</p>
                <p>{isHumidity}%</p>
                <p>{isWind} m/s</p>
              </div>
            </div>
          )}
          <div>
            {debouncedCity && latitude !== null && longitude !== null && (
              <ThreeDayForecast
                lat={latitude}
                lon={longitude}
                apiKey={apiKey}
              />
            )}
          </div>
        </div>
      )}
    </>
  );
}
