// "Riley Renter" → "RR", "Cher" → "C"; falls back to the email's first letter, then "?".
export function getInitials(name?: string | null, email?: string | null) {
  const words = name?.trim().split(/\s+/).filter(Boolean) ?? [];

  if (words.length > 0) {
    const first = Array.from(words[0])[0];
    const last = words.length > 1 ? Array.from(words[words.length - 1])[0] : "";
    return `${first}${last}`.toUpperCase();
  }

  const letter = email ? Array.from(email.trim())[0] : undefined;
  return letter ? letter.toUpperCase() : "?";
}
