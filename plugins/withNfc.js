const { withAndroidManifest } = require('@expo/config-plugins');

const withNfc = (config) => {
  return withAndroidManifest(config, async (config) => {
    const androidManifest = config.modResults;
    const { manifest } = androidManifest;

    // Ajouter les permissions NFC
    if (!manifest['uses-permission']) {
      manifest['uses-permission'] = [];
    }

    const permissions = manifest['uses-permission'];
    
    // Vérifier si les permissions NFC existent déjà
    const hasNfcPermission = permissions.some(
      (perm) => perm.$['android:name'] === 'android.permission.NFC'
    );
    
    if (!hasNfcPermission) {
      permissions.push({
        $: { 'android:name': 'android.permission.NFC' },
      });
    }

    // Ajouter les features NFC
    if (!manifest['uses-feature']) {
      manifest['uses-feature'] = [];
    }

    const features = manifest['uses-feature'];
    
    const hasNfcFeature = features.some(
      (feat) => feat.$['android:name'] === 'android.hardware.nfc'
    );
    
    if (!hasNfcFeature) {
      features.push({
        $: { 'android:name': 'android.hardware.nfc', 'android:required': 'false' },
      });
    }

    return config;
  });
};

module.exports = withNfc;
