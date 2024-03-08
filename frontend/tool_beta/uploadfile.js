const formUploadImage = document.getElementById("form-upload-image");
const fileInput = document.getElementById("input-file");

formUploadImage.addEventListener("submit", uploadImage);

function uploadImage(event) {
  event.preventDefault();
  //   formUploadImage.setAttribute("target", "hidden-iframe");
  const file = fileInput.files[0];
  if (!file) {
    console.log("Please select a file.");
    return;
  }
  const formData = new FormData();
  formData.append("image", file);
  const url = new URL(formUploadImage.action);

  // Gửi request lên server
  fetch(url, {
    method: formUploadImage.method,
    body: formData,
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error("Upload failed");
      }
      return response.text();
    })
    .then((data) => {
      console.log("Upload successful:", data);
    })
    .catch((error) => {
      console.error("Error uploading file:", error);
    });
}
