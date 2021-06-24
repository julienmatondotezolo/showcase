$(document).ready(function () {
    console.log('the email is send');
    const url_string = window.location.href;
const url = new URL(url_string);
console.log('here is the url '+url)
const query = url.searchParams.get("email");
console.log("here is the query "+query);
printEmail(query);

function printEmail(email) {

      $("#emailSection").append(`<p>${email}</p>`);
    
  }
});