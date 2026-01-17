// export async function apiFetch(
//   endpoint: string,
//   options: RequestInit = {}
// ) {
//   const token = localStorage.getItem("accessToken");

//   const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
//     ...options,
//     headers: {
//       "Content-Type": "application/json",
//       ...(token ? { Authorization: `Bearer ${token}` } : {}),
//       ...(options.headers || {})
//     }
//   });

//   // ⚠️ Handle empty 401 body safely
//   const data = await res.json().catch(() => ({}));

//   if (!res.ok) {
//     throw new Error(data.message || "unauthorized");
//   }

//   return data;
// }



export async function apiFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const token = localStorage.getItem('accessToken');

  const isFormData = options.body instanceof FormData;

  // ✅ Explicitly typed
  const headers: Record<string, string> = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> | undefined)
  };

  // ❗ Only set JSON header if NOT FormData
  if (!isFormData) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      ...options,
      headers
    }
  );
  

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
}

export async function adminFetch(
  endpoint: string,
  options: RequestInit = {}
) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
