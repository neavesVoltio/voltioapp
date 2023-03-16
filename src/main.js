

function load_view(view) {
  try {
    document.getElementById("app").innerHTML='<object type="text/html" data="src/views/'+ view + '.html" width="100%" height="100%" ></object>';  
  } catch (error) {
    document.getElementById("app").innerHTML='<object type="text/html" data="../src/views/'+ view + '.html" width="100%" height="100%" ></object>';  
  }


  
  

}

function onLoadPage(){
  console.log('loadPage');
  document.getElementById("app").innerHTML='<object type="text/html" data="views/login.html" width="100%" height="100%" ></object>';
}

/*
window.addEventListener("keydown", function(event) {
  console.log(event.code);
    if (event.shiftLeft
       + event.code === "KeyE")
    {
      event.preventDefault();
        alert('Alt + X pressed!');
    }
});
*/