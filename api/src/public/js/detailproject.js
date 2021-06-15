$(document).ready(function () {
    console.log("entered detail");
    var url = window.location.search;
    const urlParams = new URLSearchParams(url);
  
    const idDetail = urlParams.get("id");
    console.log(idDetail)
async function runAll(idDetail) {
    const [ data] = await Promise.all([getProjectId(idDetail)]);
   console.log(data);

   $(".item_details").append(`
       
   <div>
   <div class="row_detail">Project name ${data[0].name}</div>
   <div class="row_detail">Name ${data[0].projectid}</div>
   <div class="row_detail">ID ${data[0].user_id}</div>
   <div class="row_detail">URL ${data[0].url}</div>
   <div class="row_detail">Description 
   ${data[0].description}
   </div>

   <button>Delete project </button>
   <button>Confirm</button>

    </div>
`);

}

runAll(idDetail);

});
async function getProjectId(id) {
    let response = await fetch(`http://193.191.183.48:3000/final-work/get-single/${id}`,
      { mode: "cors" }
    );
    return await response.json();
  }

  async function getUserId(id) {
    let response = await fetch(`http://193.191.183.48:3000/final-work/get-single/${id}`,
      { mode: "cors" }
    );
    return await response.json();
  }

  
  async function deleteProject(id) {
    let response = await fetch(`http://193.191.183.48:3000/final-work/get-single/${id}`,
      { mode: "cors" }
    );
    return await response.json();
  }