editorArea.addEventListener("input", () => main());
main()


function main() {
    console.clear();
    reloadLineNumber();
    reloadLineArea();
    console.log(editorArea.innerText);
    getPos();
}

function getPos() {
    var sel = document.getSelection(),
        nd = sel.anchorNode,
        text = nd.textContent.slice(0, sel.focusOffset);

    var line=text.split("\n").length;
    var col=text.split("\n").pop().length;
    console.log("row:"+line+", col:"+col )
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
