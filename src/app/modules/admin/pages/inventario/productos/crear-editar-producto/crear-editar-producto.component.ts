import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import icMoreVert from '@iconify/icons-ic/twotone-more-vert';
import icClose from '@iconify/icons-ic/twotone-close';
import icPrint from '@iconify/icons-ic/twotone-print';
import icDownload from '@iconify/icons-ic/twotone-cloud-download';
import icDelete from '@iconify/icons-ic/twotone-delete';

import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { Categoria } from 'src/app/shared/interfaces/categoria.interface';

@Component({
  selector: 'vex-crear-editar-producto',
  templateUrl: './crear-editar-producto.component.html',
  styleUrls: ['./crear-editar-producto.component.scss']
})
export class CrearEditarProductoComponent implements OnInit {

  modo: 'crear' | 'editar';
  form: FormGroup;
  producto: Producto;
  categorias: Categoria[];
  filePath: string;
  mostrarUrl: boolean;

  // Iconos
  icMoreVert = icMoreVert;
  icClose = icClose;

  icPrint = icPrint;
  icDownload = icDownload;
  icDelete = icDelete;

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: any,
    private dialogRef: MatDialogRef<CrearEditarProductoComponent>,
    private fb: FormBuilder,
    private categoriaService: CategoriaService
  ) {}

  ngOnInit(): void {
    this.modo = this.defaults.modo;

    if (this.defaults.producto) {
      this.modo = 'editar';
      this.producto = this.defaults.producto;
      this.mostrarUrl = true;
    } else {
      this.modo = 'crear';
      this.producto = {} as Producto;
      this.mostrarUrl = false;
    }

    this.form = this.fb.group({
      nombre      : [this.producto.nombre, [ Validators.required ]],
      descripcion : [this.producto.descripcion, [ Validators.required ]],
      precio      : [this.producto.precio, [ Validators.required, Validators.min(0) ]],
      stock       : [this.producto.stock, [ Validators.required, Validators.min(0) ]],
      estado      : [this.producto.estado, [ Validators.required ]],
      imagen      : [this.producto.imagen, [ Validators.required ]],
      categoriaId : [this.producto.categoriaId, [ Validators.required ]]
    });

    // Cargar categorías con estado activo
    this.categoriaService.find()
      .subscribe(response => {
        this.categorias = response.data;
        this.categorias = this.categorias.filter(c => c.estado === 1);
      }, err => {
        this.categorias = [];
      });
  }

  guardar(): void {
    if (this.modo === 'crear') {
      this.crearProducto();
    } else if (this.modo === 'editar') {
      this.actualizarProducto();
    }
  }

  crearProducto(): void {
    let formData = new FormData();
    
    Object.keys(this.form.controls).forEach(key => {
      formData.append(key, this.form.get(key).value);
    });

    this.dialogRef.close(formData);
  }

  actualizarProducto(): void {
    let formData = new FormData();
    
    Object.keys(this.form.controls).forEach(key => {
      formData.append(key, this.form.get(key).value);
    });

    this.dialogRef.close(formData);
  }

  esModoCrear(): boolean {
    return this.modo === 'crear';
  }

  esModoEditar(): boolean {
    return this.modo === 'editar';
  }

  uploadFile(event: any): void {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({
      imagen: file
    });
    this.form.get('imagen').updateValueAndValidity();

    const reader = new FileReader();
    reader.onload = () => {
      this.filePath = reader.result as string;
    };
    reader.readAsDataURL(file);

    this.mostrarUrl = false;
  }

  errorCampoRequerido(campo: string): boolean {
    return this.form.get(campo).errors?.required && this.form.get(campo).touched;
  }

  errorCampoPositivo(campo: string): boolean {
    return this.form.get(campo).errors?.min && this.form.get(campo).touched;
  }

}
