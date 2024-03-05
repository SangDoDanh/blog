import emojisData from "./data/emojis-data.js";
import { categoriesData } from "./data/emojis-data.js";
import { editorElement, insertContent, triggerEvent } from "./beta.js";

const show = document.getElementById("emojis");
const categoriesEmoji = document.getElementById("nav-emoji");
const searchInput = document.getElementById("input-search-emoji");

// search emojis
searchInput.addEventListener("input", (e) => {
  const keySearch = e.target.value;
  if (keySearch) {
    handleSearchEmojis(keySearch);
  } else {
    const emojisSlug = document.querySelector(".emoji-item .btn-emoji");
    emojisSlug.classList.add("active");
    const categoryFirst = categoriesData[0];
    renderEmojis(show, getEmojisByCategory(categoryFirst.slug));
  }
});

function handleSearchEmojis(key) {
  const emojis = searchEmojis(key);
  removeClass(emojisSlug, "active");
  if (emojis.length == 0) {
    show.innerHTML = `<p class="message">Không có kết quả ...</p`;
  } else {
    renderEmojis(show, emojis);
  }
}

renderCategoriesEmoji(categoriesEmoji, categoriesData);
function renderCategoriesEmoji(targetElement, data) {
  targetElement.innerHTML = data.reduce((acc, category, index) => {
    const categoryActive = index == 0 ? "active" : "";
    if (categoryActive) {
      renderEmojis(show, getEmojisByCategory(category.slug));
    }
    return (
      acc +
      `<li class="emoji-item">
        <button 
          class="btn-emoji ${categoryActive}" 
          data-category="${category.slug}"
          title="${category.slug}" 
        >
        ${category.character}</button>
      </li>`
    );
  }, "");
}
function getEmojisByCategory(categoryName) {
  return emojisData.filter((emoji) => emoji.group === categoryName);
}

function searchEmojis(key) {
  return emojisData.filter((emoji) => {
    console.log(key);
    const emojiSubGroup = emoji.subGroup.split("-").join(" ");
    return emojiSubGroup.indexOf(key) != -1;
  });
}

function renderEmojis(targetElement, data) {
  const buttonEmojistHTML = data.reduce((acc, emoji) => {
    return (
      acc +
      `<button 
        class="emoji" 
        data-emoji="${emoji.character}"
       >
        ${emoji.character}
      </button>`
    );
  }, "");
  targetElement.innerHTML = buttonEmojistHTML;
  activeEventForEmojis();
}

// select category emoji
const emojisSlug = document.querySelectorAll(".emoji-item .btn-emoji");

emojisSlug.forEach((item) =>
  item.addEventListener("click", handlerClickCategoryItem)
);

function handlerClickCategoryItem(e) {
  searchInput.value = "";
  const element = e.target;
  removeClass(emojisSlug, "active");
  element.classList.add("active");
  const dateEmojis = getEmojisByCategory(element.getAttribute("data-category"));
  renderEmojis(show, dateEmojis);
}

function removeClass(nodeList, classRemove) {
  nodeList.forEach((node) => node.classList.remove(classRemove));
}

// them su kien cho button emojj
function activeEventForEmojis() {
  const emojisElement = document.querySelectorAll(".emoji");
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
}

const emojiButton = document.getElementById("emojis-btn");
const iconEmojiButton = document.querySelector("#emojis-btn i");
const wrapperEmojis = document.getElementById("wraper-emojis");

emojiButton.addEventListener("click", () => {
  editorElement.focus();
  editorElement.setSelectionRange(
    editorElement.selectionStart,
    editorElement.selectionEnd
  );
  wrapperEmojis.classList.toggle("d-none");
  emojiButton.classList.toggle("active");
});
closeBox(wrapperEmojis, [emojiButton, iconEmojiButton]);

// Đóng hộp thoại emojis khi nhấp chuột ra ngoài
function closeBox(boxElement, ignores) {
  document.body.addEventListener("click", function (event) {
    if (
      !boxElement.contains(event.target) &&
      ignores.indexOf(event.target) == -1
    ) {
      wrapperEmojis.classList.add("d-none");
      emojiButton.classList.remove("active");
    }
  });
}
