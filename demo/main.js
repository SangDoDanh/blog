import emojisData from "./lib/emojis-data.js";
import { categoriesData } from "./lib/emojis-data.js";

const show = document.getElementById("show");
const categoriesEmoji = document.getElementById("nav-emoji");
categoriesData.forEach((category, index) => {
  const emojisByCategory = emojisData
    .filter((emoji) => emoji.group == category.slug)
    .map((emoji, index) => {
      if (index == 0) {
        categoriesEmoji.insertAdjacentHTML(
          "beforeend",
          `<li class="">${emoji.character}</li>`
        );
      }
      return `<button class="emoji">${emoji.character}</button>`;
    })
    .join("");
  const categoryActive = index == 0 ? "active" : "";
  console.log(index);
  const html = `
    <div class="category ${categoryActive}">
        <div class="emojis">${emojisByCategory}<div>
    </div>`;
  show.insertAdjacentHTML("beforeend", html);
});
