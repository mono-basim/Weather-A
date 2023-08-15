import React, { useState } from "react";

function Home() {
  const [countryName, setCountryName] = useState("");
  const [weatherData, setWeatherData] = useState(null);
  const limit = 1;
  const apiKey = "your_api_key_here"; // Replace with your actual API key from OpenWeatherApi

  const fetchWeather = async () => {
    try {
      // Fetch data from the first API
      const countryResponse = await fetch(
        `https://restcountries.com/v2/name/${countryName}`
      );
      const countryData = await countryResponse.json();

      if (countryData.length === 0) {
        console.log("Country not found.");
        return;
      }

      // Extract city name, state code, and country code
      const cityName = countryData[0].capital || "";
      const stateCode = countryData[0].regionCodes?.iso2a || "";
      const countryCode = countryData[0].codes?.iso2 || "";

      // Construct URL for the second API
      const geoApiUrl = `http://api.openweathermap.org/geo/1.0/direct?q=${cityName},${stateCode},${countryCode}&limit=${limit}&appid=${apiKey}`;

      // Fetch data from the second API
      const geoResponse = await fetch(geoApiUrl);
      const geoData = await geoResponse.json();

      if (geoData.length === 0) {
        console.log("Location not found.");
        return;
      }

      // Extract latitude and longitude
      const lat = geoData[0].lat || "";
      const lon = geoData[0].lon || "";

      // Construct URL for the third API
      const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`;

      // Fetch weather data from the third API
      const weatherResponse = await fetch(weatherApiUrl);
      const weatherData = await weatherResponse.json();

      // Set the weather data in state
      setWeatherData(weatherData);
    } catch (error) {
      console.error("An error occurred:", error);
    }
  };

  return (
    <div>
      <h1>Weather App</h1>
      <input
        type="search"
        value={countryName}
        onChange={(e) => setCountryName(e.target.value)}
        placeholder="Enter a country name"
      />
      <button onClick={fetchWeather}>Get Weather</button>

      {/* Display weather data */}
      {weatherData && (
        <div>
          <p>Weather Data:</p>
          <pre>{JSON.stringify(weatherData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default Home;
