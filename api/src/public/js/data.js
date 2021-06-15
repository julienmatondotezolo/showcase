allUsers()
allprojects()

async function allUsers() {
    await fetch('http://localhost:3000/users/get-all', {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        }
    }).then(res => {
        res.json().then(parsedRes => {
            printAllUsers(parsedRes)
        })
    })
}

async function allprojects() {
    await fetch('http://localhost:3000/final-work/get-all', {
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

function printAllUsers(allData) {
    for (const data in allData) {
        $(".item-count").text("Total users: "+ data)
    }
    for (const data of allData) {
        // $(".table").append(`
        // <div class="table-tr">
        //     <figure class="table-td">
        //         <img src="" alt="project-logo">
        //     </figure>
        //     <article class="table-td">
        //         <p class="bold">${data.name}</p>
        //     </article>
        //     <section class="table-td">
        //         <p>0 <span>views</span></p>
        //         <p>0 <span>likes</span></p>
        //     </section>
        // </div>`);
    }
}


function printProjects(allData) {
    for (const data in allData) {
        $(".projects-count").text("Total projects: "+ data)
    }

}

function printAllProjects(allData) {
    for (const data of allData) {
        console.log(data.name);

    
        $(".table").append(`
       
        <div class="table-tr">
            <figure class="table-td">
                <img src="${data.images}" alt="project-logo">
            </figure>
            <article class="table-td">
                <p class="bold">${data.name}</p>
            </article>
            <a href="../page/detailproject.html?id=${data.name}">
            <button>Visit Google</button>
         </a>
    `);
    }
}