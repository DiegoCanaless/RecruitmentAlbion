let perfiles = [];
let perfilActual = null;
let modoEdicion = false;
let isAdmin = false;

// Cambia todo el acceso a la API por localStorage
const STORAGE_KEY = "albion_perfiles";

function guardarPerfilesEnLocal() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(perfiles));
}

function cargarPerfilesDesdeLocal() {
  try {
    perfiles = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    perfiles = [];
  }
  cargarPerfiles();
}

// -- El resto de funciones trabajan igual pero usando localStorage --

document.addEventListener('DOMContentLoaded', function () {
  // Verificar si ya está autenticado
  isAdmin = localStorage.getItem('isAdmin') === 'true';
  if (isAdmin) {
    document.getElementById('loginView').classList.remove('active');
    document.getElementById('appView').classList.add('active');
    document.getElementById('userDisplay').textContent = "Administrador";
  }

  // Evento para subir imagen
  document.getElementById('imageUpload').addEventListener('click', function () {
    document.getElementById('characterImage').click();
  });

  // Evento para mostrar vista previa de la imagen
  document.getElementById('characterImage').addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        const preview = document.getElementById('imagePreview');
        preview.src = event.target.result;
        preview.style.display = 'block';
      }
      reader.readAsDataURL(file);
    }
  });

  document.getElementById('searchInput').addEventListener('input', function () {
    buscarPerfiles(this.value);
  });

  document.getElementById('saveButton').addEventListener('click', guardarPerfil);
  document.getElementById('updateButton').addEventListener('click', actualizarPerfil);

  cargarPerfilesDesdeLocal();
});

document.querySelectorAll('.nav-menu li').forEach(item => {
  item.addEventListener('click', function (e) {
    e.stopPropagation();
    document.querySelectorAll('.nav-menu li').forEach(li => li.classList.remove('active'));
    this.classList.add('active');
    document.querySelectorAll('.content-panel .section').forEach(section => section.classList.remove('active'));
    const sectionId = this.getAttribute('data-section') + 'Section';
    document.getElementById(sectionId).classList.add('active');
  });
});

function login() {
  const username = document.getElementById('usernameInput').value.trim().toLowerCase();
  const errorElement = document.getElementById('loginError');
  if (username !== 'admin') {
    errorElement.style.display = 'block';
    return;
  }
  errorElement.style.display = 'none';
  isAdmin = true;
  localStorage.setItem('isAdmin', 'true');
  document.getElementById('loginView').classList.remove('active');
  document.getElementById('appView').classList.add('active');
  document.getElementById('userDisplay').textContent = "Administrador";
}

function logout() {
  document.getElementById('appView').classList.remove('active');
  document.getElementById('loginView').classList.add('active');
  isAdmin = false;
  localStorage.removeItem('isAdmin');
  document.getElementById('usernameInput').value = '';
}

function mostrarFormulario() {
  if (!isAdmin) {
    alert('Solo el administrador puede crear nuevos reclutas');
    return;
  }
  modoEdicion = false;
  document.getElementById('formularioEntrevista').style.display = 'block';
  document.getElementById('listaPerfiles').style.display = 'none';
  document.getElementById('perfilDetalle').style.display = 'none';
  document.getElementById('formTitle').textContent = 'Nuevo Recluta';
  document.getElementById('saveButton').style.display = 'flex';
  document.getElementById('updateButton').style.display = 'none';
  document.getElementById('nombre').value = '';
  document.getElementById('famaPvP').value = '';
  document.getElementById('famaPvE').value = '';
  document.getElementById('p1_edad').value = '';
  document.getElementById('p2_plataforma').value = '';
  document.getElementById('p3_microfono').value = '';
  document.getElementById('p4_gremio_anterior').value = '';
  document.getElementById('p5_contenidos').value = '';
  document.getElementById('p6_actividades').value = '';
  document.getElementById('p7_economia').value = '';
  document.getElementById('p8_grabar').value = '';
  document.getElementById('imagePreview').style.display = 'none';
  document.getElementById('characterImage').value = '';
}

function ocultarFormulario() {
  document.getElementById('formularioEntrevista').style.display = 'none';
  document.getElementById('listaPerfiles').style.display = 'block';
}

