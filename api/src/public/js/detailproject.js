$(document).ready(function () {
  var url = window.location.search;
  const urlParams = new URLSearchParams(url);
  const idDetail = urlParams.get("id");

  let cluster = "";

  async function runAll(idDetail) {
    const [data] = await Promise.all([getProjectId(idDetail)]);
    // let converted = CTB64.bytesToBase64(data[0].images.data);
    cluster = data[0].cluster;
    $(".item_details").append(`
        <div>
          <figure class="cl1 images_detail">  
            <img src="${data[0].images}" alt="project-images">
          </figure>

          <div class="row_detail">
            <h3>Project name: <span class="blue">${data[0].name}</span></h3>
          </div>
          <div class="row_detail">
            <p>Project video: <a class="pink" href="${data[0].url}" target="_blank">${data[0].url}</a></p>
          </div>
          <div class="row_detail">
            <p>Description: <span class="blue">${data[0].description}</span></p>
          </div>
        </div>
    `);

    $(".project-form").prepend(`
      <input type="number" name="project_id" id="${idDetail}" value="${idDetail}" hidden>
    `);
  }

  runAll(idDetail).then(() => {
    allVotes();
  });

  async function allVotes() {
    await fetch("/admin/my-votes", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((parsedRes) => {
        console.log(parsedRes);
        verifyVote(parsedRes);
      });
    });
  }

  function verifyVote(data) {

    for (const allData of data) {
      if (allData.project_id === parseInt(idDetail)) {
        console.log(
          `You have already voted for ${allData.name} in the cluster ${allData.cluster}`
        );
        //  document.getElementById('voteButton').v
        $(`#voteButton`)
          .val("Already voted for this project")
          .attr("disabled", true)
          .removeClass("bg-blue")
          .addClass("bg-darkgrey");
        // $('#' + projectId).next().val('Already voted').disabled.css("background", "#b0bfc3 !important");
      } else {
        if (allData.cluster === cluster) {
          $(`#voteButton`)
            .val("Already voted for this cluster")
            .attr("disabled", true)
            .removeClass("bg-blue")
            .addClass("bg-darkgrey");
        }
      }
    }
  }

  async function getProjectId(id) {
    let response = await fetch(`final-work/get-byid/${id}`, {
      mode: "cors",
    });
    return await response.json();
  }

  async function getUserId(id) {
    let response = await fetch(`final-work/get-single/${id}`, {
      mode: "cors",
    });
    return await response.json();
  }

  async function deleteProject(id) {
    let response = await fetch(
      `http://localhost:3000/final-work/get-single/${id}`,
      {
        mode: "cors",
      }
    );
    return await response.json();
  }
});
