function capitalize(s) {
    return s.charAt(0).toUpperCase() + s.slice(1);
}

(async function init() {
    const { setPlatform, createExtensionPlatform, getPlatform } = await import(
        chrome.runtime.getURL("lib/hermes/platform.js")
    );
    setPlatform(createExtensionPlatform());

    const { initSideShell } = await import(
        chrome.runtime.getURL("lib/hermes/sideShell.js")
    );
    initSideShell({ context: "extension" });

    const domain = location.hostname;
    getPlatform().storage.local.get("site_" + domain, (data) => {
        const enabledModules = data["site_" + domain] || [];
        if (!enabledModules.length) {
            return;
        }

        enabledModules.forEach((mod) => {
            const url = getPlatform().resolveAsset(
                `affections/${mod}/apply${capitalize(mod)}.js`
            );
            import(url)
                .then((module) => module.apply())
                .catch((err) => console.error("Error loading module:", mod, err));
        });
    });
})();
