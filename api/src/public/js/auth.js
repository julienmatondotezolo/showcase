"use strict";

$(".login-form").submit(function (e) {
  e.preventDefault();
  let formdata = formJSON($(this));
  login(formdata);
});

$(".register-form").submit(function (e) {
  e.preventDefault();
  let formdata = formJSON($(this));
  register(formdata);
});

async function login(data) {
  await fetch("login", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status == 200) {
      window.location.replace("/upload/");
    } else if (res.status == 400) {
      alert("E-mail or password problem.");
    } else {
      alert("Error, please try later.");
    }

    /*     res.json().then((parsedRes) => {
      console.log(parsedRes);
    }); */

    //window.location.replace("http://localhost:3000/upload/");
  });
}

async function register(data) {
  await fetch("/register", {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  }).then((res) => {
    if (res.status == 200) {
      window.location.replace("/login");
    } else if (res.status == 403) {
      alert("E-mail already exists");
    } else if (res.status == 500) {
      res.json().then((res) => {
        alert(res.message);
      });
    } else {
      alert("Error, please try later.");
    }
  });
}

/*  ======  FORM TO JSON OBJECT  ======  */

function formJSON(form) {
  var unindexed_array = form.serializeArray();
  var indexed_array = {};

  $.map(unindexed_array, function (n, i) {
    indexed_array[n["name"]] = n["value"];
  });

  return indexed_array;
}
