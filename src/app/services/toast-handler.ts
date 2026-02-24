import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ToastHandler {
  constructor(private notificationService: ToastrService) { }

  public success(title: string, body: string) {
    this.notificationService.success(body, title);
  }

  public error(title: string, body: string) {
    this.notificationService.error(body, title);
  }

  public warning(title: string, body: string) {
    this.notificationService.warning(body, title);
  }

  public info(title: string, body: string) {
    this.notificationService.info(body, title);
  }
}
