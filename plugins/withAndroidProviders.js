const { withAndroidManifest } = require('@expo/config-plugins');

const withAndroidProviders = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    if (!manifest.application || !manifest.application[0]) {
      return config;
    }

    const application = manifest.application[0];

    const packageName = config.android?.package || 'fr.mathieuxavier.haaze';

    if (application.provider) {
      application.provider.forEach((provider) => {
        const authorities = provider.$['android:authorities'];

        if (authorities && authorities.includes('com.anonymous.haaze')) {
          provider.$['android:authorities'] = authorities.replace(
            /com\.anonymous\.haaze/g,
            packageName
          );
          console.log(`✅ Updated provider authorities: ${provider.$['android:authorities']}`);
        }
      });
    }

    return config;
  });
};

module.exports = withAndroidProviders;
