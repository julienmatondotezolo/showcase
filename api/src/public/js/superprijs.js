getSuperPriceNominations();
//getWinners();

async function getSuperPriceNominations() {
  await fetch("/admin/get-superprijs-nominations", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printSuperPriceNominations(parsedRes);
    });
  });
}

async function getNominations() {
  await fetch("/admin/get-nominations", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes)
    });
  });
}

function printProjects(parsedRes) {
  $(`#nominations  .table-content`).empty();
  for (const data of parsedRes) {
    $(`#nominations .table-content`).append(`
            <div class="table-tr">
                <figure class="table-td">
                   <img src="${data.images}" alt="${data.name}"> 
                </figure>
                <article class="table-td">
                    <p class="bold">${data.name}</p>
                </article>
                <article class="table-td">
                    <p class="bold">${data.username}</p>
                </article>
                <article class="table-td">
                    <p class="bold">${data.totalVotes}</p>
                </article>
                <a class="detailproject" data-project-id=${data.projectid}>
                    <button class="btn white ${data.cluster + data.winner} ${
        data.winner ? "bg-pink" : "bg-blue"
      } ">${data.winner ? "Remove winner" : "Choose winner"}</button>
                </a>
            </div>
        `);

    if (data.winner) {
      winnerList.push(data);
      alreadyVotedForCluster.push(data.cluster);
    }
  };
}

async function printSuperPriceNominations(parsedRes) {
  $(".nomination-list").empty();
  if (parsedRes.length) {
    let projectData;
    for (const iterator of parsedRes) {
      projectData = iterator
      $(".nomination-list").append(
        `<div class="nominated-item">
        <article class="nominated-project cl2">
          <p class="project-name bold">${iterator.name}</p>
          <p class="project-cluster red">${iterator.cluster}</p>
        </article>

        <img src="${iterator.images}" alt="Bootz">
        <button class="btn bg-green white nominate-price" data-project-id="${iterator.projectid}">Nominate <i class="fas fa-trophy"></i></button>
      </div>`
      );

    //   <article class="nominated-votes cl2">
    //   <p class="votes-count">Votes: ${iterator.totalVotes}</p>
    // </article>
    }

    $(".nominate-price").click(async function (e) {
      e.preventDefault();
      let projectid = $(this).data("project-id");
      alert(projectid, "nominate-superprijs")
    });

  } else {
    $(".nomination-list").empty();
    $(".nomination-list").append(`
    <section class="box">
      <p class='red'>0 nominated projects for the superprice.</p>
    </section>
    `);
  }
}

function message(projectid, conditon) {
  if (conditon == "nominate-superprijs") {
    return `<h3>Choose <span class="blue">this project</span> as superprice ?</h3>
              <p>Click <span class="blue">confirm</span> to add as superprice.</p>
              <button class="btn btn-inverse cancel">Cancel</button>
              <button class="btn bg-pink white add-superprice" data-project-id="${projectid}">Confirm</button>`;
  }
}

function alert(data, action) {
  $("body").append(`
    <div class="alert message-wrap">
      <div class="alert-message box box-shadow">
        ${message(data, action)}
      </div>
    </div>
  `);

  $(".cancel").click(function (e) {
    $(".alert").remove();
  });

  $(".add-superprice").click(function (e) {
    let projectid = $(this).data("project-id");
    addSuperPrice(projectid)
    $(".alert").remove();
  });
}

async function addSuperPrice(projectid) {
  await fetch("/admin/set-superprijs", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: projectid
    }),
  }).then((res) => {
    res.json().then((parsedRes) => {
      notification(parsedRes.customMessage, parsedRes.code);
    });
  });
}

function notification(msg, statusCode) {
  let statuscolor = "bg-green";

  if (statusCode == 200) {
    statuscolor = "bg-green";
  }

  if (statusCode == 403 || statusCode == 400) {
    statuscolor = "bg-red";
  }

  $(".notification").remove();
  $(
    `<div class="notification ${statuscolor}"><span class="bold">${msg}</span></div>`
  ).appendTo("body");
  $(".notification").fadeOut(5000);

  setTimeout(function () {
    $(".notification").remove();
  }, 6000);
}

/* ================= SCROLL TO ID ================= */

// function goToByScroll(id) {
//   // Remove "link" from the ID
//   id = id.replace("link-", "");
//   // Scroll
//   let posY = $("main #" + id).offset().top;
//   console.log("#" + id);
//   console.log(posY);
//   $("main").animate(
//     {
//       scrollTop: $("#" + id).offset().top,
//     },
//     "slow"
//   );
// }