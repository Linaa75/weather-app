import { useCallback, useEffect, useState } from "react";

export default function AirPolution({ lat, lon }) {
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setError] = useState(null);
  const [airPollutionData, setAirPollutionData] = useState(null);

  const [isCity, setIsCity] = useState("");
  const [cityCoords, setCityCoords] = useState(null);
  const [shouldFetch, setShouldFetch] = useState(false);

  const apiKey = import.meta.env.VITE_API_KEY;
  const end = Math.floor(Date.now() / 1000);
  const start = end - 60 * 60;

  const fetchCityCoordinates = useCallback(async () => {
    if (!isCity || !apiKey) {
      setCityCoords(null);
      return;
    }

    setIsLoading(true);
    setError(null);
    setAirPollutionData(null);

    try {
      const geoResponse = await fetch(
        `https://api.openweathermap.org/geo/1.0/direct?q=${isCity}&limit=1&appid=${apiKey}`
      );

      if (!geoResponse.ok) {
        const errorText = await geoResponse.text();
        throw new Error(
          `Error: ${geoResponse.status} - ${geoResponse.statusText}`
        );
      }

      const geoData = await geoResponse.json();

      if (geoData && geoData.length > 0) {
        setCityCoords({ lat: geoData[0].lat, lon: geoData[0].lon });
        setError(null);
      } else {
        setCityCoords(null);
        setError(`City "${isCity}" didn't find. Try again`);
      }
    } catch (error) {
      setError(error.message);
    } finally {
    }
  }, [isCity, apiKey]);

  const fetchAirPollutionData = useCallback(async () => {
    const currentLat = cityCoords?.lat || lat;
    const currentLon = cityCoords?.lon || lon;

    if (!currentLat || !currentLon || !apiKey) {
      setAirPollutionData(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const polutionResponse = await fetch(
        `https://api.openweathermap.org/data/2.5/air_pollution/history?lat=${currentLat}&lon=${currentLon}&start=${start}&end=${end}&appid=${apiKey}`
      );

      if (!polutionResponse.ok) {
        const errorText = await polutionResponse.text();
        throw new Error(
          `Помилка API: ${putionResponse.status} - ${polutionResponse.statusText}. Деталі: ${errorText}`
        );
      }
      const polutionData = await polutionResponse.json();

      if (polutionData && polutionData.list && polutionData.list.length > 0) {
        setAirPollutionData(polutionData.list[0]);
        setError(null);
      } else {
        setAirPollutionData(null);
        setError("Дані про забруднення повітря недоступні для цього місця.");
      }
    } catch (error) {
      console.error("Помилка отримання даних про забруднення повітря:", error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }, [cityCoords, lat, lon, apiKey, start, end]);

  useEffect(() => {
    if (!shouldFetch) {
      return;
    }

    if (isCity) {
      fetchCityCoordinates();
    } else if (lat !== null && lon !== null) {
      setCityCoords({ lat, lon });
    } else {
      setAirPollutionData(null);
      setCityCoords(null);
      setIsLoading(false);
    }

    setShouldFetch(false);
  }, [shouldFetch, isCity, lat, lon, fetchCityCoordinates]);

  useEffect(() => {
    if (cityCoords) {
      fetchAirPollutionData();
    }
  }, [cityCoords, fetchAirPollutionData]);

  const handleSearch = () => {
    setShouldFetch(true);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="flex justify-center items-center pr-10 pl-10 m-40 bg-sky-700 border rounded-2xl w-full">
      <div className="flex flex-col p-5 items-center w-full gap-7">
        <h1 className="text-5xl text-yellow-300 pt-10 pb-5 font-medium">
          Check air pollution in your city!
        </h1>
        <input
          className="border-2 border-yellow-300 rounded-xl p-1 pl-3 w-full text-yellow-300 text-lg outline-transparent"
          type="text"
          placeholder="Enter your city"
          value={isCity}
          onChange={(e) => setIsCity(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={handleSearch}
          className="text-center cursor-pointer p-3 bg-gray-100 rounded-lg flex items-center"
        >
          Watch air pollution
        </button>

        {isLoading ? (
          <p className="m-auto text-white mt-4">Loading ...</p>
        ) : isError ? (
          <p className="m-auto text-red-400 mt-4">{isError}</p>
        ) : (
          <div className="mt-4">
            {airPollutionData && (
              <p className="text-white">
                AQI: {new Date(airPollutionData.dt * 1000).toLocaleString()} :{" "}
                {airPollutionData.main.aqi}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
