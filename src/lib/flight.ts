/** two-letter flight code: initials, or the capitals of a one-word name (PipelineGuard → PG) */
export const flightCode = (s: string) => {
  const words = s.replace(/[^A-Za-z0-9 -]/g, "").split(/[\s-]+/).filter(Boolean);
  if (words.length > 1) return words.map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const caps = (words[0].match(/[A-Z]/g) || []).join("");
  return (caps.length >= 2 ? caps : words[0]).slice(0, 2).toUpperCase();
};
