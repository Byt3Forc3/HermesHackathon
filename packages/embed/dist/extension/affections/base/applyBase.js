import { getPlatform } from "../../lib/hermes/platform.js";

export function apply() {
    console.log("Base accessibility module activated");

    fetch(getPlatform().resolveAsset("affections/base/styles.css"))
        .then(r => r.text())
        .then(css => {
            const style = document.createElement("style");
            style.textContent = css;
            document.head.appendChild(style);
        });
}
