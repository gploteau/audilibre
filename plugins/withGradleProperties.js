const { withGradleProperties } = require('@expo/config-plugins');

function withCustomGradleProperties(config) {
  return withGradleProperties(config, function (config) {
    const additionalGraddleProperties = [
      // SDK 52: https://github.com/expo/expo/issues/30725
      { type: 'property', key: 'android.enableJetifier', value: 'true' },
    ];

    additionalGraddleProperties.map(function (gradleProperty) {
      config.modResults.push(gradleProperty);
    });

    return config;
  });
}

module.exports = withCustomGradleProperties;
