/**
 * O texto da comunicação vem como HTML bruto de uma fonte externa (DJEN).
 * Nunca renderizamos isso como HTML (risco de XSS) — apenas texto puro, para prévia.
 */
export function stripHtml(html: string, maxLength = 400): string {
  const text = html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&aacute;/g, "á")
    .replace(/&eacute;/g, "é")
    .replace(/&iacute;/g, "í")
    .replace(/&oacute;/g, "ó")
    .replace(/&uacute;/g, "ú")
    .replace(/&atilde;/g, "ã")
    .replace(/&otilde;/g, "õ")
    .replace(/&ccedil;/g, "ç")
    .replace(/&Aacute;/g, "Á")
    .replace(/&Eacute;/g, "É")
    .replace(/&Iacute;/g, "Í")
    .replace(/&Oacute;/g, "Ó")
    .replace(/&Uacute;/g, "Ú")
    .replace(/&Atilde;/g, "Ã")
    .replace(/&Otilde;/g, "Õ")
    .replace(/&Ccedil;/g, "Ç")
    .replace(/&ordm;/g, "º")
    .replace(/&ordf;/g, "ª")
    .replace(/\s+/g, " ")
    .trim()

  return text.length > maxLength ? `${text.slice(0, maxLength)}…` : text
}
