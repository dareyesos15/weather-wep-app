import { NextRequest, NextResponse } from "next/server";

const API_KEY = process.env.VISUAL_CROSSING_API_KEY;
const BASE_URL =
  "https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline";

interface VisualCrossingHour {
  datetime: string;
  datetimeEpoch: number;
  temp: number;
  feelslike?: number;
  humidity?: number;
  windspeed?: number;
  precipprob?: number;
  conditions?: string;
  icon?: string;
}

interface VisualCrossingDay {
  hours?: VisualCrossingHour[];
}

interface VisualCrossingResponse {
  resolvedAddress: string;
  timezone: string;
  currentConditions: {
    datetime: string;
    datetimeEpoch?: number;
    temp?: number;
    feelslike?: number;
    humidity?: number;
    windspeed?: number;
    winddir?: number;
    pressure?: number;
    visibility?: number;
    cloudcover?: number;
    uvindex?: number;
    precipprob?: number;
    conditions?: string;
    icon?: string;
    sunrise?: string;
    sunset?: string;
  };
  days: VisualCrossingDay[];
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const location = searchParams.get("location")?.trim();

  if (!location) {
    return NextResponse.json(
      { message: "Debes indicar una ubicación." },
      { status: 400 }
    );
  }

  if (!API_KEY) {
    return NextResponse.json(
      { message: "Falta configurar VISUAL_CROSSING_API_KEY." },
      { status: 500 }
    );
  }

  try {
    const url =
      `${BASE_URL}/${encodeURIComponent(location)}/yesterday/tomorrow` +
      `?unitGroup=metric&include=current,hours&key=${API_KEY}&contentType=json`;

    const response = await fetch(url, {
      next: { revalidate: 300 },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Visual Crossing API error:", errorText);
      return NextResponse.json(
        { message: "No se pudo obtener el clima desde Visual Crossing." },
        { status: 502 }
      );
    }

    const data = (await response.json()) as VisualCrossingResponse;
    const currentEpoch =
      data.currentConditions.datetimeEpoch ?? Math.floor(Date.now() / 1000);

    const allHours = (data.days ?? [])
      .flatMap((day) => day.hours ?? [])
      .filter((hour): hour is VisualCrossingHour & { datetimeEpoch: number } =>
        typeof hour.datetimeEpoch === "number"
      )
      .sort((left, right) => left.datetimeEpoch - right.datetimeEpoch);

    const previous24Hours = allHours
      .filter((hour) => hour.datetimeEpoch < currentEpoch)
      .slice(-24)
      .map((hour) => ({
        datetime: hour.datetime,
        datetimeEpoch: hour.datetimeEpoch,
        temp: hour.temp ?? 0,
        feelslike: hour.feelslike ?? hour.temp ?? 0,
        humidity: hour.humidity ?? 0,
        windspeed: hour.windspeed ?? 0,
        precipprob: hour.precipprob ?? 0,
        conditions: hour.conditions ?? "Sin datos",
        icon: hour.icon ?? "partly-cloudy-day",
      }));

    const next24Hours = allHours
      .filter((hour) => hour.datetimeEpoch >= currentEpoch)
      .slice(0, 24)
      .map((hour) => ({
        datetime: hour.datetime,
        datetimeEpoch: hour.datetimeEpoch,
        temp: hour.temp ?? 0,
        feelslike: hour.feelslike ?? hour.temp ?? 0,
        humidity: hour.humidity ?? 0,
        windspeed: hour.windspeed ?? 0,
        precipprob: hour.precipprob ?? 0,
        conditions: hour.conditions ?? "Sin datos",
        icon: hour.icon ?? "partly-cloudy-day",
      }));

    const weatherData = {
      location: data.resolvedAddress,
      timezone: data.timezone,
      fetchedAt: new Date().toISOString(),
      current: {
        datetime: data.currentConditions.datetime,
        datetimeEpoch: currentEpoch,
        temp: data.currentConditions.temp ?? 0,
        feelslike: data.currentConditions.feelslike ?? 0,
        humidity: data.currentConditions.humidity ?? 0,
        windspeed: data.currentConditions.windspeed ?? 0,
        winddir: data.currentConditions.winddir ?? 0,
        pressure: data.currentConditions.pressure ?? 0,
        visibility: data.currentConditions.visibility ?? 0,
        cloudcover: data.currentConditions.cloudcover ?? 0,
        uvindex: data.currentConditions.uvindex ?? 0,
        precipprob: data.currentConditions.precipprob ?? 0,
        conditions: data.currentConditions.conditions ?? "Sin datos",
        icon: data.currentConditions.icon ?? "partly-cloudy-day",
        sunrise: data.currentConditions.sunrise ?? "--:--",
        sunset: data.currentConditions.sunset ?? "--:--",
      },
      previous24Hours,
      next24Hours,
    };

    return NextResponse.json(weatherData);
  } catch (error) {
    console.error("Weather API error:", error);
    return NextResponse.json(
      { message: "Ocurrió un error interno al consultar el clima." },
      { status: 500 }
    );
  }
}
