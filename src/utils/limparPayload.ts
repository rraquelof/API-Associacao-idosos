export function limparPayload(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      value === "" ? undefined : value,
    ])
  );
}
