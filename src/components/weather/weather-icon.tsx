const iconMap: Record<string, string> = {
  "clear-day": "☀️",
  "clear-night": "🌙",
  "partly-cloudy-day": "⛅",
  "partly-cloudy-night": "☁️",
  "cloudy": "☁️",
  "rain": "🌧️",
  "snow": "❄️",
  "wind": "💨",
  "fog": "🌫️",
};

export function WeatherIcon({
  icon,
  size = "small",
}: {
  icon: string;
  size?: "small" | "large";
}) {
  const sizeClass = size === "large" ? "text-6xl" : "text-3xl";
  return <span className={sizeClass}>{iconMap[icon] || "🌤️"}</span>;
}
