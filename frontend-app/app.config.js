const os = require("os");
const appJson = require("./app.json");

function getLanIpAddress() {
  const interfaces = os.networkInterfaces();

  for (const networkInterface of Object.values(interfaces)) {
    for (const details of networkInterface || []) {
      if (
        details &&
        details.family === "IPv4" &&
        !details.internal &&
        !details.address.startsWith("169.254.")
      ) {
        return details.address;
      }
    }
  }

  return null;
}

module.exports = () => {
  const expoConfig = appJson.expo || {};
  const detectedLanIp = getLanIpAddress();
  const detectedApiBaseUrl = detectedLanIp
    ? `http://${detectedLanIp}:5000/api`
    : undefined;

  return {
    ...expoConfig,
    extra: {
      ...expoConfig.extra,
      apiBaseUrl:
        process.env.EXPO_PUBLIC_API_BASE_URL ||
        detectedApiBaseUrl ||
        expoConfig.extra?.apiBaseUrl,
    },
  };
};
