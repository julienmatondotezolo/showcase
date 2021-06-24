console.log("works");

await getNominations();

async function getNominations() {
  await fetch("/admin/get-nominations", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
      activeBtn();
    });
  });
}

async function setWinner(data) {
  await fetch("/admin/set-winner", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ id: data }),
  }).then((res) => {
    res.json().then((parsedRes) => {
      getNominations();
      notification(parsedRes.customMessage, parsedRes.code);
    });
  });
}

function printProjects(parsedRes) {
  let alreadyVotedForCluster = [];
  $(`.table-content`).empty();
  for (const iterator in parsedRes) {
    parsedRes[iterator].forEach((data) => {
      console.log(data.winner);
      $(`#${iterator}Cluster .table-content`).append(`
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
        alreadyVotedForCluster.push(data.cluster);
      }
    });
  }

  disableButtons(alreadyVotedForCluster);
}

function disableButtons(alreadyVotedForCluster) {
  console.log(alreadyVotedForCluster);

  alreadyVotedForCluster.forEach((data) => {
    $(`.${data}false`)
      .text("Already voted")
      .removeClass("bg-blue")
      .attr("disabled", "disabled")
      .addClass("bg-darkgrey");
  });
}

function activeBtn() {
  $(".detailproject").click(function (e) {
    let idDetail = $(this).data("project-id");
    setWinner(idDetail);
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
