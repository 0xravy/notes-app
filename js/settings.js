const settings = new SettingsManager();


fontSize.value = settings.localSettings.font.size;

// Font event
fontSize.addEventListener("input", (e) => settings.edit("font", "size", Number(e.target.value)));
fontStyle.addEventListener("input", (e) => settings.edit("font", "style", e.target.value));

// Github event
githubName.addEventListener("input", (e) => settings.edit("github", "name", e.target.value));
githubRepo.addEventListener("input", (e) => settings.edit("github", "repo", e.target.value));
githubToken.addEventListener("input", (e) => settings.edit("github", "token", e.target.value));
