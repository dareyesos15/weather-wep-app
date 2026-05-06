export interface WeatherHour {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  precipprob: number;
  conditions: string;
  icon: string;
}

export interface WeatherCurrent {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike: number;
  humidity: number;
  windspeed: number;
  winddir: number;
  pressure: number;
  visibility: number;
  cloudcover: number;
  uvindex: number;
  precipprob: number;
  conditions: string;
  icon: string;
  sunrise: string;
  sunset: string;
}

export interface WeatherData {
  location: string;
  timezone: string;
  fetchedAt: string;
  current: WeatherCurrent;
  previous24Hours: WeatherHour[];
  next24Hours: WeatherHour[];
}

export async function fetchWeather(location: string): Promise<WeatherData> {
  const response = await fetch(
    `/api/weather?location=${encodeURIComponent(location)}`,
    {
      method: "GET",
    }
  );

  if (!response.ok) {
    const error = await response
      .json()
      .catch(() => ({ message: "No se pudo consultar el clima." }));
    throw new Error(error.message || "Failed to fetch weather data");
  }

  return response.json();
}