function mostrarDetallePerfil(perfil) {
  document.getElementById('listaPerfiles').style.display = 'none';
  document.getElementById('perfilDetalle').style.display = 'block';
  perfilActual = perfil;
  document.getElementById('detalleNombre').textContent = perfil.nombre;
  document.getElementById('detalleFamaPvP').textContent = perfil.famaPvP.toLocaleString();
  document.getElementById('detalleFamaPvE').textContent = perfil.famaPvE.toLocaleString();
  const imagenDetalle = document.getElementById('detalleImagen');
  if (perfil.imagen) {
    imagenDetalle.src = perfil.imagen;
    imagenDetalle.style.display = 'block';
  } else {
    imagenDetalle.style.display = 'none';
  }
  document.getElementById('detalleP1').textContent = perfil.respuestas.p1_edad;
  document.getElementById('detalleP2').textContent = perfil.respuestas.p2_plataforma;
  document.getElementById('detalleP3').textContent = perfil.respuestas.p3_microfono;
  document.getElementById('detalleP4').textContent = perfil.respuestas.p4_gremio_anterior || 'Ninguno';
  document.getElementById('detalleP8').textContent = perfil.respuestas.p8_grabar;
  document.getElementById('detalleP5').querySelector('p').textContent = perfil.respuestas.p5_contenidos || '-';
  document.getElementById('detalleP6').querySelector('p').textContent = perfil.respuestas.p6_actividades || '-';
  document.getElementById('detalleP7').querySelector('p').textContent = perfil.respuestas.p7_economia || '-';
}

function ocultarDetalle() {
  document.getElementById('perfilDetalle').style.display = 'none';
  document.getElementById('listaPerfiles').style.display = 'block';
}

function editarPerfil() {
  if (!perfilActual) return;
  if (!isAdmin) {
    alert('Solo el administrador puede editar reclutas');
    return;
  }
  modoEdicion = true;
  document.getElementById('formularioEntrevista').style.display = 'block';
  document.getElementById('perfilDetalle').style.display = 'none';
  document.getElementById('formTitle').textContent = 'Editar Recluta';
  document.getElementById('saveButton').style.display = 'none';
  document.getElementById('updateButton').style.display = 'flex';
  document.getElementById('nombre').value = perfilActual.nombre;
  document.getElementById('famaPvP').value = perfilActual.famaPvP;
  document.getElementById('famaPvE').value = perfilActual.famaPvE;
  document.getElementById('p1_edad').value = perfilActual.respuestas.p1_edad;
  document.getElementById('p2_plataforma').value = perfilActual.respuestas.p2_plataforma;
  document.getElementById('p3_microfono').value = perfilActual.respuestas.p3_microfono;
  document.getElementById('p4_gremio_anterior').value = perfilActual.respuestas.p4_gremio_anterior || '';
  document.getElementById('p5_contenidos').value = perfilActual.respuestas.p5_contenidos || '';
  document.getElementById('p6_actividades').value = perfilActual.respuestas.p6_actividades || '';
  document.getElementById('p7_economia').value = perfilActual.respuestas.p7_economia || '';
  document.getElementById('p8_grabar').value = perfilActual.respuestas.p8_grabar || '';
  const preview = document.getElementById('imagePreview');
  if (perfilActual.imagen) {
    preview.src = perfilActual.imagen;
    preview.style.display = 'block';
  } else {
    preview.style.display = 'none';
  }
}

function guardarPerfil() {
  if (!isAdmin) {
    alert('Solo el administrador puede crear nuevos reclutas');
    return;
  }
  const nombre = document.getElementById('nombre').value;
  const famaPvP = parseInt(document.getElementById('famaPvP').value) || 0;
  const famaPvE = parseInt(document.getElementById('famaPvE').value) || 0;
  const fileInput = document.getElementById('characterImage');
  const preview = document.getElementById('imagePreview');
  let imagen = '';
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagen = e.target.result;
      guardarPerfilCompleto(nombre, famaPvP, famaPvE, imagen);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else if (preview.style.display === 'block') {
    imagen = preview.src;
    guardarPerfilCompleto(nombre, famaPvP, famaPvE, imagen);
  } else {
    guardarPerfilCompleto(nombre, famaPvP, famaPvE, imagen);
  }
}

