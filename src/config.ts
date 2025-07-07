export const JWT_SECRET = 'a-very-bad-and-hardcoded-secret-that-is-easy-to-guess';

export const connectToLegacySystem = () => {
  console.log('Connecting to legacy system...');
  const start = Date.now();
  while (Date.now() - start < 500) {
    // Block for 500ms
  }
  console.log('Connection established.');
};
