# Origin New Tab

> A Chrome new tab extension

This is a very customizable Chrome browser extension, powered by VueJS, that replaces the default new tab page and startpage.

Current master branch version be downloaded from the Chrome Web Store [here](https://chrome.google.com/webstore/detail/origin-new-tab/ekofjmkgffocdaobhcnmlbifekempoho). Please note that this is an unlisted preview version, as currently the backend does not yet support a large amount of users due to API limits.

## Key Features

- Customizable dashboard (including several presets)
- Multiple widgets to add to dashboard, including:
  - Inspirational or movie quotes
  - Weather and weather forecast
  - News
  - Quick links to most visited websites
  - A friendly greeting and a clock
- Every widget can also be further customized
- Beautiful background photos
- Available in multiple languages: Dutch & English
- Localization and internationalization
- Loads quickly each time a new tab is opened

## Built with

- VueJS
- VueCLI / Webpack
- Vuex
- Algolia Search for custom weather location

Additionally, the backend for the extension, not included in this project, uses:

- Node
- Express
- DarkSky as weather provider
- NewsAPI

## To-Do

- More widgets such as a calendar & birthday reminders, to-do lists, notes, timers and countdowns.
- More user-friendly dashboard customization.
- Additional options for the background photos, including local uploads.
- Possibly user registration, to help with keeping API limits under control and allowing for easier data caching.
- More options for the QuickLinks widget: add own links, hide specific websites, etc.
- Server available on GitHub.

## Backend

When running locally, the application will try to connect to a local server. When it has been built however, it will try to reach the server also used by the extension available on the Chrome Web Store. It is possible that the server used by the extension can not be reached.

The server has not been included in this project and is not yet available on GitHub (but will be). If you need help running this yourself, let me know.

## License

This project is licensed under the MIT license - see the [LICENSE](https://github.com/Thilerion/origin-new-tab/blob/master/LICENSE) file for details.