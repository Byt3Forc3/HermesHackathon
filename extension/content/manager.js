function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

const domain = location.hostname;
chrome.storage.local.get("site_" + domain, data => {
    const enabledModules = data["site_" + domain] || [];
    if (!enabledModules) return;

    enabledModules.forEach(mod => {
        import(chrome.runtime.getURL(`affections/${mod}/apply${capitalize(mod)}.js`))
            .then(module => module.apply())
            .catch(err => console.error("Error loading module:", mod, err));
    });
});