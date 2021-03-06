getNominations();
//getWinners();

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
      //    activeBtn();
    });
  });
}

/* async function getWinners() {
  await fetch("/admin/get-winners", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      $(".nomination-list").empty();
      if(parsedRes.length) {
        for (const iterator of parsedRes) {
          $(".nomination-list").append(
          `<div class="nominated-item">
            <article class="nominated-project cl2">
              <p class="project-name bold">${iterator.name}</p>
              <p class="project-cluster red">${iterator.cluster}</p>
            </article>
            <article class="nominated-votes cl2">
              <p class="votes-count">Votes: ${iterator.}</p>
            </article>
            <img src="${iterator.images}" alt="Bootz">
            <button class="btn bg-green white nominate" data-project-id="112">Winner <i class="fas fa-trophy"></i></button>
          </div>`
          );
        }
      } else {
        $(".nomination-list").empty();
        $(".nomination-list").append(`
        <section class="box">
          <p class='red'>No winners selected.</p>
        </section>
        `)
      }
      activeBtn();
    });
  });
} */

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
      //getWinners();
      notification(parsedRes.customMessage, parsedRes.code);
    });
  });
}

function printProjects(parsedRes) {
  let alreadyVotedForCluster = [];
  let winnerList = [];
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
        winnerList.push(data);
        alreadyVotedForCluster.push(data.cluster);
      }
    });
  }

  printWinners(winnerList);
  disableButtons(alreadyVotedForCluster);
  activeBtn();
}

function printWinners(parsedRes) {
  $(".nomination-list").empty();
  if (parsedRes.length) {
    for (const iterator of parsedRes) {
      $(".nomination-list").append(
        `<div class="nominated-item">
        <article class="nominated-project cl2">
          <p class="project-name bold">${iterator.name}</p>
          <p class="project-cluster red">${iterator.cluster}</p>
        </article>
        <article class="nominated-votes cl2">
          <p class="votes-count">Votes: ${iterator.totalVotes}</p>
        </article>
        <img src="${iterator.images}" alt="Bootz">
        <button class="btn bg-green white nominate" data-project-id="112">Winner <i class="fas fa-trophy"></i></button>
      </div>`
      );
    }
  } else {
    $(".nomination-list").empty();
    $(".nomination-list").append(`
    <section class="box">
      <p class='red'>No winners selected.</p>
    </section>
    `);
  }
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
