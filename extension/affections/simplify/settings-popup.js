// Remove the import and use the class directly

class SimplifySettings {
  // Retrieve settings from chrome storage
    static async getSettings() {
        return new Promise((resolve) => {
            chrome.storage.sync.get(['simplifySettings'], (result) => {
                const stored = result.simplifySettings || {
                    enabled: true,
                    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
                    textColor: '#333333',
                    lineHeight: '1.5',
                    letterSpacing: '0',
                };

                // Normalize any older shorthand colors like "#333" into valid "#rrggbb"
                if (stored.textColor && /^#([0-9a-fA-F]{3})$/.test(stored.textColor)) {
                    const hex = stored.textColor.slice(1);
                    stored.textColor = '#' + hex.split('').map(ch => ch + ch).join('');
                }

                resolve(stored);
            });
        });
    }

    // Save settings to chrome storage
    static async saveSettings(settings) {
        return new Promise((resolve) => {
            chrome.storage.sync.set({ simplifySettings: settings }, resolve);
        });
    }
}

// Update range value displays
function initializeRangeDisplays() {
    const lineHeightSlider = document.getElementById('lineHeight');
    const letterSpacingSlider = document.getElementById('letterSpacing');
    
    if (lineHeightSlider) {
        lineHeightSlider.addEventListener('input', function() {
            document.getElementById('lineHeightValue').textContent = this.value;
        });
    }
    
    if (letterSpacingSlider) {
        letterSpacingSlider.addEventListener('input', function() {
            document.getElementById('letterSpacingValue').textContent = this.value + 'px';
        });
    }
}

// Make the settings ui show current settings and save new ones
document.addEventListener('DOMContentLoaded', async () => {
    const settings = await SimplifySettings.getSettings();
    
    // Load current settings
    document.getElementById('fontFamily').value = settings.fontFamily;
    document.getElementById('textColor').value = settings.textColor || '#333333';
    
    // Load new settings with fallbacks
    if (document.getElementById('lineHeight')) {
        document.getElementById('lineHeight').value = settings.lineHeight || '1.5';
        document.getElementById('lineHeightValue').textContent = settings.lineHeight || '1.5';
    }
    
    if (document.getElementById('letterSpacing')) {
        document.getElementById('letterSpacing').value = settings.letterSpacing || '0';
        document.getElementById('letterSpacingValue').textContent = (settings.letterSpacing || '0') + 'px';
    }
    
    // Initialize range displays
    initializeRangeDisplays();
    
    // Save settings
    document.getElementById('saveBtn').addEventListener('click', async () => {
        const newSettings = {
            enabled: settings.enabled, // Preserve enabled state
            fontFamily: document.getElementById('fontFamily').value,
            textColor: document.getElementById('textColor').value,
            lineHeight: document.getElementById('lineHeight').value,
            letterSpacing: document.getElementById('letterSpacing').value
        };
        
        await SimplifySettings.saveSettings(newSettings);
        alert('Settings saved! Refresh pages to see changes.');
        window.close(); // Close the settings tab after saving
    });
});