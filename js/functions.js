const padToTwoDigits = (num) => String(num).padStart(2, '0');

class TimeNow {
    get now() { return new Date(); };
    get hours() { 
        let h =this.now.getHours();
        return   padToTwoDigits(h > 12? h - 12: h);
    };
    get minutes() { return padToTwoDigits(this.now.getMinutes()); };
    get seconds() { return padToTwoDigits(this.now.getSeconds()); };
    get day() { return padToTwoDigits(this.now.getDate()); };
    get month() { return padToTwoDigits(this.now.getMonth() + 1); };
    get year() { return this.now.getFullYear(); };
    get formattedDate() { return `${this.year}/${this.month}/${this.day}`; };
    get formattedDateTime() { return `${this.hours}:${this.minutes}:${this.seconds} - ${this.formattedDate}`; };
}

class SettingsManager {
    constructor() {
        this.data = {
            themes: [
                {
                    base01: "#0f191f",
                    base02: "#12222b",
                    base03: "#eeedebe0",
                    base04: "#27546B",
                    base05: "#213845",
                },
            ],
            font: {
                size: 12,
                style: [
                    "lala",
                    "lolo",
                    "lele",
                ],
            },
            github: {
                name: "",
                repo: "",
                token: "",
            }
        }


        if(!localStorage.getItem("settings")) {
            localStorage.setItem("settings", JSON.stringify(this.data));
            console.log("add settings");
            console.log(JSON.parse(localStorage.getItem('settings')));
        }

        document.body.style.setProperty('--font-size', `${this.localSettings.font.size}px`);
    }

    get getData() {
        return  JSON.parse(localStorage.getItem('settings'));
    }

    get localSettings() {
        return JSON.parse(localStorage.getItem('settings'));
    }

    reload() {
        localStorage.setItem("settings", JSON.stringify(this.data));
    }

    update(newData) {
        localStorage.setItem("settings", JSON.stringify(newData));
        document.body.style.setProperty('--font-size', `${this.localSettings.font.size}px`);
    }

    edit(type, name, value) {
        let newSettings = this.getData;
        newSettings[type][name] = value;
        this.update(newSettings);
    }
}


class NoteManager {
    create(emoji, title, content, date)  {
        const note = document.createElement('a');
        note.setAttribute('href', 'pages/note.html');
        note.className = 'card';
        note.innerHTML = `
            <div class="title" data-emoji="${emoji ?? '🧸'}">${title}</div>
            <div class="content">${content}</div>
            <div class="footer">${date}</div>
        `;
        cards.appendChild(note);
    }
};


class GitHubNoteManager {
    constructor(name, token, repo) {
        this.baseURL = 'https://api.github.com';
        this.GITHUB_USERNAME = name;
        this.GITHUB_TOKEN = token;
        this.GITHUB_REPO = repo;
        this.pathStack = [];
        this.initialize();
    }

    initialize() {
        // document.getElementById('createRepoBtn').addEventListener('click', () => this.createRepo());
        // document.getElementById('addFileBtn').addEventListener('click', () => this.addFile());
        // document.getElementById('editFileBtn').addEventListener('click', () => this.editFile());
        // document.getElementById('removeFileBtn').addEventListener('click', () => this.removeFile());
        // document.getElementById('readFilesBtn').addEventListener('click', () => this.readFiles());
        document.getElementById('repoSearch').addEventListener('input', () => this.searchRepos());
        document.getElementById('repoSearch').addEventListener('focus', () => this.searchRepos());
        // document.getElementById('this.GITHUB_REPO').addEventListener('change', () => this.readFiles());
        // document.getElementById('backBtn').addEventListener('click', () => this.navigateBack());
    }