function guardarPerfilCompleto(nombre, famaPvP, famaPvE, imagen) {
  const respuestas = {
    p1_edad: document.getElementById('p1_edad').value,
    p2_plataforma: document.getElementById('p2_plataforma').value,
    p3_microfono: document.getElementById('p3_microfono').value,
    p4_gremio_anterior: document.getElementById('p4_gremio_anterior').value,
    p5_contenidos: document.getElementById('p5_contenidos').value,
    p6_actividades: document.getElementById('p6_actividades').value,
    p7_economia: document.getElementById('p7_economia').value,
    p8_grabar: document.getElementById('p8_grabar').value
  };
  if (!nombre || !famaPvP || !famaPvE || !respuestas.p1_edad || !respuestas.p2_plataforma) {
    return alert('Por favor completa los campos obligatorios');
  }
  const nuevoPerfil = {
    id: Date.now(),
    nombre,
    famaPvP,
    famaPvE,
    imagen,
    respuestas
  };
  perfiles.push(nuevoPerfil);
  guardarPerfilesEnLocal();
  alert('Recluta guardado exitosamente');
  ocultarFormulario();
  cargarPerfilesDesdeLocal();
}

function actualizarPerfil() {
  if (!perfilActual) return;
  if (!isAdmin) {
    alert('Solo el administrador puede editar reclutas');
    return;
  }
  const nombre = document.getElementById('nombre').value;
  const famaPvP = parseInt(document.getElementById('famaPvP').value) || 0;
  const famaPvE = parseInt(document.getElementById('famaPvE').value) || 0;
  const fileInput = document.getElementById('characterImage');
  const preview = document.getElementById('imagePreview');
  let imagen = perfilActual.imagen;
  if (fileInput.files.length > 0) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imagen = e.target.result;
      actualizarPerfilCompleto(nombre, famaPvP, famaPvE, imagen);
    };
    reader.readAsDataURL(fileInput.files[0]);
  } else {
    actualizarPerfilCompleto(nombre, famaPvP, famaPvE, imagen);
  }
}

function actualizarPerfilCompleto(nombre, famaPvP, famaPvE, imagen) {
  const respuestas = {
    p1_edad: document.getElementById('p1_edad').value,
    p2_plataforma: document.getElementById('p2_plataforma').value,
    p3_microfono: document.getElementById('p3_microfono').value,
    p4_gremio_anterior: document.getElementById('p4_gremio_anterior').value,
    p5_contenidos: document.getElementById('p5_contenidos').value,
    p6_actividades: document.getElementById('p6_actividades').value,
    p7_economia: document.getElementById('p7_economia').value,
    p8_grabar: document.getElementById('p8_grabar').value
  };
  if (!nombre || !famaPvP || !famaPvE || !respuestas.p1_edad || !respuestas.p2_plataforma) {
    return alert('Por favor completa los campos obligatorios');
  }
  perfilActual.nombre = nombre;
  perfilActual.famaPvP = famaPvP;
  perfilActual.famaPvE = famaPvE;
  perfilActual.imagen = imagen;
  perfilActual.respuestas = respuestas;
  // Actualizar el array
  const idx = perfiles.findIndex(p => p.id === perfilActual.id);
  if (idx !== -1) perfiles[idx] = perfilActual;
  guardarPerfilesEnLocal();
  alert('Perfil actualizado exitosamente');
  ocultarFormulario();
  cargarPerfilesDesdeLocal();
}

function eliminarPerfil() {
  if (!perfilActual || !confirm('¿Estás seguro de eliminar este perfil permanentemente?')) {
    return;
  }
  if (!isAdmin) {
    alert('Solo el administrador puede eliminar reclutas');
    return;
  }
  perfiles = perfiles.filter(p => p.id !== perfilActual.id);
  guardarPerfilesEnLocal();
  alert('Perfil eliminado correctamente');
  ocultarDetalle();
  cargarPerfilesDesdeLocal();
}

