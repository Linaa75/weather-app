import { useState, useEffect } from "react";

/**
 * @param {number | null} lat
 * @param {number | null} lon
 * @param {string} apiKey
 * @param {number} days
 * @returns {{ isForecast: Array, isLoading: boolean, isError: string | null }}
 */

const useWeatherForecast = (lat, lon, apiKey, days) => {
  const [isForecast, setForecast] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isError, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      setIsLoading(true);
      setError(null);

      if (lat === null || lon === null || !apiKey) {
        setError("There is no valid coords");
        setIsLoading(false);
        setForecast([]);
        return;
      }

      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );

        if (!forecastResponse.ok) {
          throw new Error(
            `API Error: ${forecastResponse.status} - ${forecastResponse.statusText}`
          );
        }

        const forecastData = await forecastResponse.json();

        if (forecastData.cod !== "200") {
          throw new Error(forecastData.message || "An unknown error occurred.");
        }

        const dailyForecast = [];
        const forecastSet = new Set();

        for (const item of forecastData.list) {
          const date = new Date(item.dt * 1000).toLocaleDateString("en-UK", {
            day: "numeric",
            month: "long",
          });

          if (dailyForecast.length >= days) {
            break;
          }

          if (!forecastSet.has(date)) {
            dailyForecast.push({
              date: date,
              temp: parseInt(item.main.temp),
              tempMin: parseInt(item.main.temp_min),
              tempMax: parseInt(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              wind: parseFloat(item.wind.speed),
            });
            forecastSet.add(date);
          }
        }

        setForecast(dailyForecast);
      } catch (error) {
        setError(error.message);
        setForecast([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchForecast();
  }, [lat, lon, apiKey, days]);

  return { isForecast, isLoading, isError };
};

export default useWeatherForecast;
