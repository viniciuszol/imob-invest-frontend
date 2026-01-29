// src/utils/jwt.js
export function parseJwt(token) {
  if (!token) return null;

  try {
    const base64 = token.split(".")[1];
    const json = atob(base64);
    return JSON.parse(json);
  } catch (err) {
    console.error("Erro ao parsear JWT:", err);
    return null;
  }
}
