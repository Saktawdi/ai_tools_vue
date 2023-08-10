const Swal = require('sweetalert2')
/*
0：error
1:success
2.notic
3.question
4.loading...
99.normal
-1.close
*/
export function showAlter(msg, type) {
  if (type === -1) {
    Swal.close();
  }
  if (type === 0) {
    Swal.fire({
      icon: 'error',
      title: 'Oops...',
      text: msg,
    })
  } else if (type === 1) {
    Swal.fire(
      'success!',
      msg,
      'success'
    )
  } else if (type === 2) {
    Swal.fire({
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      type: 'success',
      title: msg
    })
  } else if (type === 3) {
    Swal.fire(
      '???',
      msg,
      'question'
    )
  } else if (type === 4) {
    return Swal.fire({
      title: "请等待...",
      text: msg,
      icon: "info",
      buttons: false,
      showConfirmButton: false,
      showCloseButton: false,
      closeOnClickOutside: false,
      showCancelButton: false,
      allowOutsideClick: false,
      isDismissed: true
    });
  }else if(type === 5){
    return Swal.fire({
      text:msg,
      buttons: false,
      showConfirmButton: false,
      showCloseButton: false,
      closeOnClickOutside: false,
      showCancelButton: false,
      allowOutsideClick: false,
      isDismissed: true,
      didOpen(){
        Swal.showLoading();
      }
    })
  } 
  else if (type === 99) {
    Swal.fire({
      text: msg,
      buttons: false
    })
  }
}