import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root',
})
export class SwatHandler {
  constructor() { }

  public default(body: string) {
    Swal.fire("", body);
  }

  public success(title: string, body: string) {
    Swal.fire(title, body, "success");
  }

  public error(title: string, body: string) {
    Swal.fire(title, body, "error");
  }

  public warning(title: string, body: string) {
    Swal.fire(title, body, "warning");
  }

  public info(title: string, body: string) {
    Swal.fire(title, body, "info");
  }
  public confirmAlert(
    title: string,
    body: string,
    confirmButtonText: string,
    cancelButtonText: string
  ) {
    return Swal.fire({
      title: title,
      icon: 'question',
      html: body,
      showCloseButton: false,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      showCancelButton: true,
      focusConfirm: true,
      confirmButtonText: confirmButtonText,
      cancelButtonText: cancelButtonText
    })
  }
}
