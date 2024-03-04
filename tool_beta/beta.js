import VersionContent from "./version_content.js";
const editorElement = document.getElementById("input-editor");
let currentPositionEditor = 0;
const previewElement = document.getElementById("preview");
editorElement.addEventListener("keyup", handlerKeyUpEnterForList);

// config markedjs for instag
const insTag = {
  name: "insTag",
  level: "inline",
  start(src) {
    return src.indexOf("++");
  },
  tokenizer(src) {
    const rule = /^\+\+([\s\S]+?)\+\+/;
    const match = rule.exec(src);
    if (match) {
      return {
        type: "insTag",
        raw: match[0],
        content: match[1],
      };
    }
  },
  renderer(token) {
    return `<ins>${token.content}</ins>`;
  },
};

marked.use({ extensions: [insTag] });

function handlerKeyUpEnterForList(e) {
  if (e.keyCode === 13) {
    let currentPosition = this.selectionStart;
    const content = this.value;
    let firstEnter = content.lastIndexOf("\n", currentPosition - 2);
    firstEnter = firstEnter > -1 ? firstEnter : 0;
    let lineCurrent = content.slice(firstEnter, currentPosition);
    lineCurrent = lineCurrent.split("\n").join("");
    //Handles the enter key press with unordered list
    if (lineCurrent.startsWith("* ")) {
      const firstValue = content.slice(0, currentPosition);
      const lastValue = content.slice(currentPosition);
      this.value = `${firstValue}* ${lastValue}`;
      this.setSelectionRange(currentPosition + 2, currentPosition + 2);
    }
    // Handles the enter key press with ordered list
    const regexOl = /^\d+\.\s/;
    const startsWith = lineCurrent.slice(0, lineCurrent.lastIndexOf(" ") + 1);
    const start = +startsWith.slice(0, lineCurrent.lastIndexOf("."));
    if (regexOl.test(startsWith)) {
      const firstValue = content.slice(0, currentPosition);
      const lastValue = content.slice(currentPosition);
      this.value = `${firstValue}${start + 1}. ${lastValue}`;
      this.setSelectionRange(
        currentPosition + `${start + 1}`.length + 2,
        currentPosition + `${start + 1}`.length + 2
      );
    }
  }
}

editorElement.addEventListener("input", createEditor);
let isFirst = true;
function createEditor(element) {
  const dataNoHTML = removeHtml(element.target.value);
  currentPositionEditor = this.selectionStart;
  previewElement.innerHTML = marked.parse(dataNoHTML);
  const aTags = previewElement.querySelectorAll("a");
  addAttributeToTags(
    {
      name: "target",
      value: "_blank",
    },
    aTags
  );
  if (isFirst) {
    document.getElementById("btn-undo").removeAttribute("disabled");
    isFirst = false;
  }
}

function addAttributeToTags(attribute, nodelist) {
  nodelist.forEach((tag) => {
    tag.setAttribute(attribute.name, attribute.value);
  });
}

function removeHtml(inputText) {
  return inputText.replace(/</g, "&lt;");
}

// button-tool-table click
const toolTableBtn = document.getElementById("btn-tool-table");
toolTableBtn.addEventListener("click", () => {
  const wrapperTable = document.querySelector(".wrapper-table");
  wrapperTable.classList.toggle("d-none");
});
const rows = document.querySelectorAll(".table-select tr");

rows.forEach((row, indexRow) => {
  const cells = row.querySelectorAll(".cell");
  cells.forEach((cell, indexCell) => {
    cell.addEventListener("mouseover", () => {
      hightlightCell(indexRow, indexCell);
    });
    cell.addEventListener("mouseout", clearHighlightCell);
    cell.addEventListener("click", () => {
      const content = editorElement.value;
      const previousvalue = content.slice(0, currentPositionEditor);
      const backValue = content.slice(currentPositionEditor);
      const dataRaw = renderDataRowTable(indexRow, indexCell);
      editorElement.value = previousvalue + dataRaw + backValue;
      editorElement.focus();
      editorElement.setSelectionRange(
        currentPositionEditor,
        currentPositionEditor
      );
      const inputEvent = new Event("input");
      editorElement.dispatchEvent(inputEvent);
    });
  });
});

