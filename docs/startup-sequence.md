# App Startup

On startup, first the user settings should be parsed and loaded. This 'userSettings' object is then read by the store (or a store plugin), and persistence should be enabled for the settings.

Afterwards, for each active widget, a separate store module should be created containing the data for that store. Meanwhile, the main App loads the Base Components, as well as the widgets listed in the store as active, along with their locations on the Grid.

*Perhaps the widget module instance should have a getter to the settings specific to that widget.*

Upon creating the store module, persistence should be enabled for that module. This may be done from the plugin/function that created the module.

When the widget module is created, registered and if necessary, data from an API or otherwise is loaded, the Widget-component can be rendered.

## General & Widget settings

1. Load from LocalStorage
   - General Settings
   - Widget-specific settings (for each widgetType)
   - UI settings
     - Active widgets
     - Location of widgets
     - Additional settings specific to widget instance
2. Load from internal configuration files
   - Defaults: General settings
   - Defaults: Widget-specific settings (for each widgetType)
3. Create new 'Settings' object (`instanceof Settings`)
4. Load General settings & Default General settings into Settings object
   - Create new 'GeneralSettings' object (`instanceof SettingsGeneral`)
   - Each property in General settings gets validated
   - Each missing property in General Settings, as compared to the defaults, gets merged
5. Load Widget-specific settings into 'Settings' object
   - For each widget listed in 'WidgetTypes':
     - Create new [WidgetName]Settings object (`instanceof Settings[widgetName]`)
     - If Widget-settings from localStorage: validate each property
     - If Widget-settings from localStorage misses property: merge from defaults
     - If no Widget-settings from localStorage: use defaults

By now, the 'Settings' object has the following structure:

```js
/* instanceof Settings */
const userSettings = {

  /* instanceof SettingsGeneral */
  general: {
    username: "My name",
    language: "nl",
    timeFormat: "HH:mm"
    //...
  },

  widgets: {
    /* each value in widgets: instanceof Settings[widgetName] */
    [NEWS]: {
      type: NEWS,
      newsProviders: ['https://www.nu.nl', 'nrc.nl', /*...*/]
    },

    [QUOTE]: {
      type: QUOTE,
      category: 'motivinspirational'
    },

    [CALENDAR]: {} // Empty object if widget has no settings
    //...
  }
}
```

## UI Settings

1. The **UI settings array** from localStorage, retrieved in step (1) in the previous section, is evaluated.
2. If UI Settings is empty, a specific base LayoutTemplate is used.
3. Filter the UI Settings array for incorrect [widgetName] properties. If the list is now empty, use a specific base LayoutTemplate.
4. For each remaining item in UI Settings array:
   1. Create new GridItem object (`instanceof GridItem`)
   2. Load the previously create [WidgetName]Settings object (`instanceof Settings[widgetName]`) in the GridItem object to retrieve widget-specific options such as minHeight, minWidth, etc.
   3. Load the current UI Settings-item into the GridItem object, validating each property.
      - Validation includes, among others, checks for minHeight, minWidth, maxHeight, maxWidth. Possibly the widget may only be shown on a specific side, or with a specific horizontal/vertical alignment.
      - If a property is missing, or has an incorrect value, use the default (unless a better fallback is available. Such as when height is too large, reset the height to the maxHeight value).
   4. Add the GridItem object to a new grid array.

The 'Settings' object will now look like this:

```js
const userSettings = {

  general: {
    //...
  },

  widgets: {
    [NEWS]: {
      //...
    },
    //...
  },

  grid: [
    /* each value in grid: instanceof GridItem */
    {
      type: CLOCK,
      x: 1,
      width: 6,
      y: 5,
      height: 10,
      alignment: {
        x: LEFT,
        y: TOP
      },
      fontSize: '100%',
      // also includes widget-instance specific settings
      // if same as widget-global setting: null
      timeFormat: 'hh:mm a',
      //...
    },
    {
      type: NEWS,
      x: 1,
      y: 1
      width: 40,
      height: 3,
      alignment: {
        x: CENTER,
        y: CENTER
      },
      fontSize: null,
      //...
    },
    //...
  ]
}
```