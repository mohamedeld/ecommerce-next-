// Function to generate a UUID (version 4)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0; // Generate a random hex digit
    const v = c === 'x' ? r : (r & 0x3 | 0x8); // Set the 3 most significant bits to 010
    return v.toString(16);
  });
}

export default generateUUID;