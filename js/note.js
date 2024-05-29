editorArea.addEventListener("input", () => main());
main()


function main() {
    reloadLineNumber();
    reloadLineArea();
}


function reloadLineArea() {
    if(!editorArea.hasChildNodes() || editorArea.firstChild.tagName !== "DIV") {
	editorArea.innerHTML = "";
	let newLine = document.createElement("div");
	editorArea.appendChild(newLine);
    }
}

function reloadLineNumber() {
    lineNumber.innerHTML = "";
    let linesLength = editorArea.children.length;
    let checkLine = linesLength < 1? 1: linesLength;


    for(let i = 1; i <= checkLine; i++) {
	let newLine = document.createElement("div");
	newLine.textContent = i;
	lineNumber.appendChild(newLine);
    }
}
