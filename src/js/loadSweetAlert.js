export function showLoadingAlert(){
// Crear una instancia de SweetAlert
const swalWithProgress = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timerProgressBar: true,
    timer: 3000
  });
  
  // Iniciar la carga del archivo
  swalWithProgress.fire({
    title: 'Cargando archivo...',
    onOpen: () => {
      Swal.showLoading();
    }
  });
  
  // Simular el progreso de carga del archivo
  let progress = 0;
  let interval = setInterval(() => {
    progress += 10;
    Swal.update({
      title: 'Cargando archivo...',
      html: `Progreso: ${progress}%`,
      timerProgressBar: true,
      didOpen: () => {
        Swal.showLoading();
      },
      onClose: () => {
        clearInterval(interval);
      }
    });
    if (progress >= 100) {
      clearInterval(interval);
      Swal.fire({
        icon: 'success',
        title: 'Archivo cargado con éxito'
      });
    }
  }, 1000);

}
  