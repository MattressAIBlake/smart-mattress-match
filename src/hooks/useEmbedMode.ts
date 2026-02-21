import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

export function useEmbedMode() {
  const [searchParams] = useSearchParams();
  const isEmbed = useMemo(() => searchParams.get("embed") === "true", [searchParams]);
  return isEmbed;
}
