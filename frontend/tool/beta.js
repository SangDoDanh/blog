const editorElement = document.getElementById("input-editor");
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
    console.log(lineCurrent);
    if (lineCurrent.startsWith("*. ")) {
      const firstValue = content.slice(0, currentPosition);
      const lastValue = content.slice(currentPosition);
      this.value = `${firstValue}*. ${lastValue}`;
    } else {
      const regexOl = /^\d+\.\s.*/;
      const startsWith = lineCurrent.slice(0, lineCurrent.lastIndexOf(" ") + 1);
      console.log(startsWith);
      const start = +startsWith.slice(0, lineCurrent.lastIndexOf("."));
      console.log(start + 1);
      if (regexOl.test(startsWith)) {
        const firstValue = content.slice(0, currentPosition);
        const lastValue = content.slice(currentPosition);
        this.value = `${firstValue}${start + 1}. ${lastValue}`;
      }
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
  addUlHTMLOrOlHTML(clearTagEmpty());
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

function createStyle(inputText) {
  const valueArr = inputText.split(" ");
  return valueArr
    .map((word) => {
      switch (word) {
        case "```":
          return "<pre>";
        case "**[":
          return "<strong>";
        case "]**":
          return "</strong>";
        case "*[":
          return `<em>`;
        case "]*":
          return `</em>`;
        case "++[":
          return `<ins>`;
        case "]++":
          return `<ins>`;
        case "~~[":
          return `<s>`;
        case "]~~":
          return `</s>`;
        case "#[":
          return `<h1>`;
        case "]#":
          return "</h1>";
        case "##[":
          return "<h2>";
        case "]##":
          return "</h2>";
        case "###[":
          return "<h3>";
        case "]###":
          return "</h3>";
        case "*.":
          return "<li data-type='ul'>";
        case /\d\./.test(word) ? word : "xxxUnderfinedxxx":
          return `<li data-type='ol' data-start='${word}'>`;
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
  console.log(previewElement.innerHTML);
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

let dataDemo = `
* ~~ABC~~
* ~~ABC~~
* ~~ABC~~
* ~~ABC~~
* ~~ABC~~
`;

function addHtmlTag(data) {
  return data
    .split("\n")
    .map((item) => {
      item = item.replace("* ", "<li>");
      item = item.replace(/~~/g, "<button>");
      return item;
    })
    .join("\n");
}

function createTagHtml(dataRaw) {
  let regex = /<|>|\n/;
  let data = dataRaw.split(regex).filter((item) => item.trim().length > 0);
  let tagA = {
    name: "a",
    isClose: true,
  };
  let tagButton = {
    name: "button",
    isClose: true,
  };
  let tagP = {
    name: "p",
    isClose: true,
  };
  let tagI = {
    name: "i",
    isClose: true,
  };
  let tagLi = {
    name: "li",
    isClose: true,
  };
  let result = data.map((item) => {
    const indexSpaceFirst =
      item.indexOf(" ") > -1 ? item.indexOf(" ") : item.length;
    const wordFirst = item.slice(0, indexSpaceFirst);
    switch (wordFirst) {
      case "a":
        if (tagA.isClose) {
          tagA.isClose = false;
          return `<${item}>`;
        } else {
          tagA.isClose = true;
          return `</${item}>`;
        }
      case "button":
        if (tagButton.isClose) {
          tagButton.isClose = false;
          return `<${item}>`;
        } else {
          tagButton.isClose = true;
          return `</${item}>`;
        }

      case "i":
        if (tagI.isClose) {
          tagI.isClose = false;
          return `<${item}>`;
        } else {
          tagI.isClose = true;
          return `</${item}>`;
        }

      case "li":
        if (tagLi.isClose) {
          tagLi.isClose = false;
          return `<${item}>`;
        } else {
          tagLi.isClose = true;
          return `</${item}>`;
        }

      case "p":
        if (tagP.isClose) {
          tagP.isClose = false;
          return `<${item}>`;
        } else {
          tagP.isClose = true;
          return `</${item}>`;
        }
      default:
        return item;
    }
  });
  console.log(result.join(""));
  previewElement.innerHTML = result.join("");
}

createTagHtml(addHtmlTag(dataDemo));
