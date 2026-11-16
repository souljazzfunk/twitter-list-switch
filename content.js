// Twitter List Switcher - Content Script
// Switches between Twitter/X lists using ` and Shift+` keyboard shortcuts

(function() {
  'use strict';

  // Hide the first tab ("For you" / "おすすめ") on the home timeline only;
  // on profile pages the first tab is "Posts"
  const style = document.createElement('style');
  style.textContent = `
    html[data-tls-home] div[data-testid="primaryColumn"] div[role="tablist"] > div:first-child {
      display: none !important;
    }
  `;
  document.documentElement.appendChild(style);

  // X injects event tabs with no stable attribute and keeps renaming them
  // ("MLB" -> "Baseball" -> ...), so match labels by case-insensitive substring
  const HIDDEN_TAB_PATTERNS = [/mlb/i, /baseball/i];

  function hideInjectedTabs() {
    for (const tab of document.querySelectorAll('div[data-testid="primaryColumn"] div[role="tab"]')) {
      const label = tab.textContent.trim();
      if (HIDDEN_TAB_PATTERNS.some(re => re.test(label))) {
        tab.parentElement.style.setProperty('display', 'none', 'important');
      }
    }
  }

  // X is a single-page app, so re-check the path whenever the DOM changes
  function onDomChange() {
    document.documentElement.toggleAttribute('data-tls-home', location.pathname === '/home');
    hideInjectedTabs();
  }

  onDomChange();
  new MutationObserver(onDomChange).observe(document.body, { childList: true, subtree: true });

  // Function to get all tab elements
  function getTabs() {
    // Home timeline tabs are <div role="tab">; profile tabs (Posts, Replies, ...) are <a role="tab">
    // Exclude tabs that are hidden via CSS (e.g. "For you")
    return Array.from(document.querySelectorAll('div[data-testid="primaryColumn"] [role="tab"]'))
      .filter(tab => tab.offsetParent !== null);
  }

  // Function to get the currently selected tab index
  function getCurrentTabIndex(tabs) {
    return tabs.findIndex(tab => tab.getAttribute('aria-selected') === 'true');
  }

  // Function to switch to a specific tab
  function switchToTab(tab) {
    if (tab) {
      tab.click();
    }
  }

  // Function to handle tab navigation
  function navigateTabs(direction) {
    const tabs = getTabs();

    if (tabs.length === 0) {
      return;
    }

    const currentIndex = getCurrentTabIndex(tabs);

    if (currentIndex === -1) {
      // No tab selected, select the first one
      switchToTab(tabs[0]);
      return;
    }

    let newIndex;

    if (direction === 'right') {
      // Move to next tab (wrap around to start if at end)
      newIndex = (currentIndex + 1) % tabs.length;
    } else {
      // Move to previous tab (wrap around to end if at start)
      newIndex = (currentIndex - 1 + tabs.length) % tabs.length;
    }

    switchToTab(tabs[newIndex]);
  }

  // Keyboard event listener
  document.addEventListener('keydown', function(event) {
    // Check if the pressed key is backtick (`)
    // Key code 192 or key value '`'
    const isBacktick = event.key === '`' || event.code === 'Backquote';

    if (!isBacktick) {
      return;
    }

    // Don't trigger if user is typing in an input field
    const activeElement = document.activeElement;
    const isTyping = activeElement && (
      activeElement.tagName === 'INPUT' ||
      activeElement.tagName === 'TEXTAREA' ||
      activeElement.isContentEditable
    );

    if (isTyping) {
      return;
    }

    // Prevent default behavior
    event.preventDefault();
    event.stopPropagation();

    // Determine direction based on Shift key
    const direction = event.shiftKey ? 'left' : 'right';

    navigateTabs(direction);
  }, true); // Use capture phase to ensure we catch the event

  console.log('Twitter List Switcher extension loaded');
})();
