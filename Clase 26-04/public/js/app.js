function fetchData() {
    fetch("http://127.0.0.1:5500/public/resources/users.json")
      .then(response => response.json())
      .then(data => {
        localStorage.setItem("usuarios", JSON.stringify(data));
        retrieveData();
      })
      .catch(error => {
        console.error(error);
      });
  }
  //dejen esta vaina quieto no se ni como lo arregle xd -Luis
  function retrieveData() {
    let usuarios = localStorage.getItem("usuarios");
    let tabla = document.getElementById("tabla");
    usuarios = JSON.parse(usuarios);
  

    let search = document.querySelector('input[type="search"]').value.toLowerCase();
  
    let radioActivo = document.querySelector('input[name="Estado"][value="Si"]').checked;
    let radioInactivo = document.querySelector('input[name="Estado"][value="No"]').checked;
  
    tabla.innerHTML = "";
  
    usuarios["usuarios"].forEach(usuario => {
      
      let matchText = usuario.nombre.toLowerCase().includes(search) ||
                      usuario.email.toLowerCase().includes(search);
  
    
      let matchEstado = true;
      if (radioActivo) {
        matchEstado = usuario.activo === true;
      } else if (radioInactivo) {
        matchEstado = usuario.activo === false;
      }
      
      
      if (matchText && matchEstado) {
        tabla.innerHTML += `
          <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
          </tr>`;
      }
    });
  }
  
  document.querySelector('input[type="search"]').addEventListener("input", retrieveData);
  document.querySelectorAll('input[name="Estado"]').forEach(radio => {
    radio.addEventListener("change", retrieveData);
  });
  //gracias jonnhy por:
  fetchData();
  