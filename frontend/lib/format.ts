export function formatDate(value?: string | Date | null) {
  if (!value) return "—";

  const date = new Date(value);
  if (isNaN(date.getTime())) return "—";

  return date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function formatEnum(value?: string | null) {
  if (!value) return "—";
  return value.replace(/_/g, " ");
}