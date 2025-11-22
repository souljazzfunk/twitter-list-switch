# Twitter List Switcher

A Chrome extension that allows you to switch between Twitter (X) lists using keyboard shortcuts.

## Features

- Press `` ` `` (backtick) to move to the next list/tab
- Press `Shift + `` ` `` to move to the previous list/tab
- Works on both twitter.com and x.com
- Automatically wraps around when reaching the first or last tab

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" using the toggle in the top right corner
3. Click "Load unpacked"
4. Select the `twitter-list-switch` folder
5. The extension is now installed and active

## Usage

1. Navigate to Twitter/X home timeline (https://twitter.com/home or https://x.com/home)
2. Use the keyboard shortcuts:
   - `` ` `` - Move to next tab (Following → 1st → 2nd → feed → ...)
   - `Shift + `` ` `` - Move to previous tab (... → feed → 2nd → 1st → Following)

## Notes

- The shortcuts are disabled when typing in text fields to avoid conflicts
- The extension only activates on Twitter/X domains
- Tabs will wrap around (last tab → first tab and vice versa)

## Files

- `manifest.json` - Extension configuration
- `content.js` - Content script that handles keyboard shortcuts and tab navigation
- `README.md` - This file

## Troubleshooting

If the extension doesn't work:
1. Make sure you're on the Twitter/X home timeline page
2. Check that the extension is enabled in `chrome://extensions/`
3. Try refreshing the page
4. Check the browser console for any errors

## License

Free to use and modify.
