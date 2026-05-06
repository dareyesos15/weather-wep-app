import { type WeatherData } from "@/lib/weather";
import { WeatherDetail } from "./weather-detail";
import { WeatherIcon } from "./weather-icon";

export function CurrentWeatherCard({ data }: { data: WeatherData }) {
  const current = data.current;

  return (
    <section className="w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-8">
      <div className="flex flex-col gap-8">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
          <div className="min-w-0 space-y-3">
            <p className="text-sm font-medium tracking-[0.22em] text-sky-200 uppercase">
              Resumen actual
            </p>
            <div>
              <h2 className="wrap-break-word text-2xl font-semibold text-white sm:text-3xl">
                {data.location}
              </h2>
              <p className="mt-1 wrap-break-word text-sm text-slate-300">{data.timezone}</p>
            </div>
            <div className="flex items-center gap-4">
              <WeatherIcon icon={current.icon} size="large" />
              <div className="min-w-0">
                <div className="text-5xl font-semibold leading-none text-white sm:text-6xl">
                  {Math.round(current.temp)}°
                </div>
                <p className="mt-2 text-lg text-slate-200">{current.conditions}</p>
                <p className="text-sm text-slate-400">
                  Sensación térmica de {Math.round(current.feelslike)}°
                </p>
              </div>
            </div>
          </div>

          <div className="grid min-w-0 gap-3 sm:grid-cols-2">
            <WeatherDetail label="Viento" value={`${Math.round(current.windspeed)} km/h`} />
            <WeatherDetail label="Lluvia" value={`${Math.round(current.precipprob)}%`} />
            <WeatherDetail label="Visibilidad" value={`${Math.round(current.visibility)} km`} />
            <WeatherDetail label="Humedad" value={`${Math.round(current.humidity)}%`} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-4">
          <WeatherDetail label="Presión" value={`${Math.round(current.pressure)} mb`} />
          <WeatherDetail label="Nubosidad" value={`${Math.round(current.cloudcover)}%`} />
          <WeatherDetail label="UV" value={`${Math.round(current.uvindex)}`} />
          <WeatherDetail label="Dirección" value={`${Math.round(current.winddir)}°`} />
        </div>

        <div className="grid gap-3 border-t border-white/10 pt-5 text-sm text-slate-300 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <span className="text-slate-400">Salida del sol</span>
            <p className="mt-1 text-base font-medium text-white">{current.sunrise}</p>
          </div>
          <div className="rounded-2xl border border-white/8 bg-white/5 px-4 py-3">
            <span className="text-slate-400">Puesta del sol</span>
            <p className="mt-1 text-base font-medium text-white">{current.sunset}</p>
          </div>
        </div>
      </div>
    </section>
  );
}
