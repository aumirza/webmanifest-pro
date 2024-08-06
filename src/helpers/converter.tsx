// Function to convert a Base64 string to a File object
export function base64ToFile(
  base64String: String,
  fileName: string,
  mimeType: string
) {
  // Split the Base64 string to remove the data URL prefix
  const base64Parts = base64String.split(",");
  const base64Data = base64Parts[1];

  // Decode the Base64 string to a byte array
  const byteCharacters = atob(base64Data);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Create a File object from the byte array
  const file = new File([byteArray], fileName, { type: mimeType });

  return file;
}

// Function to convert a Blob to a Base64 string
export function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve((reader.result as string).split(",")[1]); // Get the Base64 string
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

// Function to create a Blob from a Base64 string
export function base64ToBlob(
  base64: string,
  type = "application/octet-stream"
): Blob {
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);

  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }

  const byteArray = new Uint8Array(byteNumbers);
  return new Blob([byteArray], { type });
}
