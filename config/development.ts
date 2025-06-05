// Development configuration
// For testing on physical devices, set this to your computer's IP address
// To find your IP address:
// - macOS/Linux: Run `ifconfig` and look for inet under en0 or similar
// - Windows: Run `ipconfig` and look for IPv4 Address
// - Or check your network settings

export const DEVELOPMENT_CONFIG = {
  // Set this to your computer's IP address when testing on physical devices
  // For Android emulator, we'll use the actual computer IP since 10.0.2.2 might not work reliably
  COMPUTER_IP: '192.168.31.107',
  
  // Backend port
  API_PORT: 5166,
  
  // Enable debug logging
  DEBUG_API: true,
};

// Helper function to get computer IP instructions
export const getIPInstructions = () => {
  return `
To test on a physical device, you need to set your computer's IP address.

1. Find your computer's IP address:
   - macOS/Linux: Run 'ifconfig' in terminal, look for inet under en0
   - Windows: Run 'ipconfig' in command prompt, look for IPv4 Address

2. Update COMPUTER_IP in config/development.ts with your IP address
   Example: COMPUTER_IP: '192.168.1.100'

3. Make sure your backend server is running and accessible on your network
  `;
};
