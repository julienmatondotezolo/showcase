const url_string = window.location.href;
const url = new URL(url_string);
const query = url.searchParams.get("cluster") ? url.searchParams.get("cluster") : url.searchParams.get("order");

allVotes()

if (query) {
  if(query == "web" || query == "mobile" || query == "motion" || query == "ar" || query == "digital-making") {
    clusterFilter(query);
  } else if(query == "asc" || query == "desc") {
    orderFilter(query)
  }
} else {
    allProjects()
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
  console.log(sort)
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
      console.log(parsedRes);
      printProjects(parsedRes);
      printAllProjects(parsedRes);
    });
  });
}

async function allVotes() {
    await fetch('/admin/my-votes', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(parsedRes => {
            voteCount(parsedRes)
        })
    })
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

function voteCount(allData) {
    $(".votes-count").text("Voted projects: " + allData.length);
}

function printProjects(allData) {
  $(".projects-count").text("Found projects: " + allData.length);
}

function printAllProjects(allData) {
  $(".table-content").empty();
  for (const data of allData) {
    // let convertedImg = CTB64.bytesToBase64(data.images.data);

    $(".table-content").append(`
            <div class="table-tr">
                <figure class="table-td">
                    <img src="${data.images}" alt="project-images">
                </figure>
                <article class="table-td">
                    <p class="bold">${data.name}</p>
                </article>
                <article class="table-td">
                    <p class="bold">${data.cluster}</p>
                </article>
                <a href="../detailproject?id=${data.projectid}">
                    <button class="btn bg-blue white">See project</button>
                </a>
            </div>
        `);
  }
}
