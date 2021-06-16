import * as CTB64 from "./convertTob64.js";

$(document).ready(function () {
  console.log("entered detail");
  var url = window.location.search;
  const urlParams = new URLSearchParams(url);

  const idDetail = urlParams.get("id");
  console.log(idDetail);

  async function runAll(idDetail) {
    const [data] = await Promise.all([getProjectId(idDetail)]);
    console.log(data);
    // let converted = CTB64.bytesToBase64(data[0].images.data);

    $(".item_details").append(`
        <div>
          <figure class="cl1 images_detail">  
            <img src="${data[0].images}" alt="project-images">
          </figure>

          <div class="row_detail">
            <h3>Project name: <span class="blue">${data[0].name}</span></h3>
          </div>
          <div class="row_detail">
            <p>Project video: <a class="pink" href="${data[0].url}">${data[0].url}</a></p>
          </div>
          <div class="row_detail">
            <p>Description: <span class="blue">${data[0].description}</span></p>
          </div>
        </div>
    `);

  }

  runAll(idDetail);

});


async function getProjectId(id) {
  let response = await fetch(`final-work/get-byid/${id}`, {
    mode: "cors"
  });
  return await response.json();
}

async function getUserId(id) {
  let response = await fetch(`final-work/get-single/${id}`, {
    mode: "cors"
  });
  return await response.json();
}


async function deleteProject(id) {
  let response = await fetch(`http://localhost:3000/final-work/get-single/${id}`, {
    mode: "cors"
  });
  return await response.json();
}