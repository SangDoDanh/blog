import emojisData from "./data/emojis-data.js";
import { categoriesData } from "./data/emojis-data.js";
import {
  editorElement,
  previewElement,
  insertContent,
  triggerEvent,
} from "./beta.js";

const show = document.getElementById("show-emoji");
const categoriesEmoji = document.getElementById("nav-emoji");
categoriesData.forEach((category, index) => {
  const categoryActive = index == 0 ? "active" : "";
  const emojisByCategory = emojisData
    .filter((emoji) => emoji.group == category.slug)
    .map((emoji, index) => {
      if (index == 0) {
        categoriesEmoji.insertAdjacentHTML(
          "beforeend",
          `<li class="emoji-item ${categoryActive}">${emoji.character}</li>`
        );
      }
      return `<button 
                class="emoji" 
                data-emoji="${emoji.character}"
              >
                ${emoji.character}
              </button>`;
    })
    .join("")
    .trim();
  let html = "";
  if (emojisByCategory) {
    html = `
      <div class="category ${categoryActive}">
      <div class="emojis">${emojisByCategory}<div>
      </div>`;
  }

  show.insertAdjacentHTML("beforeend", html);
});

// select category emoji
const emojisSlug = document.querySelectorAll(".emoji-item");
const emojisElement = document.querySelectorAll(".emoji");
const categoies = document.querySelectorAll(".category");

emojisSlug.forEach((item, index) =>
  item.addEventListener("click", (e) => {
    handlerClickCategoryItem(e, index);
  })
);

function handlerClickCategoryItem(e, index) {
  const element = e.target;
  removeClass(emojisSlug, "active");
  removeClass(categoies, "active");
  element.classList.add("active");
  const categortSelected = categoies.item(index);
  categortSelected.classList.add("active");
}

function removeClass(nodeList, classRemove) {
  nodeList.forEach((node) => node.classList.remove(classRemove));
}

// them su kien cho button emojj
emojisElement.forEach((emojiBtn) => {
  emojiBtn.addEventListener("click", () => {
    let positionStart = editorElement.selectionStart;
    const positionEnd = editorElement.selectionEnd;
    const valueEmoji = `${emojiBtn.getAttribute("data-emoji")} `;
    const content = editorElement.value;
    editorElement.value = insertContent(
      valueEmoji,
      positionStart,
      content,
      positionEnd
    );
    editorElement.setSelectionRange(
      positionStart + valueEmoji.length,
      positionStart + valueEmoji.length
    );
    editorElement.focus();
    triggerEvent("input", editorElement);
  });
});

const wrapperEmojis = document.getElementById("wraper-emojis");

const emojiButton = document.getElementById("emojis-btn");

emojiButton.addEventListener("click", () => {
  editorElement.focus();
  editorElement.setSelectionRange(
    editorElement.selectionStart,
    editorElement.selectionEnd
  );
  wrapperEmojis.classList.toggle("d-none");
  emojiButton.classList.toggle("active");
});
closeBox(wrapperEmojis, [emojiButton]);

// Đóng hộp thoại emojis khi nhấp chuột ra ngoài
function closeBox(boxElement, ignores) {
  document.body.addEventListener("click", function (event) {
    if (
      !boxElement.contains(event.target) &&
      ignores.indexOf(event.target) != -1
    ) {
      wrapperEmojis.classList.add("d-none");
    }
  });
}
