const url_string = window.location.href;
const url = new URL(url_string);
const query = url.searchParams.get("cluster")
  ? url.searchParams.get("cluster")
  : url.searchParams.get("order");

allVotes();
myVotes();
slider();

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

$(".sidenav li").click(function (e) { 
  e.preventDefault();
  $(this).addClass('active').siblings().removeClass('active');
});

$("#search").on("keyup", function () {
  let valueText = $("input").val();

  if (valueText !== "") {
    searchProject(valueText);
  } else {
    allProjects();
  }
});

/* ================= FILTERS ================= */

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
  $('.filter').append(`
  <div class="filter-value bg-blue">
    <a href="/dashboard-docent"><i class="fas fa-times"></i> ${sort}</a>
  </div>`);

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

/* ================= SLIDER ================= */

async function slider() {
  const projectIdArr = [79, 82, 83, 84, 96, 112, 115, 125]
  let random = Math.floor(Math.random() * projectIdArr.length);
  let data = await getProjectId(projectIdArr[random]);
  printSlidContent(data)

  random = Math.floor(Math.random() * projectIdArr.length);
  data = await getProjectId(projectIdArr[random]);
  printSlidContent(data)
}

function printSlidContent(data) {
  //style="background: url('${data[0].images}') center center / 100% no-repeat;"
  $(".slider").append(`
  <article class="slider-content white">
    <h3>Watch the ${data[0].name} project !</h3>
    <p>
      ${data[0].description}
    </p>
    <button class="btn bg-pink white detailproject" data-project-id=${data[0].projectid}>See project</button>
    <img src="${data[0].images}" alt="${data[0].name}">
  </article>`);

  $(".detailproject").click(function (e) { 
    detail(data)
  });
}

/* ================= VOTES ================= */

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

      $(".unvote").click(async function (e) { 
        e.preventDefault();
        let idDetail = $(this).data("project-id");
        let data = await getProjectId(idDetail);
        alert(data, "unvote");
      });

    });
  });
}

async function vote(projectid) {
  await fetch("/admin/vote", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: projectid})
  }).then((res) => {
    res.json().then((parsedRes) => {
      allVotes();
      myVotes();
      notification(parsedRes.customMessage, parsedRes.code)
    });
  });
}

async function unVote(projectid) {
  await fetch("/admin/unvote", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: projectid})
  }).then((res) => {
    res.json().then((parsedRes) => {
      allVotes();
      myVotes();
      notification(parsedRes.customMessage, parsedRes.code)
    });
  });
}

let votedClusterArr = [];
function printVotes(allData) {
  $(".all-voted .table-content").empty();
  // style="background: url('${data.images}') center center / 100% no-repeat;"
  for (const data of allData) {
    $(".all-voted .table-content").append(`
      <div class="table-tr">
          <figure class="table-td bg-dark-blue">
            <img src="${data.images}" alt="${data.name}">
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
          <a class="unvote" data-project-id=${data.projectid}>
              <button class="btn bg-pink white">Unvote</button>
          </a>
      </div>
    `);
  }

  allData.forEach((element) => {
    votedClusterArr.push(getTheCluster(element.cluster));
  });
  $(".all-voted .item-name").empty();
  $(".all-voted .item-name").append(`My Votes (${allData.length})`);
}

/* ================= PROJECTS ================= */

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

function printProjects(allData) {
  $(".top-projects .item-name").empty();
  $(".top-projects .item-name").append(`Projects (${allData.length})`);
}

function printAllProjects(allData) {
  $(".top-projects .table-content").empty();
  // style="background: url('${data.images}') center center / 100% no-repeat;"
  for (const data of allData) {
    $(".top-projects .table-content").append(`
        <div class="table-tr">
            <figure class="table-td bg-dark-blue">
              <img src="${data.images}" alt="${data.name}">
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
            <a class="detailproject" data-project-id=${data.projectid}>
                <button class="btn bg-blue white">See project</button>
            </a>
        </div>
    `);
  }

  $(".detailproject").click(async function (e) { 
    let idDetail = $(this).data("project-id");
    let data = await getProjectId(idDetail);
    detail(data)
  });

}

async function getProjectId(id) {
  let response = await fetch(`/final-work/get-byid/${id}`, {
    mode: "cors",
  });
  return await response.json();
}

/* ================= FAVORIES ================= */

async function addFavorite(projectid) {
  await fetch("/admin/favorite", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: projectid})
  }).then((res) => {
    res.json().then((parsedRes) => {
      notification(parsedRes.customMessage, parsedRes.code)
    });
  });
}

/* ================= NOMINATIONS ================= */

$(".nominations").click(function (e) { 
  allVotes()
  $("#nomination").css("display", "block");
});

