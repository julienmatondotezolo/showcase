"use strict";

$(".login-form").submit(function (e) {
    e.preventDefault();
    let formdata = formJSON($(this))
    login(formdata)
});

$(".register-form").submit(function (e) {
    e.preventDefault();
    let formdata = formJSON($(this))
    register(formdata)
});

async function login(data) {
    await fetch('http://193.191.183.48:3000/login', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => {
        res.json().then(parsedRes => {
            console.log(parsedRes)
        })
    })
}

async function register(data) {
    await fetch('http://193.191.183.48:3000/register', {
        method: 'POST',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then(res => console.log(res))
}

/*  ======  FORM TO JSON OBJECT  ======  */

function formJSON(form){
    var unindexed_array = form.serializeArray();
    var indexed_array = {};

    $.map(unindexed_array, function(n, i){
        indexed_array[n['name']] = n['value'];
    });

    return indexed_array;
}