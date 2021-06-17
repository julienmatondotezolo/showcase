allprojects()

$("#search").on("keyup", function () {
    let valueText = $("input").val();

    if (valueText !== '') {
        searchProject(valueText)
    } else {
        allprojects()
    }
});

$(".dropdown-content a").click(function (e) { 
    // e.preventDefault();
    let url = window.location.href;
    console.log("URL: ", url)
    const urlParams = new URLSearchParams(url);
    const clusterQuery = urlParams.get("cluster");

    console.log(urlParams)
});

async function allprojects() {
    await fetch('/final-work/get-all/', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(parsedRes => {
            printProjects(parsedRes)
            printAllProjects(parsedRes)
        })
    })
}

async function searchProject(query) {
    await fetch('/final-work/search-name/' + query, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(parsedRes => {
            printProjects(parsedRes)
            printAllProjects(parsedRes)
        })
    })
}

function printProjects(allData) {
    $(".projects-count").text("Found projects: " + allData.length)
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