const url_string = window.location.href;
const url = new URL(url_string);
const query = url.searchParams.get("cluster")
  ? url.searchParams.get("cluster")
  : url.searchParams.get("order");

allVotes();
myVotes();

if (query) {
  if (
    query == "web" ||
    query == "mobile" ||
    query == "motion" ||
    query == "ar" ||
    query == "digital-making"
  ) {
    clusterFilter(query);
  } else if (query == "asc" || query == "desc") {
    orderFilter(query);
  }
} else {
  allProjects();
}

$("#search").on("keyup", function () {
  let valueText = $("input").val();

  if (valueText !== "") {
    searchProject(valueText);
  } else {
    allProjects();
  }
});

async function orderFilter(sort) {
  await fetch("/final-work/get-all/" + sort, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
      printAllProjects(parsedRes);
    });
  });
}

async function clusterFilter(sort) {
  await fetch("/final-work/filter-cluster/" + sort, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
      printAllProjects(parsedRes);
    });
  });
}

async function allVotes() {
  await fetch("/admin/all-votes", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      nominates(parsedRes);
    });
  });
}

async function myVotes() {
  await fetch("/admin/my-votes", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printVotes(parsedRes);
    });
  });
}

async function allProjects() {
  await fetch("/final-work/get-all/", {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
      printAllProjects(parsedRes);
    });
  });
}

async function searchProject(query) {
  await fetch("/final-work/search-name/" + query, {
    method: "GET",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
  }).then((res) => {
    res.json().then((parsedRes) => {
      printProjects(parsedRes);
      printAllProjects(parsedRes);
    });
  });
}

function nominates(data) {
  console.log(data);

  var result = data.reduce((unique, o) => {
    if (!unique.some((obj) => obj.name === o.name)) {
      unique.push(o);
    }
    return unique;
  }, []);

  result.sort((a, b) =>
    a.totalVotes < b.totalVotes ? 1 : b.totalVotes < a.totalVotes ? -1 : 0
  );

  $(".vote-slider").empty();
  for (const item of result) {
    $(".vote-slider").append(`
    <div class="project-item" data-projectid="${item.id}">
    <figure class="project-img" style="background: url('${
      item.images
    }') center center / 100% no-repeat;">
    </figure>
    <article class="project-info">
      <p class="bold project-name">${item.name}</p>
      <p class="project-cluster-name">${getTheCluster(item.cluster)}</p>
    </article>
    <div class="vote-count">
      <p>Votes: ${item.totalVotes}  </p>
    </div>
  </div>
    `);
  }
}

let votedClusterArr = [];
function printVotes(allData) {
  $(".all-voted .table-content").empty();
  for (const data of allData) {
    $(".all-voted .table-content").append(`
      <div class="table-tr">
          <figure class="table-td">
          <img src="${data.images}" alt="project-images">
          </figure>
          <article class="table-td">
              <p class="bold">${data.name}</p>
          </article>
          <article class="table-td">
              <p class="bold">${data.username}</p>
          </article>
          <article class="table-td">
              <p class="bold">${getTheCluster(data.cluster)}</p>
          </article>
          <a href="../detailproject?id=${data.projectid}">
              <button class="btn bg-pink white">Unvote</button>
          </a>
      </div>
    `);
  }

  allData.forEach((element) => {
    votedClusterArr.push(getTheCluster(element.cluster));
  });
  $(".top-projects .item-name").empty();
  $(".all-voted .item-name").append(`Projects (${allData.length})`);
}

function printProjects(allData) {
  $(".top-projects .item-name").empty();
  $(".top-projects .item-name").append(`Projects (${allData.length})`);
}

function getTheCluster(cluster) {
  let data = "";
  switch (cluster) {
    case "web":
      data = " Web";
      break;
    case "motion":
      data = " Motion";
      break;
    case "digital-making":
      data = " Digital Making";
      break;
    case "ar":
      data = " Alternative Reality";
      break;
    case "mobile":
      data = " Mobile Application";
      break;
  }

  return data;
}

function printAllProjects(allData) {
  $(".top-projects .table-content").empty();
  for (const data of allData) {
    $(".top-projects .table-content").append(`
            <div class="table-tr">
                <figure class="table-td">
                <img src="${data.images}" alt="project-images">
                </figure>
                <article class="table-td">
                    <p class="bold">${data.name}</p>
                </article>
                <article class="table-td">
                    <p class="bold">${data.username}</p>
                </article>
                <article class="table-td">
                    <p class="bold">${getTheCluster(data.cluster)}</p>
                </article>
                <a href="../detailproject?id=${data.projectid}">
                    <button class="btn bg-blue white">See project</button>
                </a>
            </div>
        `);
  }
}
