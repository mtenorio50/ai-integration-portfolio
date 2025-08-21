import { useEffect, useMemo, useState } from "react";
import { getSuggestions, AppError } from "../lib/ai";
import { debounce } from "../lib/debounce";

export default function AutocompleteForm() {
  const [value, setValue] = useState("");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const debouncedFetch = useMemo(
    () =>
      debounce(async (q: string) => {
        try {
          setError(null);
          const { suggestions } = await getSuggestions(q);
          setSuggestions(suggestions);
        } catch (e) {
          const msg = e instanceof AppError ? e.message : "Unexpected error";
          setError(msg);
          setSuggestions([]);
        }
      }, 350),
    []
  );

  useEffect(() => {
    if (value.trim().length === 0) return setSuggestions([]);
    debouncedFetch(value);
  }, [value, debouncedFetch]);

  return (
    <div style={{ maxWidth: 640, margin: "2rem auto", fontFamily: "system-ui" }}>
      <h1>AI‑Powered Form Autocomplete</h1>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Describe your issue…"
        style={{ width: "100%", padding: 12, border: "1px solid #ccc", borderRadius: 8 }}
      />
      {error && (
        <p style={{ marginTop: 8, color: "#b45309" }}>⚠️ {error}</p>
      )}
      {suggestions.length > 0 && (
        <ul style={{ listStyle: "none", padding: 0, marginTop: 12 }}>
          {suggestions.map((s, i) => (
            <li key={i}>
              <button
                onClick={() => setValue(s)}
                style={{
                  width: "100%",
                  textAlign: "left",
                  padding: 10,
                  marginBottom: 6,
                  borderRadius: 8,
                  border: "1px solid #e5e7eb",
                  background: "#f9fafb",
                  cursor: "pointer"
                }}
              >
                {s}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}