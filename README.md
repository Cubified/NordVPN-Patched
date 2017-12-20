# Patched NordVPN Chrome Extension
This is a version of the NordVPN proxy extension for Chrome (& Chromium) that fixes a major bug which caused Chrome to crash upon attempting to connect, disconnect, or adjust settings within the extension.  Additionally, it provides the option to manually select a desired server based on country.

### What caused the crash?
On my installation of ungoogled-chromium 55.0.2883.75, any call to

    chrome.privacy.network.webRTCIPHandlingPolicy.set()
causes the browser to instantly crash.  I have been able to reproduce this outside of this extension, meaning it is not a fault of this extension specifically, but rather the browser as a whole.  I assume this is as a result of using a (comparatively) out-of-date Chromium build, but I have yet to test it on a newer build (or one that has not had the ungoogled-chromium patches applied to it)

### Installation
1. `git clone "https://github.com/Cubified/NordVPN-Patched`
2. `cd NordVPN-Patched`
3. Navigate to [chrome://extensions](chrome://extensions)
4. Tick the "Developer mode" box
5. Press "Load unpacked extension..."
6. Select the `NordVPN-Patched` folder
7. Success!

### Known bugs
- While it is functional, the per-country searchbar causes noticeable lag

### Planned features
- Show geographic distance for each server
- Implement searchbar optimizations
- Cleanup/refactor (& rebeautify - unsure why spacing is inconsistent) code (especially the code I wrote myself, as this is the first time I've ever touched Angularjs)
