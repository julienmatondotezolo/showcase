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
      <input type="number" name="id" id="${idDetail}" value="${idDetail}" hidden>
    `);
  }

  runAll(idDetail).then(() => {
    allVotes();
    allFavorites();
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
      if (allData.projectid === idDetail) {
        console.log(
          `You have already voted for ${allData.name} in the cluster ${allData.cluster}`
        );
        //  document.getElementById('voteButton').v
        $(`#voteForm`).attr("hidden", true);

        $(`#unvoteForm`).attr("hidden", false);
        $(`#unvoteButton`).removeClass("bg-blue").addClass("bg-darkgrey");
        // $('#' + projectId).next().val('Already voted').disabled.css("background", "#b0bfc3 !important");
      } else {
        if (allData.cluster === cluster) {
          $(`#voteButton`)
            .val("Already voted for this cluster.")
            .removeClass("bg-blue") //.
            .attr("disabled", true)
            //  $(`#voteForm`).
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

  async function allFavorites() {
    await fetch("/admin/my-favorites", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
    }).then((res) => {
      res.json().then((parsedRes) => {
        verifyFavorite(parsedRes);
      });
    });
  }

  function verifyFavorite(data) {
    console.log(data);
    for (const item of data) {
      if (item.projectid === idDetail) {
        console.log(`Favorite`);
        $(`#favoriteButton`).val("Remove from favorites");
      }
    }
  }

  document
    .getElementById("favoriteButton")
    .addEventListener("click", function () {
      favorite();
      console.log(idDetail);
      console.log(JSON.stringify({ project_id: idDetail }));
    });
  async function favorite() {
    await fetch("/admin/favorite", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ project_id: idDetail }),
    }).then((res) => {});
  }
});
