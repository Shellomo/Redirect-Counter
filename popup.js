document.addEventListener('DOMContentLoaded', () => {
  function updateList() {
    chrome.storage.local.get(['redirectCounts'], (result) => {
      const redirectList = document.getElementById('redirectList');
      const counts = result.redirectCounts || {};

      redirectList.innerHTML = ''; // Clear existing content

      if (Object.keys(counts).length === 0) {
        redirectList.innerHTML = '<p>No redirects tracked yet today</p>';
        return;
      }

      Object.entries(counts)
        .sort(([,a], [,b]) => b - a)
        .forEach(([domain, count]) => {
          const item = document.createElement('div');
          item.className = 'domain-item';
          item.innerHTML = `
            <span>${domain}</span>
            <span>${count} redirects</span>
          `;
          redirectList.appendChild(item);
        });
    });
  }

  // Clear data button handler
  document.getElementById('clearData').addEventListener('click', () => {
    if (confirm('Are you sure you want to clear all redirect data?')) {
      chrome.storage.local.set({
        redirectCounts: {},
        lastReset: new Date().toDateString()
      }, () => {
        updateList(); // Refresh the display
      });
    }
  });

  // Initial load
  updateList();
});