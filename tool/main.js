const editorElement = document.getElementById("input-editor");
let currentPositionEditor = 0;
const previewElement = document.getElementById("preview");
editorElement.addEventListener("keyup", handlerKeyUpEnterForList);

function handlerKeyUpEnterForList(e) {
  if (e.keyCode === 13) {
    const currentPosition = this.selectionStart;
    const content = this.value;
    let firstEnter = content.lastIndexOf("\n", currentPosition - 2);
    firstEnter = firstEnter > -1 ? firstEnter : 0;
    let lineCurrent = content.slice(firstEnter, currentPosition);
    lineCurrent = lineCurrent.split("\n").join("");
    if (lineCurrent.startsWith("*. ")) {
      const firstValue = content.slice(0, currentPosition);
      const lastValue = content.slice(currentPosition);
      this.value = `${firstValue}*. ${lastValue}`;
    }
    const regexOl = /^\d+\.\s.*/;
    const startsWith = lineCurrent.slice(0, lineCurrent.lastIndexOf(" ") + 1);
    const start = +startsWith.slice(0, lineCurrent.lastIndexOf("."));
    if (regexOl.test(startsWith)) {
      const firstValue = content.slice(0, currentPosition);
      const lastValue = content.slice(currentPosition);
      this.value = `${firstValue}${start + 1}. ${lastValue}`;
    }
  }
}

editorElement.addEventListener("input", createEditor);
function createEditor(element) {
  const dataRaw = element.target.value;
  const dataNotHtml = removeHtml(dataRaw);
  const result = closeTagLi(dataNotHtml)
    .trim()
    .split("\n")
    .map((value) => {
      return `<p>${createStyle(value)}</p>`;
    })
    .join("");
  previewElement.innerHTML = result;
  goodTagCode();
  addUlHTMLOrOlHTML(clearTagEmpty());
  currentPositionEditor = this.selectionStart;
  console.log(currentPositionEditor);
  renderTable(previewElement);
}

function goodTagCode() {
  const tagsPre = previewElement.querySelectorAll("pre");
  tagsPre.forEach((tagPre) => {
    let html = tagPre.innerHTML
      .split(/<p>/)
      .join("")
      .split(/<\/p>/)
      .map((item) => `${item}\n`)
      .join("")
      .trim();
    tagPre.innerHTML = `<code class="language-javascript">${html}</code>`;
  });
}

function clearTagEmpty() {
  const tagsP = previewElement.querySelectorAll("p");
  tagsP.forEach((tagP) => {
    if (!tagP.innerHTML) {
      tagP.remove();
    }
  });
  return previewElement;
}
let isActive = true;
function createStyle(inputText) {
  const valueArr = inputText.split(" ");
  return valueArr
    .map((word) => {
      switch (word) {
        case "```[":
          console.log("zo mo the pre");
          isActive = false;
          console.log(isActive);
          return "<pre>";
        case "]```":
          console.log("zo dong pre");
          isActive = true;
          return "</pre>";
        case "**[":
          return isActive ? "<strong>" : word;
        case "]**":
          return isActive ? "</strong>" : word;
        case "*[":
          return isActive ? `<em>` : word;
        case "]*":
          return isActive ? `</em>` : word;
        case "++[":
          return isActive ? `<ins>` : word;
        case "]++":
          return isActive ? `<ins>` : word;
        case "~~[":
          return isActive ? `<s>` : word;
        case "]~~":
          return isActive ? `</s>` : word;
        case "#[":
          return isActive ? `<h1>` : word;
        case "]#":
          return isActive ? "</h1>" : word;
        case "##[":
          return isActive ? "<h2>" : word;
        case "]##":
          return isActive ? "</h2>" : word;
        case "###[":
          return isActive ? "<h3>" : word;
        case "]###":
          return isActive ? "</h3>" : word;
        case "*.":
          console.log("zo day");
          console.log(isActive);
          return isActive ? "<li data-type='ul'>" : word;
        case /\d\./.test(word) ? word : "xxxUnderfinedxxx":
          return isActive ? `<li data-type='ol' data-start='${word}'>` : word;
      }
      return word;
    })
    .join(" ");
}

function removeHtml(inputText) {
  return inputText.replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function addUlHTMLOrOlHTML(previewElement) {
  const tagAll = previewElement.querySelectorAll("*");
  let isNewUl = true;
  let ulElement;
  let listType;
  tagAll.forEach((tag) => {
    const tagName = tag.tagName.toLowerCase();
    if (tagName == "li" && isNewUl) {
      listType = tag.getAttribute("data-type");
      ulElement = document.createElement(listType);
      if (listType == "ol") {
        const start = tag.getAttribute("data-start").slice(0, -1);
        ulElement.setAttribute("start", start);
      }
      tag.parentNode.insertBefore(ulElement, tag);
      ulElement.appendChild(tag);
      isNewUl = false;
    } else if (tagName == "li" && tag.getAttribute("data-type") != listType) {
      listType = tag.getAttribute("data-type");
      ulElement = document.createElement(listType);
      if (listType == "ol") {
        console.log("tag", tag);
      }
      tag.parentNode.insertBefore(ulElement, tag);
      ulElement.appendChild(tag);
      isNewUl = false;
    } else if (tagName == "li") {
      ulElement.appendChild(tag);
    } else {
      isNewUl = true;
    }
  });
  //   console.log(previewElement.innerHTML);
}

function closeTagLi(inputText) {
  return inputText
    .split("\n")
    .map((tag) => {
      if (tag.startsWith("*. ")) {
        return `${tag}</li>`;
      }
      const regexOl = /^\d+\./;
      const startsWith = tag.slice(0, tag.lastIndexOf(" "));
      if (regexOl.test(startsWith)) {
        return `${tag}</li>`;
      }
      return tag;
    })
    .join("\n");
}
// render table
function renderTable(previewNode) {
  const tagsP = previewNode.querySelectorAll("p");
  const tagTable = [];
  tagsP.forEach((tag) => {
    const tagHtml = tag.innerHTML.trim();
    const isTable = tagHtml.startsWith("|") && tagHtml.endsWith("|");
    if (isTable) {
      tagTable.push(tagHtml);
    }
  });

  console.log(tagTable);
}

// button tool-code click
const toolCodebtn = document.getElementById("btn-tool-code");
toolCodebtn.addEventListener("click", () => {
  const content = editorElement.value;
  const previousvalue = content.slice(0, currentPositionEditor);
  const backValue = content.slice(currentPositionEditor);
  const constentAdd =
    currentPositionEditor > 0 ? "\n```[ \n\n ]```\n" : "```[ \n\n ]```\n";
  editorElement.value = previousvalue + constentAdd + backValue;
  editorElement.focus();
  editorElement.setSelectionRange(
    currentPositionEditor + 7,
    currentPositionEditor + 7
  );
});
