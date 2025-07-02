import { useState, useEffect } from "react";

export default function WeatherDisplay() {
  const [isTemperature, setIsTemperature] = useState("");
  const [isDescription, setIsDescription] = useState("");
  const [isHumidity, setIsHumidity] = useState("");
  const [isWind, setIsWind] = useState("");
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isCity, setIsCity] = useState("");
  const [debouncedCity, setDebouncedCity] = useState("");

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
      setIsLoading(false);
      return;
    }
    const weather = async () => {
      try {
        const geoResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedCity}&limit=1&appid=${apiKey}`
        );
        if (!geoResponse.ok) throw new Error(`Error! ${geoResponse.status}`);

        const geoData = await geoResponse.json();
        if (geoData.length === 0)
          throw new Error("City not found. Please check the spelling.");

        const { lat, lon } = geoData[0];

        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        if (!weatherResponse.ok)
          throw new Error(`Error! ${weatherResponse.status}`);
        const weatherData = await weatherResponse.json();

        setIsTemperature(parseInt(weatherData.main.temp));
        setIsDescription(weatherData.weather[0].description);
        setIsHumidity(parseInt(weatherData.main.humidity));
        setIsWind(parseInt(weatherData.wind.speed));
      } catch (error) {
        setIsError({ error });
      } finally {
        setIsLoading(false);
      }
    };
    weather();
  }, [debouncedCity, apiKey]);

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
        </div>
      )}
    </>
  );
}
