const myTime = new TimeNow();
const myNote = new NoteManager();
// const myGit = new GitHubNoteManager(GITHUB_USERNAME, GITHUB_TOKEN, "private");

const mainLoop = () => {
    date.innerHTML = `${myTime.formattedDate} <br> 1445/11/20`;
    time.children[0].innerHTML = myTime.hours;
    time.children[1].innerHTML = myTime.minutes;
    time.children[2].innerHTML = myTime.seconds;
};

mainLoop();
setInterval(mainLoop, 1000);

for (let i = 0; i < 10; i++) {
    myNote.create('🦆', 'Title', "Lorem ipsum dolor sit amet, qui minim labore adipisicing minim sint cillum sint consectetur cupidatat.", myTime.formattedDateTime);
}

