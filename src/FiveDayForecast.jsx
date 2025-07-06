import useWeatherForecast from "./useWeatherForecast";

export default function FiveDayForecast({ lat, lon, apiKey }) {
  const { isForecast, isLoading, isError } = useWeatherForecast(
    lat,
    lon,
    apiKey,
    5
  );

  return (
    <>
      {isLoading ? (
        <p className="m-auto text-white">Loading ...</p>
      ) : isError ? (
        <p className="m-auto text-white">{isError}</p>
      ) : (
        <div className="flex-1">
          {isForecast.length > 0 ? (
            <div className="flex flex-col w-full gap-5 pt-5 pb-5">
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
          ) : (
            <p className="p-4 bg-gray-50 rounded-lg">Weather is unavailable</p>
          )}
        </div>
      )}
    </>
  );
}
