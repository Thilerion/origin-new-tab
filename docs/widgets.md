# Widgets

|         | **Name**               | **Dynamic** | **API** | **Expires** | **Resize/drag** | **Notes**                                                                                                                          |
| ------- | ---------------------- | ----------- | ------- | ----------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| &#9745; | Clock                  | Yes         | No      | -           | Yes             |
| &#9745; | Welcome/Hello          | Yes         | No      | -           | Yes             | Part of clock, or nested under clock                                                                                               |
| &#9745; | Weather                | Yes         | Yes     | Yes (3h)    | Yes             | Has WeatherExpanded nested component (absolute)                                                                                    |
| &#9745; | WallpaperDetails       | Yes         | Yes     | Yes (1w?)   | Yes             | Required as part of UnsplashWallpaper setting/widget. Maybe UnsplasWallpaper should also be a widget?                              |
| &#9745; | News                   | Yes         | Yes     | Yes (1.5h)  | Yes             |
| &#9745; | Quote                  | Partly*     | Yes     | Yes**       | Yes             | \*Once quote loaded, static String. <br>\*\*Once loaded, does not expire. User can setup how often a new quote is loaded, however. |
| &#9745; | TopSites               | No          | No      | -           | Yes             | Uses internal Chrome/Browser API for retrieving topSites                                                                           |
| &#9744; | Calendar               | Yes         | Yes     | ???         | Yes             |
| &#9744; | Todos                  | Yes         | No*     | -           | Yes             | \*Only if external todo providers are included (such as todoist)                                                                   |
| &#9744; | Notes                  | Yes         | No*     | -           | Yes             | Maybe an option to sync todos with filesystem/file, or externally.<br>\*See todos.                                                 |
| &#9744; | 'Pomo' Timer/Countdown | Yes         | No      | -           | Yes             |
| &#9744; | Event countdown        | Yes         | No*     | -           | Yes             | *Might be able to communicate with api for certain dates/events                                                                    |