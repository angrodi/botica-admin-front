import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { Usuario } from '../../../../../../shared/interfaces/usuario.interface';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icLock from '@iconify/icons-ic/twotone-lock';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { CrearEditarEmpleadoComponent } from '../crear-editar-empleado/crear-editar-empleado.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UsuarioService } from 'src/app/core/services/usuario.service';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { CambiarPasswordComponent } from '../cambiar-password/cambiar-password.component';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-empleado',
  templateUrl: './tabla-empleado.component.html',
  styleUrls: ['./tabla-empleado.component.scss'],
  animations: [
    fadeInUp400ms,
    stagger40ms
  ],
  providers: [
    {
      provide: MAT_FORM_FIELD_DEFAULT_OPTIONS,
      useValue: {
        appearance: 'standard'
      } as MatFormFieldDefaultOptions
    }
  ]
})
export class TablaEmpleadoComponent implements OnInit, AfterViewInit {

  @Input()
  columns: TableColumn<Usuario>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Nombres', property: 'nombres', type: 'text', visible: false },
    { label: 'Apellidos', property: 'apellidos', type: 'text', visible: false },
    { label: 'DNI', property: 'dni', type: 'text', visible: true },
    { label: 'Email', property: 'email', type: 'text', visible: true },
    { label: 'Teléfono', property: 'telefono', type: 'text', visible: true },
    { label: 'Dirección', property: 'direccion', type: 'text', visible: false },
    { label: 'Rol', property: 'rolId', type: 'text', visible: false },
    { label: 'Estado', property: 'estado', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Usuario> | null;
  selection = new SelectionModel<Usuario>(true, []);
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icLock = icLock;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private usuarioService: UsuarioService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.cargarUsuarios();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  crearUsuario(): void {
    this.dialog.open(CrearEditarEmpleadoComponent, {
      data: {
        modo: 'crear'
      },
      width: '700px'
    }).afterClosed().subscribe((empleado: Usuario | null) => {
      if (!empleado) return;

      this.usuarioService.create(empleado).subscribe(
        response => {
          if (response.status === 201) {
            this.mostrarSnackbar('Empleado creado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al crear empleado', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al crear empleado', 'red-snackbar');
        },
        () => {
          this.cargarUsuarios();
        }
      );
    });
  }

  actualizarUsuario(usuario: Usuario): void {
    this.dialog.open(CrearEditarEmpleadoComponent, {
      data: {
        modo: 'editar',
        usuario
      },
      width: '700px'
    }).afterClosed().subscribe((empleado: Usuario | null) => {
      if (!empleado) return;

      this.usuarioService.update(usuario.id, usuario).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Empleado actualizado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar empleado', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al actualizar empleado', 'red-snackbar');
        },
        () => {
          this.cargarUsuarios();
        }
      );
    });
  }

  eliminarUsuario(usuario: Usuario): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar el empleado?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.usuarioService.delete(usuario.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Empleado eliminado', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar empleado', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar empleado', 'red-snackbar');
          },
          () => {
            this.cargarUsuarios();
          });
      } 
    });
  }

  actualizarContrasenia(usuario: Usuario): void {
    this.dialog.open(CambiarPasswordComponent, {
      data: {
        usuario
      },
      width: '700px'
    }).afterClosed().subscribe((empleado: Usuario | null) => {
      if (!empleado) return;

      this.usuarioService.update(empleado.id, empleado).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Contraseña actualizada', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar contraseña', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al actualizar contraseña', 'red-snackbar');
        },
        () => {
          this.cargarUsuarios();
        }
      );
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column, event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  private cargarUsuarios(): void {
    this.usuarioService.find()
      .subscribe(response => {
        this.dataSource.data = response.data;
      }, err => {
        this.dataSource.data = [];
      });
  }

  private mostrarSnackbar(mensaje: string, ...clases: string[]): void {
    this.snackbar.open(mensaje, 'OK', {
      duration: 3000,
      panelClass: clases
    });
  }
}


