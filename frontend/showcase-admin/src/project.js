import * as JSON from './formToJSON.js';

$(".project-form").submit(function (e) {
    e.preventDefault();
    // let formdata = JSON.formJSON($(this))
    // let serializeForm = $(this).serialize()

    let frm = $(this);
    let formData = new FormData(frm[0]);
    formData.append('file', $('input[type=file]')[0].files[0]);

    // uploadProject(formdata)
    console.log(formData);
});

async function uploadProject(data) {


    console.table(data)
    // await fetch('http://193.191.183.48:3000/login', {
    //     method: 'POST',
    //     headers: {
    //         'Accept': 'application/json',
    //         'Content-Type': 'application/json'
    //     },
    //     body: JSON.stringify(data)
    // }).then(res => {
    //     res.json().then(parsedRes => {
    //         console.log(parsedRes)
    //     })
    // })
}