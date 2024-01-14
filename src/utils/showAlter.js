const Swal = require('sweetalert2')
/*
0：error
1:success
2.top-success
3.question
4.top-notic
5.loading...
6.确定弹窗，1确定0取消
99.normal
-1.close
*/
export function showAlter(msg, type = 99) {
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
      toast: true,
      position: 'top-end',
      showConfirmButton: false,
      timer: 3000,
      type: 'success',
      title: msg,
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
  else if (type === 6) {
    return Swal.fire({
      title: '确定提示',  
      text: msg,               // 弹窗的文本内容，传入的 msg 参数
      icon: 'warning',         // 弹窗的图标类型，这里是一个警告图标
      showCancelButton: true,  // 显示 "取消" 按钮
      confirmButtonColor: '#3085d6',  // "确定" 按钮的颜色
      cancelButtonColor: '#d33',      // "取消" 按钮的颜色
      confirmButtonText: 'Yes',       // "确定" 按钮的文本
      cancelButtonText: 'No'          // "取消" 按钮的文本
    }).then((result) => {
      if (result.isConfirmed) {
        // 如果用户点击 "确定"，返回 1
        return 1;
      } else {
        // 如果用户点击 "取消"，返回 0
        return 0;
      }
    });
  }
  else if (type === 99) {
    Swal.fire({
      text: msg,
      buttons: false
    })
  }
}