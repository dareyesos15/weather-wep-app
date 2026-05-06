"use client";

import { useEffect, useMemo, useState } from "react";
import { type WeatherHour } from "@/lib/weather";
import { WeatherIcon } from "./weather-icon";
import { ForecastMetric } from "./forecast-metric";
import { formatHour } from "./utils";

const INITIAL_VISIBLE_HOURS = 3;
const LOAD_STEP = 3;

export function HourlyForecast({
  title,
  subtitle,
  hours,
}: {
  title: string;
  subtitle: string;
  hours: WeatherHour[];
}) {
  const [visibleCount, setVisibleCount] = useState(INITIAL_VISIBLE_HOURS);

  useEffect(() => {
    setVisibleCount(INITIAL_VISIBLE_HOURS);
  }, [hours]);

  const visibleHours = useMemo(
    () => hours.slice(0, visibleCount),
    [hours, visibleCount],
  );
  const hasMore = visibleCount < hours.length;

  return (
    <section className="w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-slate-950/45 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-8">
      <div className="mb-6 flex flex-col gap-2">
        <h3 className="text-2xl font-semibold text-white">{title}</h3>
        <p className="text-sm text-slate-400">{subtitle}</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {visibleHours.map((hour) => (
          <div
            key={`${title}-${hour.datetimeEpoch}`}
            className="min-w-0 rounded-[1.25rem] border border-white/8 bg-white/4 p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <p className="text-xs tracking-[0.22em] text-slate-500 uppercase">
                  {formatHour(hour.datetime)}
                </p>
                <p className="mt-2 text-2xl font-semibold text-white">
                  {Math.round(hour.temp)}°
                </p>
              </div>
              <WeatherIcon icon={hour.icon} size="small" />
            </div>

            <p className="mt-4 text-sm text-slate-200">{hour.conditions}</p>

            <dl className="mt-4 grid gap-2 text-xs text-slate-400">
              <ForecastMetric label="Lluvia" value={`${Math.round(hour.precipprob)}%`} />
              <ForecastMetric label="Viento" value={`${Math.round(hour.windspeed)} km/h`} />
              <ForecastMetric label="Humedad" value={`${Math.round(hour.humidity)}%`} />
            </dl>
          </div>
        ))}
      </div>

      {hasMore && (
        <div className="mt-5 flex justify-center">
          <button
            type="button"
            onClick={() => setVisibleCount((count) => Math.min(count + LOAD_STEP, hours.length))}
            className="inline-flex h-11 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10"
          >
            Cargar 3 horas más
          </button>
        </div>
      )}
    </section>
  );
}
