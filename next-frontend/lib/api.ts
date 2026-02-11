export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "";

export type OutputFormat = "PNG" | "JPG" | "JPEG" | "WEBP";

export interface RemoveBgRequest {
  image: string;
  format?: OutputFormat;
  model?: string;
  alpha_matting?: boolean;
  alpha_matting_foreground_threshold?: number;
  alpha_matting_background_threshold?: number;
  alpha_matting_erode_structure_size?: number;
  alpha_matting_base_size?: number;
}

export interface RemoveBgResponse {
  success?: boolean;
  image?: string;
  error?: string;
  format?: string;
  engine?: string;
}

export async function postRemoveBackground(payload: RemoveBgRequest): Promise<RemoveBgResponse> {
  const res = await fetch(`${API_BASE}/api/remove_background`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return (await res.json()) as RemoveBgResponse;
}