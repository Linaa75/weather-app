import { useState, useEffect } from "react";

export default function ThreeDayForecast({ lat, lon, apiKey }) {
  const [isForecast, setIsForecast] = useState([]);
  const [isError, setIsError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const threeDayForecast = async () => {
      try {
        const forecastResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const forecastData = await forecastResponse.json();

        if (!forecastResponse.ok) throw new Error("error");
        if (forecastData.list.length === 0)
          throw new Error("City not found. Please check the spelling.");

        const dailyForecast = [];
        const forecastSet = new Set();

        for (const item of forecastData.list) {
          const date = new Date(item.dt_txt).toLocaleDateString("uk-UK", {
            day: "numeric",
            month: "long",
          });

          if (!forecastSet.has(date)) {
            dailyForecast.push({
              date: date,
              temp: parseInt(item.main.temp),
              tempMin: parseInt(item.main.temp_min),
              tempMax: parseInt(item.main.temp_max),
              description: item.weather[0].description,
              icon: item.weather[0].icon,
              wind: parseInt(item.wind.speed),
            });
            forecastSet.add(date);

            if (dailyForecast.length === 3) {
              break;
            }
          }
        }

        setIsForecast(dailyForecast);
      } catch (error) {
        setIsError(error.message || "An unknown error occurred.");
      } finally {
        setIsLoading(false);
      }
    };
    threeDayForecast();
  }, [lat, lon, apiKey]);

  return (
    <>
      {isLoading ? (
        <p>Loading ...</p>
      ) : isError ? (
        <p>{isError}</p>
      ) : (
        <div>
          <h2 className="text-orange-950 text-center">3 Day Forecast</h2>
          <div className="flex flex-row justify-between w-full">
            {isForecast.length > 0 ? (
              isForecast.map((day, index) => (
                <div
                  key={index}
                  className="flex-1 bg-black shadow-md rounded-lg"
                >
                  <h3>{day.date}</h3>
                  <p>Min: {day.tempMin}°C</p>
                  <p>Max: {day.tempMax}°C</p>
                  <div>
                    <img
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    ></img>
                  </div>
                  <p>{day.description}</p>
                  <p>{day.wind}m/s</p>
                </div>
              ))
            ) : (
              <p>Weather is unavailable</p>
            )}
          </div>
        </div>
      )}
    </>
  );
}