    async createRepo() {
        const isPrivate = document.getElementById('repoType').checked;

        try {
            const response = await fetch(`${this.baseURL}/user/repos`, {
                method: 'POST',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    name: this.GITHUB_REPO,
                    private: isPrivate,
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Repository created:', data);
            } else {
                console.error('Error creating repository:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async addFile() {
        const fileName = prompt("Enter file name:");
        const fileContent = document.getElementById('fileContent').value;

        try {
            const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${fileName}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
                body: JSON.stringify({
                    message: 'Add new file',
                    content: btoa(fileContent), // encode file content to base64
                }),
            });

            if (response.ok) {
                const data = await response.json();
                console.log('File added:', data);
            } else {
                console.error('Error adding file:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async editFile() {
        const fileName = prompt("Enter file name:");
        const fileContent = document.getElementById('fileContent').value;

        try {
            const existingFileResponse = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${fileName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (existingFileResponse.ok) {
                const existingFileData = await existingFileResponse.json();
                const existingFileSha = existingFileData.sha;

                const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${fileName}`, {
                    method: 'PUT',
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                    },
                    body: JSON.stringify({
                        message: 'Update file content',
                        content: btoa(fileContent),
                        sha: existingFileSha,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('File edited:', data);
                } else {
                    console.error('Error editing file:', await response.json());
                }
            } else {
                console.error('Error fetching existing file:', await existingFileResponse.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async removeFile() {
        const fileName = prompt("Enter file name:");

        try {
            const existingFileResponse = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${fileName}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (existingFileResponse.ok) {
                const existingFileData = await existingFileResponse.json();
                const existingFileSha = existingFileData.sha;

                const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${fileName}`, {
                    method: 'DELETE',
                    headers: {
                        'Authorization': `token ${this.GITHUB_TOKEN}`,
                        'Content-Type': 'application/json',
                        'Accept': 'application/vnd.github.v3+json',
                    },
                    body: JSON.stringify({
                        message: 'Remove file',
                        sha: existingFileSha,
                    }),
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('File removed:', data);
                } else {
                    console.error('Error removing file:', await response.json());
                }
            } else {
                console.error('Error fetching existing file:', await existingFileResponse.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async readFiles() {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Repository files and folders:', data);
                this.displayFileTree(data);
            } else {
                console.error('Error fetching repository files and folders:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async readFilesInDirectory(directoryPath) {

        try {
            const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${repoName}/contents/${directoryPath}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Files and folders in directory:', data);
                this.displayFileTree(data);
            } else {
                console.error('Error fetching directory content:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    async viewFileContent(filePath) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${filePath}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const fileContent = atob(data.content);
                document.getElementById('fileContent').value = fileContent;
            } else {
                console.error('Error fetching file content:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async readFilesInDirectory(directoryPath) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.GITHUB_USERNAME}/${this.GITHUB_REPO}/contents/${directoryPath}`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                console.log('Files and folders in directory:', data);
                this.displayFileTree(data);
            } else {
                console.error('Error fetching directory content:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    async searchRepos() {
        try {
            const response = await fetch(`${this.baseURL}/users/${this.GITHUB_USERNAME}/repos`, {
                method: 'GET',
                headers: {
                    'Authorization': `token ${this.GITHUB_TOKEN}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github.v3+json',
                },
            });

            if (response.ok) {
                const data = await response.json();
                const repoList = document.getElementById('repoList');
                repoList.innerHTML = '';

                data.forEach(repo => {
                    const option = document.createElement('option');
                    option.value = repo.name;
                    repoList.appendChild(option);
                });
            } else {
                console.error('Error fetching repositories:', await response.json());
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    navigateBack() {
        this.pathStack.pop();
        const currentPath = this.pathStack.length > 0 ? this.pathStack[this.pathStack.length - 1] : '';
        this.updateBackButtonVisibility();
        if (currentPath) {
            this.readFilesInDirectory(currentPath);
        } else {
            this.readFiles();
        }
    }

    updateBackButtonVisibility() {
        const backBtn = document.getElementById('backBtn');
        if (this.pathStack.length > 0) {
            backBtn.classList.remove('hidden');
        } else {
            backBtn.classList.add('hidden');
        }
    }

    displayFileTree(files) {
        const fileTreeContainer = document.getElementById('fileTree');
        fileTreeContainer.innerHTML = '';

        files.forEach(file => {
            const fileElement = document.createElement('div');
            fileElement.innerHTML = `${file.type === 'file' ? '<i class="fas fa-file"></i>' : '<i class="fas fa-folder"></i>'} ${file.name}`;
            fileElement.className = 'file-item';
            fileElement.addEventListener('click', () => {
                if (file.type === 'file') {
                    this.viewFileContent(file.path);
                } else if (file.type === 'dir') {
                    this.pathStack.push(file.path);
                    this.updateBackButtonVisibility();
                    this.readFilesInDirectory(file.path);
                }
            });
            fileTreeContainer.appendChild(fileElement);
        });
    }
}

