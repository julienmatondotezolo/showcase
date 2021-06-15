import * as formTransform from "./formToJSON.js";
import * as User from "./checkAuth.js";

console.log("Load project");

$(".project-form").submit(function (e) {
  e.preventDefault();
  /* let formdata = formTransform.formJSON($(this));
    // let frm = $(this);
  // let formData = new FormData(frm[0]);
  // formData.append('file', $('input[type=file]')[0].files[0]);

  formdata.userId = User.checkAuth();
  formdata.images = "https://picsum.photos/200";*/
  uploadProject(formdata);
});

async function uploadProject(data) {
  console.table(data);
  await fetch("/final-work/create", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    res.json().then((parsedRes) => {
      console.log(parsedRes);
    });
  });
}

const imageLabel = document.getElementById("image-label");
document.getElementById("image").addEventListener("change", () => {
  console.log("%cIMAGE UPLOADED", "color: red; font-weight: bold");
  imageLabel.style.backgroundColor = "white";
  imageLabel.style.backgroundImage = "url('../assets/images/upload_black.png')";
});
