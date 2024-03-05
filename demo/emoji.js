import emojisData from "./data/emojis-data.js";
import { categoriesData } from "./data/emojis-data.js";

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
    console.log(emojiBtn.getAttribute("data-emoji"));
  });
});
