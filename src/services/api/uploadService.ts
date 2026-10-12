import api from "@/services/api/apiClient";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);
  const res = await api.post<{ url: string }>("/Upload/Image", formData, {
    headers: { "Content-Type": undefined },
  });

  return res.data.url;
}
