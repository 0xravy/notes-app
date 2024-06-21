const settings = new SettingsManager();

editorArea.addEventListener("input", () => main());
main()


function main() {
    console.clear();
    reloadLineNumber();
    reloadLineArea();
    console.log(editorArea.innerText);
    // getPos();
    console.log(getCaretPosition(editorArea));
}


function getCaretPosition(editableDiv) {
    let caretPos = 0, sel, range;
    if (window.getSelection) {
	sel = window.getSelection();
	if (sel.rangeCount) {
	    range = sel.getRangeAt(0);
	    let preCaretRange = range.cloneRange();
	    preCaretRange.selectNodeContents(editableDiv);
	    preCaretRange.setEnd(range.endContainer, range.endOffset);
	    caretPos = preCaretRange.toString().length;
	}
    } else if (document.selection && document.selection.createRange) {
	range = document.selection.createRange();
	let preCaretTextRange = document.body.createTextRange();
	preCaretTextRange.moveToElementText(editableDiv);
	preCaretTextRange.setEndPoint("EndToEnd", range);
	caretPos = preCaretTextRange.text.length;
    }

    let text = editableDiv.innerText;
    let lines = text.split('\n');
    let line = 0, column = caretPos;

    for (let i = 0; i < lines.length; i++) {
	if (column <= lines[i].length) {
	    line = i + 1;
	    break;
	}
	column -= (lines[i].length + 1); // +1 because of the newline character
    }

    return { line: line, column: column };
}

function getPos() {
    var sel = document.getSelection(),
        nd = sel.anchorNode,
        text = String(nd);

    var line=text.split("\n").length;
    var col=text.split("\n").pop().length;
    console.log("row:"+line+", col:"+col )
}

function reloadLineArea() {
    if(
	!editorArea.hasChildNodes() ||
	editorArea.firstChild.tagName !== "DIV" &&
	editorArea.firstChild.textContent == ""
    ) {
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
