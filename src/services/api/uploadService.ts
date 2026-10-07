import api from "@/services/api/apiClient";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  // Content-Type: undefined lets the browser set it WITH the boundary.
  // Any string value here breaks the multipart parse → 415.
  const res = await api.post<{ url: string }>("/Upload/Image", formData, {
    headers: { "Content-Type": undefined },
  });

  return res.data.url;
}