function renderDataRowTable(rowPosition, cellPosition) {
  const headingRaw =
    Array.from({ length: cellPosition + 1 }, () => "| HEAD ").join("") + "|\n";
  const separatieRaw =
    Array.from({ length: cellPosition + 1 }, () => "| ---- ").join("") + "|\n";
  let dataRaw = "";
  for (let i = 0; i <= rowPosition; i++) {
    dataRaw +=
      Array.from({ length: cellPosition + 1 }, () => "| DATA ").join("") +
      "|\n";
  }
  return `\n${headingRaw}${separatieRaw}${dataRaw}`;
}

// hightlight color for cell
function clearHighlightCell() {
  const cells = document.querySelectorAll(".table-select .cell");
  cells.forEach((cell) => cell.classList.remove("active"));
}

function hightlightCell(rowPosition, cellPosition) {
  rows.forEach((row, indexRow) => {
    const cells = row.querySelectorAll(".cell");
    cells.forEach((cell, indexCell) => {
      const isRowActive = indexRow <= rowPosition;
      const isCellActive = indexCell <= cellPosition;
      if (isRowActive && isCellActive) {
        cell.classList.add("active");
      } else {
        cell.classList.remove("active");
      }
    });
  });
}

const versionContent = new VersionContent(
  document.getElementById("input-editor")
);
versionContent.start();
updateStateButtonRedo();
updateStateButtonUndo();
const btnTolls = document.querySelectorAll(".tool-btn");
btnTolls.forEach((btn) => {
  btn.addEventListener("click", () => {
    const dataType = btn.getAttribute("data-type");
    switch (dataType) {
      case "heading-1":
      case "heading-2":
      case "heading-3":
      case "heading-4":
      case "heading-5":
      case "heading-6":
        const markdowHeading = createMarkdowHeading(dataType);
        insertInlineBlockTag(markdowHeading, "", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "ul":
        // insertInlineBlockTag("* ", "\n", editorElement);
        insertMultiLineBlockTag("* ", "", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "ol":
        // insertInlineBlockTag("1. ", "\n", editorElement);
        insertMultiLineBlockTag("0. ", "", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "quote":
        insertInlineBlockTag("> ", "\n", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "link":
        insertInlineTag("[", "]()", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "image":
        insertInlineTag("![", "]()", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "bold":
        insertInlineTag("**", "**", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "italic":
        insertInlineTag("*", "*", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "through":
        insertInlineTag("~~", "~~", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "underline":
        insertInlineTag("++", "++", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "code":
        insertInlineTag("`", "`", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "block-code":
        insertBlockTag("```", "```", editorElement);
        triggerEvent("input", editorElement);
        break;
      case "undo":
        versionContent.undoVersion();
        updateStateButtonUndo();
        updateStateButtonRedo();
        updateContentsPreview();
        break;
      case "redo":
        versionContent.redoVersion();
        updateStateButtonRedo();
        updateStateButtonUndo();
        updateContentsPreview();
        break;
    }
  });
});

function updateStateButtonUndo() {
  const btn = document.getElementById("btn-undo");
  if (versionContent.canUndo()) {
    btn.removeAttribute("disabled");
  } else {
    btn.setAttribute("disabled", "");
  }
}

function updateStateButtonRedo() {
  const btn = document.getElementById("btn-redo");
  if (versionContent.canRedo()) {
    btn.removeAttribute("disabled");
  } else {
    btn.setAttribute("disabled", "");
  }
}

function updateContentsPreview() {
  const dataNoHTML = removeHtml(editorElement.value);
  previewElement.innerHTML = marked.parse(dataNoHTML);
  const aTags = previewElement.querySelectorAll("a");
  addAttributeToTags(
    {
      name: "target",
      value: "_blank",
    },
    aTags
  );
}

function createMarkdowHeading(dataType) {
  const type = dataType.slice(-1);
  return `${Array.from({ length: +type }, () => "#").join("")} `;
}

function updateContentInlineEditor(key, editor) {
  const selectionRange = editor.selectionEnd - editor.selectionStart;
  const startRange = key.length + editor.selectionStart;
  let position = editor.selectionEnd;
  let content = insertContent(key, position, editor.value);
  position = editor.selectionStart;
  content = insertContent(key, position, content);
  editor.value = content;
  editor.focus();
  editor.setSelectionRange(startRange, startRange + selectionRange);
}

function insertInlineTag(openTag, colseTag, editor) {
  const selectionRange = editor.selectionEnd - editor.selectionStart;
  const startRange = openTag.length + editor.selectionStart;
  let position = editor.selectionEnd;
  let content = insertContent(colseTag, position, editor.value);
  position = editor.selectionStart;
  content = insertContent(openTag, position, content);
  editor.value = content;
  editor.focus();
  editor.setSelectionRange(startRange, startRange + selectionRange);
}

function insertInlineBlockTag(openTag, closeTag, editor) {
  let editorValue = editor.value;
  let content = "";
  const selectionStart = editor.selectionStart;
  const selectionRange = editor.selectionEnd - editor.selectionStart;
  let startRange = openTag.length + editor.selectionStart;
  let position = editor.selectionEnd;
  if (editorValue[position] == "\n") {
    content = insertContent(`${closeTag}`, position, editor.value);
  } else {
    content = insertContent(`\n${closeTag}`, position, editor.value);
  }
  if (selectionStart > 0 && content[selectionStart - 1] != "\n") {
    openTag = `\n${openTag}`;
    startRange += 1;
  }
  content = insertContent(`${openTag}`, selectionStart, content);
  editor.value = content;
  editor.focus();
  editor.setSelectionRange(startRange, startRange + selectionRange);
}

function insertMultiLineBlockTag(openTag, closeTag, editor) {
  let content = editor.value;
  const selectionStart = editor.selectionStart;
  const selectionEnd = editor.selectionEnd;
  let contentRange = content.slice(selectionStart, selectionEnd);
  content = removeContent(
    selectionStart,
    selectionStart + contentRange.length,
    content
  );
  if (contentRange.length == 0) {
    contentRange = `data1\ndata2\ndata3`;
  }
  contentRange = addMarkDowList(openTag, closeTag, contentRange);
  let startRange = openTag.length + selectionStart;
  if (selectionStart > 0 && content[selectionStart - 1] != "\n") {
    contentRange = `\n${contentRange}`;
  }
  content = insertContent(contentRange, selectionStart, content);
  let endRange;
  let position = selectionStart + contentRange.length;
  if (content[position] == "\n") {
    content = insertContent("\n", position, content);
  } else {
    content = insertContent("\n\n", position, content);
  }
  endRange = startRange + contentRange.length - openTag.length;
  editor.value = content;
  editor.focus();
  editor.setSelectionRange(startRange, endRange);
}

function addMarkDowList(openTag, closeTag, dataRaw) {
  let hasLineBreak = dataRaw.slice(-1) == "\n";
  const regexOl = /^\d+\.\s/;
  const isOrderedList = regexOl.test(openTag);
  let result = dataRaw
    .split("\n")
    .map((line) => {
      if (isOrderedList) {
        openTag = ascdingOrder(openTag);
      }
      return `${openTag}${line}${closeTag}`;
    })
    .join("\n");

  if (isOrderedList) {
    openTag = ascdingOrder(openTag);
  }
  if (!hasLineBreak) {
    result += `\n${openTag}${closeTag}`;
  }
  return result;
}

function ascdingOrder(openTag) {
  const start = +openTag.slice(0, openTag.indexOf("."));
  return `${start + 1}. `;
}

function insertBlockTag(openTag, closeTag, editor) {
  const selectionStart = editor.selectionStart;
  const selectionRange = editor.selectionEnd - editor.selectionStart;
  let startRange = openTag.length + editor.selectionStart;
  let position = editor.selectionEnd;
  let content = insertContent(`\n${closeTag}`, position, editor.value);
  position = editor.selectionStart;
  if (selectionStart > 0 && content[selectionStart] != "\n") {
    openTag = `\n${openTag}`;
    startRange += 1;
  }
  content = insertContent(`${openTag}\n`, position, content);
  editor.value = content;
  editor.focus();
  editor.setSelectionRange(startRange + 1, startRange + selectionRange + 1);
}

function triggerEvent(eventName, element) {
  const newEvent = new Event(eventName);
  element.dispatchEvent(newEvent);
}

function insertContent(value, position, content) {
  if (value.length == 0) {
    return content;
  }
  const previousvalue = content.slice(0, position);
  const backValue = content.slice(position);
  return `${previousvalue}${value}${backValue}`;
}

function removeContent(start, end, content) {
  if (start == end) {
    return content;
  }
  const previousvalue = content.slice(0, start);
  const backValue = content.slice(end);
  return `${previousvalue}${backValue}`;
}
