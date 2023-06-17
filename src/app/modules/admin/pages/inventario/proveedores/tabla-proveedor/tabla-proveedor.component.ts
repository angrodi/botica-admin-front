import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { Proveedor } from 'src/app/shared/interfaces/proveedor.interface';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CrearEditarProveedorComponent } from '../crear-editar-proveedor/crear-editar-proveedor.component';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProveedorService } from 'src/app/core/services/proveedor.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-proveedor',
  templateUrl: './tabla-proveedor.component.html',
  styleUrls: ['./tabla-proveedor.component.scss'],
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
export class TablaProveedorComponent implements OnInit {

  userLoggedIsAdmin: boolean = false;

  @Input()
  columns: TableColumn<Proveedor>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'RUC', property: 'ruc', type: 'text', visible: true },
    { label: 'Dirección', property: 'direccion', type: 'text', visible: true },
    { label: 'Teléfono', property: 'telefono', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Proveedor> | null;
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private proveedorService: ProveedorService,
    private snackbar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    // Cargar categorias
    this.cargarProveedores();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
    
    // Verificar si el usuario es admin
    this.userLoggedIsAdmin = this.tokenService.userLoggedIsAdmin();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  crearProveedor(): void {
    this.dialog.open(CrearEditarProveedorComponent, {
      data: {
        modo: 'crear'
      },
      width: '600px'
    }).afterClosed().subscribe((proveedor: Proveedor | null) => {
      if (!proveedor) return;

      this.proveedorService.create(proveedor).subscribe(
        response => {
          if (response.status === 201) {
            this.mostrarSnackbar('Proveedor creado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al crear proveedor', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al crear proveedor', 'red-snackbar');
        },
        () => {
          this.cargarProveedores();
        }
      );
    });
  }

  actualizarProveedor(proveedor: Proveedor): void {
    this.dialog.open(CrearEditarProveedorComponent, {
      data: {
        modo: 'editar',
        proveedor
      },
      width: '600px'
    }).afterClosed().subscribe((proveedor: Proveedor | null) => {
      if (!proveedor) return;

      this.proveedorService.update(proveedor.id, proveedor).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Proveedor actualizado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar proveedor', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al actualizar proveedor', 'red-snackbar');
        },
        () => {
          this.cargarProveedores();
        }
      );
    });
  }

  eliminarProveedor(proveedor: Proveedor): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar el proveedor?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.proveedorService.delete(proveedor.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Proveedor eliminado', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar proveedor', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar proveedor', 'red-snackbar');
          },
          () => {
            this.cargarProveedores();
          }
        );
      } 
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

  private cargarProveedores(): void {
    this.proveedorService.find()
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
