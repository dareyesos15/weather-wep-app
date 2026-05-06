export function formatHour(value: string) {
  return value.slice(0, 5);
}

export function formatUpdatedAt(value: string) {
  return new Intl.DateTimeFormat("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "short",
  }).format(new Date(value));
}
