import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgbModal, NgbModalRef } from "@ng-bootstrap/ng-bootstrap";
import { ConfiguracionCargaService } from '../../../services/configuracion-carga-service';
import { ConfiguracionCargaEntity } from '../../../entities/configuracion-carga';
import { ToastHandler } from '../../../services/toast-handler';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SwatHandler } from '../../../services/swat-handler';

@Component({
  selector: 'app-configuracion-carga',
  imports: [MatCheckboxModule, ReactiveFormsModule, CommonModule],
  templateUrl: './configuracion-carga.html',
  styleUrl: './configuracion-carga.css',
})
export class ConfiguracionCarga implements OnInit {

  public resourceForm!: FormGroup;
  public confcarId: number | null = null;
  public throw!: NgbModalRef;
  public rowsConfiguracionCarga: ConfiguracionCargaEntity[] = [];

  constructor(
    public modalService: NgbModal,
    private configuracionCargaService: ConfiguracionCargaService,
    public cdr: ChangeDetectorRef,
    public toastService: ToastHandler,
    public swatHandlerService: SwatHandler
  ) {
    this.resourceForm = new FormGroup({
      proporcion: new FormControl(''),
      diferencia: new FormControl(''),
      anio: new FormControl(''),
      estatus: new FormControl('')
    });
  }

  ngOnInit(): void {
    this.loadConfiguracionCarga();
  }

  private loadConfiguracionCarga(): void {
    this.configuracionCargaService.get().subscribe(
      (response: any) => {
        this.rowsConfiguracionCarga = response;
        this.cdr.detectChanges();
      },
      (error: any) => {
        this.toastService.error('', error);
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }

  // Bloquea el contenido del fondo
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
  public throwAlert(content: any) {
    if (document.activeElement instanceof HTMLElement) {
      document.activeElement.blur();
    }
    this.setInertContent(true);
    this.throw = this.modalService.open(content, { centered: true, size: 'md', backdrop: 'static', keyboard: false });
    this.throw.result.finally(() => {
      this.setInertContent(false);
    });
  }

  public closed(): void {
    this.throw.close();
    //this.setForm();
    this.setInertContent(false); // Desbloquear fondo
    setTimeout(() => {
      this.confcarId = null;
      this.cdr.detectChanges();
    }, 200);

  }
  public register(): void {
    const payload = {
      proporcion: this.resourceForm.get('proporcion')?.value,
      diferencia: this.resourceForm.get('diferencia')?.value,
      anio: this.resourceForm.get('anio')?.value,
      activo: this.resourceForm.get('estatus')?.value ? 1 : 0
    };

    const request = this.confcarId ? this.configuracionCargaService.update(this.confcarId, payload) : this.configuracionCargaService.store(payload);
    request.subscribe(
      (response: any) => {
        this.toastService.success('', "Registro guardado correctamente");
        this.loadConfiguracionCarga();
        this.closed();
      },
      (error: any) => {
        this.toastService.error('', error?.error?.message || "Error al guardar el registro");
        console.log(error);
        this.cdr.detectChanges();
      }
    );
  }

  public edit(content: any, payload: any): void {
    this.throwAlert(content);
    this.confcarId = payload.id;
    setTimeout(() => {
      this.resourceForm.patchValue(payload);
      this.cdr.detectChanges();
    }, 100);
  }

  public onDestroy(id: any): void {
    this.setInertContent(true); // Bloquear fondo
    console.log("id", id);
    this.swatHandlerService.confirmAlert(
      '¿Borrar registro?',
      '¿Estás seguro de borrar el registro?', 'Si', 'No'
    ).then((result) => {
      if (result.value) {
        //this.isLoading = true;
        this.configuracionCargaService.destroy(id).subscribe({
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

}
