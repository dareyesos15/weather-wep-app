import { type WeatherData } from "@/lib/weather";
import { InfoRow } from "./info-row";
import { formatUpdatedAt } from "./utils";

export function OverviewPanel({ data }: { data: WeatherData }) {
  return (
    <section className="w-full min-w-0 rounded-[1.75rem] border border-white/10 bg-slate-950/55 p-6 shadow-[0_24px_60px_rgba(2,6,23,0.35)] backdrop-blur sm:p-8">
      <div className="space-y-6">
        <div>
          <p className="text-sm font-medium tracking-[0.22em] text-sky-200 uppercase">
            Contexto rápido
          </p>
          <h3 className="mt-3 text-2xl font-semibold text-white">
            Un punto de partida listo para crecer
          </h3>
          <p className="mt-2 text-sm leading-6 text-slate-300">
            Usa esta base para añadir geolocalización, favoritos, métricas
            diarias o gráficos sin tener que rehacer la arquitectura.
          </p>
        </div>

        <div className="grid gap-3">
          <InfoRow
            label="Última lectura"
            value={formatUpdatedAt(data.fetchedAt)}
          />
          <InfoRow
            label="Horas históricas"
            value={`${data.previous24Hours.length} registros`}
          />
          <InfoRow
            label="Horas futuras"
            value={`${data.next24Hours.length} registros`}
          />
          <InfoRow label="Proveedor" value="Visual Crossing proxy" />
        </div>
      </div>
    </section>
  );
}
