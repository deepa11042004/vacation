/** Upload or remove a client's profile photo. Pass the bearer token of whoever is logged in (admin or member). */
export async function uploadClientPhoto(clientId: number, file: File, token: string | null): Promise<string> {
  const fd = new FormData();
  fd.append("file", file);
  const res = await fetch(`/api/clients/${clientId}/photo`, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
    body: fd,
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(json?.message ?? "Photo upload failed.");
  return json.data.profile_photo as string;
}

export async function deleteClientPhoto(clientId: number, token: string | null): Promise<void> {
  const res = await fetch(`/api/clients/${clientId}/photo`, {
    method: "DELETE",
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });
  const json = await res.json().catch(() => null);
  if (!res.ok || json?.success === false) throw new Error(json?.message ?? "Could not remove photo.");
}
