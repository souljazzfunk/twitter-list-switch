// Twitter List Switcher - Content Script
// Switches between Twitter/X lists using ` and Shift+` keyboard shortcuts

(function() {
  'use strict';

  // Function to get all tab elements
  function getTabs() {
    // Find all elements with role="tab" that are part of the timeline navigation
    // Twitter uses div elements with role="tab" for their tab navigation
    return Array.from(document.querySelectorAll('div[role="tab"]'));
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
