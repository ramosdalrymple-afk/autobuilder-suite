export default {
  config: {
    // Rename the Dashboard
    translations: {
      en: {
        "app.components.LeftMenu.navbrand.title": "AutoBuilder",
        "app.components.LeftMenu.navbrand.workplace": "Dealer Console",
        "Auth.form.welcome.title": "Welcome to AutoBuilder",
      },
    },
    // Change the Colors (Blue Theme)
    theme: {
      colors: {
        primary100: '#dcebff',
        primary600: '#1a73e8',
        primary700: '#1557b0',
        buttonPrimary600: '#1a73e8',
        buttonPrimary500: '#1a73e8',
      },
    },
    // Hide Tutorials
    tutorials: false,
    notifications: { releases: false },
  },
  bootstrap(app) {
    console.log(app);
  },
};