function nominates(data) {
  var result = data.reduce((unique, o) => {
    if (!unique.some((obj) => obj.name === o.name)) {
      unique.push(o);
    }
    return unique;
  }, []);

  result.sort((a, b) =>
    a.totalVotes < b.totalVotes ? 1 : b.totalVotes < a.totalVotes ? -1 : 0
  );

  printNominations(result)

  $(".vote-slider").empty();
  for (const item of result) {
    $(".vote-slider").append(`
    <div class="project-item" data-projectid="${item.id}">
    <figure class="project-img" style="background: url('${
      item.images
    }') center center / 100% no-repeat;"></figure>
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

function printNominations(data) {
  $(".nomination-list").empty();
  for (const item of data) {
    $(".nomination-list").append(`
      <div class="nominated-item">
        <article class="nominated-project cl2">
          <p class="project-name bold">${item.name}</p>
          <p class="project-cluster red">${item.cluster}</p>
        </article>
        <article class="nominated-votes cl2">
          <p class="votes-count">Votes: ${item.totalVotes}</p>
        </article>
        <img src="${item.images}" alt="${item.name}">
        <button class="btn bg-pink white confirm-nominations" data-project-id="${item.id}">Nominate</button>
      </div>
    `);
  }

  $("#nomination .cancel").click(function (e) { 
    $("#nomination").css("display", "none");
    $(".nominations").removeClass('active');
    $(".sidenav li:nth-child(1)").addClass('active');
  });

  $(".confirm-nominations").click(function (e) { 
    let projectid = $(this).data("project-id");
    nominate(projectid);
  });
}

async function nominate(projectid) {
  await fetch("/admin/nominate", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({id: projectid})
  }).then((res) => {
    console.log(res)
    res.json().then((parsedRes) => {
      console.log(parsedRes)
      notification(parsedRes.customMessage, parsedRes.code)
    });
  });
}

/* ================= DETAIL & ALERTS & NOTIFICATIONS ================= */

function detail(data) {
  $(".detail").remove();
  $("body").append(`
    <div class="detail message-wrap">
      <div class="detail-content box box-shadow">
        <h3 class="blue">${data[0].name}</h3>
        <figure class="project-img" style="background: url('${data[0].images}') center center / 100% no-repeat;">
          
        </figure>
        <article class="project-info cl1">
          <section class="txt">
            <h3 class="blue">Description</h3>
            <p class="description">${data[0].description}</p>
            <p class="author">Author: <span class="bold">${data[0].username}</span></p>
            <p class="video">Video: <a class="blue" href="${data[0].url}" target="_blank">${data[0].url}</a></p>
            <p class="cluster">Cluster: <span class="blue">${data[0].cluster}</span></p>
          </section>
          <figure class="project-video">
            <iframe src="${data[0].url}"></iframe>
          </figure>
        </article>
        <article class="cl1">
          <button class="btn btn-inverse cancel">Close</button>
          <button class="btn bg-pink white vote" data-project-id="${data[0].projectid}">Vote</button>
          <i class="far fa-2x fa-heart" data-project-id="${data[0].projectid} aria-hidden="true"></i>
        </article>
      </div>
    </div>
  `);

  $(".cancel").click(function (e) { 
    $(".detail").remove();
  });

  $(".vote").click(function (e) { 
    alert(data, "vote");
  });
}

function message(data, conditon) {
  if (conditon == "unvote") {
     return `<h3>Remove your vote for <span class="blue">${data[0].name}</span> ?</h3>
              <p>Click <span class="blue">unvote</span> to remove your vote.</p>
              <button class="btn btn-inverse cancel">Cancel</button>
              <button class="btn bg-pink white remove" data-project-id="${data[0].projectid}">Remove</button>`
  }

  if (conditon == "vote") {
    return `<h3>Vote for <span class="blue">${data[0].name}</span> ?</h3>
            <p>Click <span class="blue">vote</span> to vote for this project.</p>
            <button class="btn btn-inverse cancel">Cancel</button>
            <button class="btn bg-pink white vote" data-project-id="${data[0].projectid}">Vote</button>`
  }
}

function alert(data, action) {
  $(".message-wrap").remove();
  $("body").append(`
    <div class="alert message-wrap">
      <div class="alert-message box box-shadow">
        ${message(data, action)}
      </div>
    </div>
  `);

  $(".cancel").click(function (e) { 
    $(".message-wrap").remove();
  });

  $(".remove").click(function (e) { 
    let projectid = $(this).data("project-id");
    unVote(projectid);
    $(".message-wrap").remove();
  });

  $(".vote").click(function (e) { 
    let projectid = $(this).data("project-id");
    vote(projectid);
    $(".message-wrap").remove();
  });
}

function notification(msg, statusCode) {
  let statuscolor = "bg-green"

  if(statusCode == 200) {
    statuscolor = "bg-green"
  }

  if(statusCode == 403) {
    statuscolor = "bg-red"
  }

  $('.notification').remove();
  $(`<div class="notification ${statuscolor}"><span class="bold">${msg}</span></div>`).appendTo('body');
  $('.notification').fadeOut(5000);

  setTimeout(function(){ 
    $('.notification').remove();
  }, 6000);
}