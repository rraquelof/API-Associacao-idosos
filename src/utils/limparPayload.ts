export function limparPayload(obj: any) {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([_, value]) =>
        value !== "" &&
        value !== null &&
        value !== undefined
    )
  );
}