function buscarPerfiles(termino) {
  const textoBusqueda = termino.toLowerCase().trim();
  if (!textoBusqueda) {
    cargarPerfiles();
    return;
  }
  const resultados = perfiles.filter(perfil =>
    perfil.nombre.toLowerCase().includes(textoBusqueda)
  );
  mostrarResultadosBusqueda(resultados);
}

function mostrarResultadosBusqueda(resultados) {
  const perfilesContainer = document.getElementById('perfilesContainer');
  perfilesContainer.innerHTML = '';
  if (resultados.length === 0) {
    perfilesContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <i class="fas fa-search" style="font-size: 4rem; color: var(--albion-gold); margin-bottom: 20px;"></i>
        <h3>No se encontraron reclutas</h3>
        <p>Intenta con otro término de búsqueda</p>
      </div>
    `;
    return;
  }
  resultados.forEach(perfil => {
    const perfilElement = document.createElement('div');
    perfilElement.className = 'perfil-card';
    perfilElement.onclick = () => mostrarDetallePerfil(perfil);
    let botones = '';
    if (isAdmin) {
      botones = `
        <button class="edit-btn" onclick="event.stopPropagation(); editarPerfilDirecto(${perfil.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="event.stopPropagation(); eliminarPerfilDirecto(${perfil.id})">
          <i class="fas fa-trash"></i>
        </button>
      `;
    }
    perfilElement.innerHTML = `
      ${botones}
      <h3>${perfil.nombre}</h3>
      <div class="perfil-info">
        <strong>Fama PvP:</strong>
        <span>${perfil.famaPvP.toLocaleString()}</span>
      </div>
      <div class="perfil-info">
        <strong>Fama PvE:</strong>
        <span>${perfil.famaPvE.toLocaleString()}</span>
      </div>
    `;
    perfilesContainer.appendChild(perfilElement);
  });
}

function editarPerfilDirecto(id) {
  const perfil = perfiles.find(p => p.id === id);
  if (!perfil) return;
  perfilActual = perfil;
  editarPerfil();
}

function cargarPerfiles() {
  const perfilesContainer = document.getElementById('perfilesContainer');
  perfilesContainer.innerHTML = '';
  if (perfiles.length === 0) {
    perfilesContainer.innerHTML = `
      <div style="text-align: center; padding: 40px; grid-column: 1 / -1;">
        <i class="fas fa-users-slash" style="font-size: 4rem; color: var(--albion-gold); margin-bottom: 20px;"></i>
        <h3>No hay reclutas registrados</h3>
        <p>Comienza agregando un nuevo recluta</p>
      </div>
    `;
    return;
  }
  perfiles.forEach(perfil => {
    const perfilElement = document.createElement('div');
    perfilElement.className = 'perfil-card';
    perfilElement.onclick = () => mostrarDetallePerfil(perfil);
    let botones = '';
    if (isAdmin) {
      botones = `
        <button class="edit-btn" onclick="event.stopPropagation(); editarPerfilDirecto(${perfil.id})">
          <i class="fas fa-edit"></i>
        </button>
        <button class="delete-btn" onclick="event.stopPropagation(); eliminarPerfilDirecto(${perfil.id})">
          <i class="fas fa-trash"></i>
        </button>
      `;
    }
    perfilElement.innerHTML = `
      ${botones}
      <h3>${perfil.nombre}</h3>
      <div class="perfil-info">
        <strong>Fama PvP:</strong>
        <span>${perfil.famaPvP.toLocaleString()}</span>
      </div>
      <div class="perfil-info">
        <strong>Fama PvE:</strong>
        <span>${perfil.famaPvE.toLocaleString()}</span>
      </div>
    `;
    perfilesContainer.appendChild(perfilElement);
  });
}

function eliminarPerfilDirecto(id) {
  if (!confirm('¿Estás seguro de eliminar este perfil permanentemente?')) {
    return;
  }
  if (!isAdmin) {
    alert('Solo el administrador puede eliminar reclutas');
    return;
  }
  perfiles = perfiles.filter(p => p.id !== id);
  guardarPerfilesEnLocal();
  alert('Perfil eliminado correctamente');
  cargarPerfilesDesdeLocal();
}