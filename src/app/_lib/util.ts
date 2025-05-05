// export function objectFromFormData(formData: FormData) {
//   const result: { [key: string]: FormDataEntryValue | FormDataEntryValue[] } =
//     {};

//   for (const [key, value] of formData.entries()) {
//     if (key in result) {
//       // If the key already exists, ensure it's an array and add the new value
//       if (Array.isArray(result[key])) {
//         result[key].push(value);
//       } else {
//         result[key] = [result[key], value];
//       }
//     } else {
//       // If the key doesn't exist, add it directly
//       result[key] = value;
//     }
//   }

//   return result;
// }

// export function wait(ms: number) {
//   if (process.env.NODE_ENV === "production")
//     return console.log("Attemped Calling Wait");
//   return new Promise((resolve) => setTimeout(resolve, ms));
// }

export function objectMap<T, M>(
  obj: Record<string, T>,
  fn: (item: T, key: string, index: number) => M
) {
  return Object.fromEntries(
    Object.entries(obj).map(([k, v], i) => [k, fn(v, k, i)])
  );
}

export function urlBase64ToUint8Array(base64String: string) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export function isValidDateStr(str: string) {
  // @ts-ignore
  return new Date(str) !== "Invalid Date" && !isNaN(new Date(str));
}
