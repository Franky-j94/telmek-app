import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { SolicitudesServices } from '../../../services/solicitudes-services';
import { ToastHandler } from '../../../services/toast-handler';
import { SolicitudesEntity } from '../../../entities/solicitudes';
import { SwatHandler } from '../../../services/swat-handler';

@Component({
  selector: 'app-solicitudes',
  imports: [CommonModule, NgbModule, ReactiveFormsModule, MatCheckboxModule],
  templateUrl: './solicitudes.html',
  styleUrl: './solicitudes.css',
})
export class Solicitudes implements OnInit {

  public resourceForm!: FormGroup;
  public solId: number | null = null;
  public throw!: NgbModalRef;
  public rowsSolicitudes: SolicitudesEntity[] = [];
  public users: any[] = [];

  constructor(
    private modalService: NgbModal,
    private solicitudesService: SolicitudesServices,
    private cdr: ChangeDetectorRef,
    private toastService: ToastHandler,
    private swatHandlerService: SwatHandler
  ) {
    this.resourceForm = new FormGroup({
      nombre_solicitante: new FormControl(''),
      paterno_solicitante: new FormControl(''),
      materno_solicitante: new FormControl(''),
      //fecha_solicitud: new FormControl(''),
      activo: new FormControl(''),
      //user_id: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadSolicitudes();
    this.getUSers();
  }

  public loadSolicitudes() {
    this.solicitudesService.get().subscribe({
      next: (response: any) => {
        console.log('resp', response);
        this.rowsSolicitudes = response;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
        this.cdr.detectChanges();
      }
    });
  }

  public getUSers() {
    this.solicitudesService.getUsersVentas().subscribe({
      next: (response: any) => {
        console.log('resp', response);
        this.users = response?.data;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error(error);
      }
    });
  }
  private setInertContent(value: boolean): void {
    const mainContent = document.getElementById('main-content');
    if (mainContent) {
      if (value) {
        mainContent.setAttribute('inert', '');
      } else {
        mainContent.removeAttribute('inert');
      }
    }
  }

  throwAlert(content: any) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.setInertContent(true);
    this.throw = this.modalService.open(content, { centered: true, backdrop: 'static', keyboard: false });

    this.throw.result.finally(() => {
      this.setInertContent(false);
    });

  }

  closed() {
    this.throw.close();
    //this.setForm();
    this.setInertContent(false); // Desbloquear fondo
    setTimeout(() => {
      this.solId = null;
      this.cdr.detectChanges();
    }, 200);
  }

  edit(content: any, item: any) {
    this.solId = item.id;
    this.resourceForm.patchValue({
      nombre_solicitante: item.nombre_solicitante,
      paterno_solicitante: item.paterno_solicitante,
      materno_solicitante: item.materno_solicitante,
      //fecha_solicitud: item.fecha_solicitud,
      activo: item.activo,
      //user_id: item.user_id
    });
    this.throwAlert(content);
  }

  register(): void {
    let payload = {
      'nombre_solicitante': this.resourceForm.get('nombre_solicitante')?.value,
      'paterno_solicitante': this.resourceForm.get('paterno_solicitante')?.value,
      'materno_solicitante': this.resourceForm.get('materno_solicitante')?.value,
      //'fecha_solicitud': this.resourceForm.get('fecha_solicitud')?.value,
      'activo': this.resourceForm.get('activo')?.value,
      //'user_id': this.resourceForm.get('user_id')?.value
    };
    const request = this.solId ? this.solicitudesService.update(this.solId, payload) : this.solicitudesService.store(payload);
    request.subscribe({
      next: (response: any) => {
        console.log('resp', response);
        this.toastService.success('', "Registro guardado correctamente");
        this.loadSolicitudes();
        this.closed();
      },
      error: (error: any) => {
        console.error(error);
        this.toastService.error('', error?.error?.message || "Error al guardar el registro");
      }
    });

  }
  /*
    create() {
      let payload = {
        'nombre_solicitante': this.resourceForm.get('nombre_solicitante')?.value,
        'paterno_solicitante': this.resourceForm.get('paterno_solicitante')?.value,
        'materno_solicitante': this.resourceForm.get('materno_solicitante')?.value,
        //'fecha_solicitud': this.resourceForm.get('fecha_solicitud')?.value,
        'activo': this.resourceForm.get('activo')?.value,
        //'user_id': this.resourceForm.get('user_id')?.value
      };
      this.solicitudesService.store(payload).subscribe({
        next: (response: any) => {
          console.log('resp', response);
          this.toastService.success('', "Registro guardado correctamente");
          this.loadSolicitudes();
          this.closed();
        },
        error: (error: any) => {
          console.error(error);
          this.toastService.error('', error?.error?.message || "Error al guardar el registro");
        }
      });
      this.closed();
    }
  */
  /*update() {
    let payload = {
      'nombre_solicitante': this.resourceForm.get('nombre_solicitante')?.value,
      'paterno_solicitante': this.resourceForm.get('paterno_solicitante')?.value,
      'materno_solicitante': this.resourceForm.get('materno_solicitante')?.value,
      'fecha_solicitud': this.resourceForm.get('fecha_solicitud')?.value,
      'activo': this.resourceForm.get('activo')?.value,
      'user_id': this.resourceForm.get('user_id')?.value
    };
    this.solicitudesService.update(this.solId, payload).subscribe({
      next: (response: any) => {
        console.log('resp', response);
        this.toastService.success('', "Registro actualizado correctamente");
        this.loadSolicitudes();
        this.closed();
      },
      error: (error: any) => {
        console.error(error);
        this.toastService.error('', error?.error?.message || "Error al actualizar el registro");
      }
    });

  }*/

  onDestroy(id: any) {
    this.setInertContent(true); // Bloquear fondo
    console.log("id", id);
    this.swatHandlerService.confirmAlert(
      '¿Borrar registro?',
      '¿Estás seguro de borrar el registro?', 'Si', 'No'
    ).then((result) => {
      if (result.value) {
        //this.isLoading = true;
        this.solicitudesService.destroy(id).subscribe({
          next: () => {
            this.toastService.success("", 'El registro se eliminó correctamente');
            this.setInertContent(false); // Desbloquear fondo
            this.cdr.detectChanges();
            this.ngOnInit();
          },
          error: (error) => {
            console.error(error);
            //this.isLoading = false;
            this.setInertContent(false); // Desbloquear fondo
            this.cdr.detectChanges();
          }
        });
      } else {
        this.setInertContent(false); // Desbloquear fondo
      }
    });
  }

  cancelar(id: any) {
    this.setInertContent(true); // Bloquear fondo
    console.log("id", id);
    this.swatHandlerService.confirmAlert(
      '¿Cancelar registro?',
      '¿Estás seguro de cancelar el registro?', 'Si', 'No'
    ).then((result) => {
      if (result.value) {
        //this.isLoading = true;
        this.solicitudesService.cancelar(id).subscribe({
          next: () => {
            this.toastService.success("", 'El registro se canceló correctamente');
            this.setInertContent(false); // Desbloquear fondo
            this.cdr.detectChanges();
            this.ngOnInit();
          },
          error: (error) => {
            console.error(error);
            //this.isLoading = false;
            this.setInertContent(false); // Desbloquear fondo
            this.cdr.detectChanges();
          }
        });
      } else {
        this.setInertContent(false); // Desbloquear fondo
      }
    });
  }

}
