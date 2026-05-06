"use client";

import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchWeather } from "@/lib/weather";
import { CurrentWeatherCard } from "./weather/current-weather-card";
import { OverviewPanel } from "./weather/overview-panel";
import { HourlyForecast } from "./weather/hourly-forecast";
import { StatChip } from "./weather/stat-chip";
import { RefreshIcon } from "./weather/refresh-icon";
import { formatUpdatedAt } from "./weather/utils";

const DEFAULT_LOCATION = process.env.NEXT_PUBLIC_DEFAULT_LOCATION || "Manizales,CO";

export function WeatherDashboard() {
  const [location, setLocation] = useState(DEFAULT_LOCATION);
  const [inputValue, setInputValue] = useState(DEFAULT_LOCATION);
  const [forecastView, setForecastView] = useState<"previous" | "next">("previous");

  const { data, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["weather", location],
    queryFn: () => fetchWeather(location),
    enabled: !!location,
  });

  const statusLabel = useMemo(() => {
    if (isRefetching) {
      return "Actualizando...";
    }

    if (isLoading) {
      return "Consultando clima...";
    }

    return data ? `Actualizado ${formatUpdatedAt(data.fetchedAt)}` : "Listo";
  }, [data, isLoading, isRefetching]);

  const handleSearch = (formData: FormData) => {
    const value = (formData.get("location") as string)?.trim();
    if (value) {
      setLocation(value);
    }
  };

  const handleRefresh = () => {
    refetch();
  };

  return (
    <main className="min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <section className="overflow-hidden rounded-4xl border border-white/10 bg-slate-950/55 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.55)] backdrop-blur xl:p-8">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between lg:gap-8">
            <div className="max-w-2xl space-y-4">
              <span className="inline-flex w-fit items-center rounded-full border border-sky-400/20 bg-sky-400/10 px-3 py-1 text-xs font-medium tracking-[0.24em] text-sky-200 uppercase">
                Buscador climático
              </span>
              <div className="space-y-3">
                <h1 className="text-2xl font-semibold tracking-tight text-white sm:text-4xl lg:text-5xl">
                  Consulta el clima actual del lugar que quieras.
                </h1>
                <p className="max-w-xl text-sm leading-6 text-slate-300 sm:text-base">
                  Ingresa cualquier ubicación para obtener un reporte detallado del clima, con datos actualizados al momento y un análisis de las últimas horas y las próximas tendencias. Ideal para planificar tu día o simplemente satisfacer tu curiosidad meteorológica.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              <StatChip label="Ubicación" value={location} />
              <StatChip
                label="Estado"
                value={statusLabel}
                tone={isLoading || isRefetching ? "accent" : "default"}
              />
              <StatChip
                label="Fuente"
                value="Visual Crossing"
                tone="accent"
              />
            </div>
          </div>

          <form
            action={handleSearch}
            className="mt-5 grid gap-3 rounded-3xl border border-white/10 bg-white/5 p-3 sm:mt-8 sm:grid-cols-[1fr_auto_auto]"
          >
            <input
              type="text"
              name="location"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Busca una ciudad, región o país"
              className="h-12 rounded-2xl border border-white/10 bg-slate-950/40 px-4 text-sm text-white outline-none ring-0 placeholder:text-slate-500 focus:border-sky-300/40"
            />
            <button
              type="submit"
              disabled={isLoading || isRefetching}
              className="inline-flex h-12 w-full items-center justify-center rounded-2xl bg-sky-400 px-5 text-sm font-medium text-slate-950 transition hover:bg-sky-300 disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-300 sm:w-auto"
            >
              Buscar
            </button>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={isLoading || isRefetching}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-white transition hover:bg-white/10 disabled:cursor-not-allowed disabled:border-white/5 disabled:bg-white/5 disabled:text-slate-500 sm:w-auto"
              title="Actualizar clima"
            >
              <RefreshIcon className={isRefetching ? "animate-spin" : ""} />
              Refrescar
            </button>
          </form>
        </section>

        {(isLoading || isRefetching) && (
          <section className="rounded-[1.75rem] border border-sky-300/15 bg-slate-950/50 p-8 text-center shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-10">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-2 border-sky-300/20 border-t-sky-300" />
            <p className="mt-4 text-sm text-slate-300">
              Estamos consultando el último reporte meteorológico.
            </p>
          </section>
        )}

        {error && !isLoading && (
          <section className="rounded-[1.75rem] border border-rose-400/20 bg-rose-950/20 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.35)]">
            <p className="text-sm font-medium text-rose-200">
              {error instanceof Error
                ? error.message
                : "No se pudo cargar la información del clima."}
            </p>
          </section>
        )}

        {data && !isLoading && (
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(18rem,0.75fr)]">
            <CurrentWeatherCard data={data} />
            <OverviewPanel data={data} />
            <section className="space-y-3 xl:col-span-2">
              <div
                className={`flex ${forecastView === "previous" ? "justify-end" : "justify-start"}`}
              >
                {forecastView === "previous" ? (
                  <button
                    type="button"
                    onClick={() => setForecastView("next")}
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
                    aria-label="Ver próximas 24 horas"
                  >
                    Próximas 24 horas
                    <span aria-hidden>→</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => setForecastView("previous")}
                    className="inline-flex h-11 items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 text-sm font-medium text-white transition hover:bg-white/10"
                    aria-label="Ver últimas 24 horas"
                  >
                    <span aria-hidden>←</span>
                    Últimas 24 horas
                  </button>
                )}
              </div>

              <HourlyForecast
                title={forecastView === "previous" ? "Últimas 24 horas" : "Próximas 24 horas"}
                subtitle={
                  forecastView === "previous"
                    ? "Así se ha comportado el tiempo recientemente."
                    : "Una lectura rápida de lo que viene."
                }
                hours={forecastView === "previous" ? data.previous24Hours : data.next24Hours}
              />
            </section>
          </div>
        )}
      </div>
    </main>
  );
}
