const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");
const { wrapWithReanimatedMetroConfig } = require("react-native-reanimated/metro-config");

let config = getDefaultConfig(__dirname);

// Appliquer NativeWind
config = withNativeWind(config, { input: "./app/global.css" });

// Appliquer Reanimated
config = wrapWithReanimatedMetroConfig(config);

// Export final
module.exports = config;
