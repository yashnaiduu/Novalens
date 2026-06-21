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
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

  try {
    const res = await fetch(`${API_BASE}/api/remove_background`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
      signal: controller.signal
    });
    
    if (!res.ok) {
      if (res.status === 413) {
        throw new Error("File is too large. Please upload an image under 15MB.");
      }
      try {
        const errorData = await res.json();
        throw new Error(errorData.error || "Server error occurred");
      } catch (e) {
        throw new Error(await res.text() || "Server error occurred");
      }
    }
    
    return (await res.json()) as RemoveBgResponse;
  } catch (error: any) {
    if (error.name === 'AbortError') {
      throw new Error("Request timed out. The backend might be busy or restarting.");
    }
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }
}