module.exports = {
  packagerConfig: {
    asar: true,
  },
  rebuildConfig: {},
  makers: [
    {
      name: '@electron-forge/maker-squirrel',
      config: {}, // Builds executable installers for Windows
    },
    {
      name: '@electron-forge/maker-zip',
      platforms: ['darwin'], // Builds standard zip files for macOS
    },
    {
      name: '@electron-forge/maker-deb',
      config: {}, // Builds native installers for Ubuntu/Debian Linux
    }
    // 🚀 We removed @electron-forge/maker-rpm from here so your local Linux build won't crash!
  ],
};