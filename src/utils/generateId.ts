export function generateAlumniId(existing: string[] = []): string {
  let max = 0;
  for (const id of existing) {
    const num = parseInt(id.replace("ALM-", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  }
  return `ALM-${String(max + 1).padStart(6, "0")}`;
}

export function generateEventId(existing: string[] = []): string {
  let max = 0;
  for (const id of existing) {
    const num = parseInt(id.replace("EVT-", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  }
  return `EVT-${String(max + 1).padStart(5, "0")}`;
}

export function generateNoticeId(existing: string[] = []): string {
  let max = 0;
  for (const id of existing) {
    const num = parseInt(id.replace("NTC-", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  }
  return `NTC-${String(max + 1).padStart(5, "0")}`;
}

export function generateRegistrationId(existing: string[] = []): string {
  let max = 0;
  for (const id of existing) {
    const num = parseInt(id.replace("REG-", ""), 10);
    if (!isNaN(num) && num > max) max = num;
  }
  return `REG-${String(max + 1).padStart(6, "0")}`;
}

export function generateUUID(): string {
  return `${Date.now().toString(36)}-${Math.random().toString(36).substring(2, 11)}`;
}
