const url = 'http://localhost:3000'

$(".registerForm").hide()
$(".loginForm").hide()
$("#content").hide()

function registerForm() {
  $(".loginForm").hide()
  $(".registerForm").show()
}

function signIn() {
  $(".registerForm").hide()
  $(".loginForm").show()
}


function onSignIn(googleUser) {
  var profile = googleUser.getBasicProfile();
  var id_token = googleUser.getAuthResponse().id_token;
  console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
  console.log('Name: ' + profile.getName());
  console.log('Image URL: ' + profile.getImageUrl());
  console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.

  axios.post(`http://localhost:3000/auth`, {
    idToken: id_token
  })
  .then(function(response) {
    localStorage.setItem("token", response.data.token)
    localStorage.setItem("id", response.data.id)
  })
  .catch(function(error) {
    console.log(error.message);
  })
}

function signOut() {
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
    localStorage.removeItem("token")
    localStorage.removeItem("payload")
    $("#content").hide()
    $("#form").show()
    swal("Yeaaay","You Have Successfully Signed Out", "success");
}


function register() {
  axios.post(`${url}/users`, {
    name: $("#inputName").val(),
    email: $("#inputEmail").val(),
    password: $("#inputPassword").val()
  })
    .then(function (response) {
      swal("Yeaaay","Account created", "success");
      loginForm()
      console.log(response.data);
    })
    .catch(function (error) {
      swal("Oops",`${error.message}`, "error");
      console.log(error.message);
    });
}

function signin() {
  axios.post(`${url}/users/signin`, {
    email: $("#inputEmailLogin").val(),
    password: $("#inputPasswordLogin").val()
  })
    .then(function (response) {
      $("#form").hide()
      swal("Yeaaay","You Have Successfully Signed In", "success");
      console.log(response.data);
      localStorage.setItem("token", response.data.token)
      localStorage.setItem("id", response.data.id)
      loadTodos()
    })
    .catch(function (error) {
      swal("Oops","Wrong username or password", "error");
      console.log(error.message);
    });
}

function loadTodos() {
  $("#content").show()
  var token = localStorage.getItem('token');
  var userId = localStorage.getItem('id');
  axios.get(`${url}/todos/personal/${userId}`, {
    token: token,
  })
    .then(function(response) {
      console.log(response.data);
      $(".personalTodoUncomplete").html("")
      $(".personalTodoComplete").html("")
      response.data.forEach(function(todo) {
        if (todo.status == "Uncomplete") {
          $(".personalTodoUncomplete").append(
            `
              <div class="card text-white bg-info mb-3" style="max-width: 20rem;">
                <div class="card-header">${todo.status}</div>
                <div class="card-body">
                <h4 class="card-title">${todo.name}</h4>
                <p class="card-text">${todo.due_date}</p></br>
                <p class="card-text">${todo.description}</p><br>
                <input type="button" class="btn btn-success" onclick="completeTodo('${todo._id}')" value="Complete"></input>
                <input type="button" class="btn btn-danger" onclick="deleteTodo('${todo._id}')" value="Delete"></input
                </div>
              </div>
            `
          )
        }
        else if (todo.status == "Completed") {
          $(".personalTodoComplete").append(
            `
              <div class="card text-white bg-success mb-3" style="max-width: 20rem;">
                <div class="card-header">${todo.status}</div>
                <div class="card-body">
                <h4 class="card-title">${todo.name}</h4>
                <p class="card-text">${todo.due_date}</p></br>
                <p class="card-text">${todo.description}</p></br>
                <input type="button" class="btn btn-success" onclick="uncompleteTodo('${todo._id}')" value="Uncomplete"></input>
                <input type="button" class="btn btn-danger" onclick="deleteTodo('${todo._id}')" value="Delete"></input
                </div>
              </div>
            `
          )
        }
      })
    })
    .catch(function(error) {
      console.log(error.message);
    })
}

function createTodo() {
  var token = localStorage.getItem('token');
  axios.post(`${url}/todos`, {
    token: token,
    name: $("#InputNameTodoPersonal").val(),
    description: $("#InputDescriptionTodoPersonal").val(),
    due_date: $("#InputDateTodoPersonal").val()
  })
  .then(function(response) {
    swal("Yeaaay","You Have Successfully Created New Todo", "success");
    loadTodos()
  })
  .catch(function(error) {
    swal("Oops",`${error.message}`, "error");
    console.log(error);
  })
}

function completeTodo(id) {
  var token = localStorage.getItem('token');
  axios.patch(`${url}/todos/${id}`, {
    status: "Completed",
    token: token
  })
  .then(function(response) {
    loadTodos()
    swal("Yeaaay","You Have Successfully Completed Todo", "success");
  })
  .catch(function(error) {
    swal("Oops",`${error.message}`, "error");
    console.log(error.message);
  })
}

function uncompleteTodo(id) {
  var token = localStorage.getItem('token');
  axios.patch(`${url}/todos/${id}`, {
    status: "Uncomplete",
    token: token
  })
  .then(function(response) {
    loadTodos()
    swal("Yeaaay","You Have Successfully Uncompleted Todo", "success");
  })
  .catch(function(error) {
    swal("Oops",`${error.message}`, "error");
    console.log(error.message);
  })
}

function deleteTodo(id) {
  var token = localStorage.getItem('token');
  axios.delete(`${url}/todos/${id}`)
  .then(function(response) {
    loadTodos()
    swal("Yeaaay","You Have Successfully Delete Todo", "success");
  })
  .catch(function(error) {
    swal("Oops",`${error.message}`, "error");
    console.log(error.message);
  })
}

