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
          const date = new Date(item.dt_txt).toLocaleDateString("uk-en", {
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
        <p className="m-auto text-white">Loading ...</p>
      ) : isError ? (
        <p className="m-auto text-white">{isError}</p>
      ) : (
        <div className="flex-1 pt-15 pb-15">
          {isForecast.length > 0 && (
            <div className="flex flex-col w-full pl-2 gap-5">
              {isForecast.map((day, index) => (
                <div
                  key={index}
                  className="flex flex-row items-center justify-between bg-white shadow-md rounded-lg p-5 text-center"
                >
                  <h3 className="text-lg font-medium">{day.date}</h3>
                  <div>
                    <p>Min: {day.tempMin}°C</p>
                    <p>Max: {day.tempMax}°C</p>
                  </div>
                  <div className="flex justify-center">
                    <img
                      className="mx-auto block"
                      src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                    ></img>
                  </div>
                  <p>{day.description}</p>
                  <p>{day.wind}m/s</p>
                </div>
              ))}
            </div>
          )}

          {isForecast.length === 0 && (
            <p className="p-4 bg-gray-50 rounded-lg">Weather is unavailable</p>
          )}
        </div>
      )}
    </>
  );
}
