console.log("works");

await orderFilter();

async function orderFilter() {
  await fetch("/admin/get-nominations", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
    });
  });
}

function printProjects(parsedRes) {
  let alreadyVotedForCluster = [];
  for (const iterator in parsedRes) {
    parsedRes[iterator].forEach((data) => {
      console.log(data.winner);
      $(`#${iterator}Cluster`).append(`
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
                    <button  class="btn white ${data.cluster} ${
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
    //  $(`.${data}`).disabled();
  });
}
