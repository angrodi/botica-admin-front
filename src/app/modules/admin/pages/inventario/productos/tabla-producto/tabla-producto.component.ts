import { Component, Input, OnInit, ViewChild } from '@angular/core';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';
import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { MatTableDataSource } from '@angular/material/table';
import { FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { CrearEditarProductoComponent } from '../crear-editar-producto/crear-editar-producto.component';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { ProductoService } from 'src/app/core/services/producto.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { Categoria } from 'src/app/shared/interfaces/categoria.interface';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { switchMap, tap } from 'rxjs/operators';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-producto',
  templateUrl: './tabla-producto.component.html',
  styleUrls: ['./tabla-producto.component.scss'],
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
export class TablaProductoComponent implements OnInit {

  userLoggedIsAdmin: boolean = false;
  categorias: Categoria[];

  @Input()
  columns: TableColumn<Producto>[] = [
    { label: 'Imagen', property: 'imagen', type: 'image', visible: true },
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: false },
    { label: 'Precio', property: 'precio', type: 'text', visible: true },
    { label: 'Stock', property: 'stock', type: 'text', visible: true },
    { label: 'Categoría', property: 'categoriaId', type: 'text', visible: true },
    { label: 'Estado', property: 'estado', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Producto> | null;
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
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private snackbar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.cargarProductos();

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

  crearProducto(): void {
    this.dialog.open(CrearEditarProductoComponent, {
      data: {
        modo: 'crear'
      },
      width: '700px'
    }).afterClosed().subscribe((data: FormData | null) => {
      if (!data) return;

      this.productoService.create(data).subscribe(
        response => {
          if (response.status === 201) {
            this.mostrarSnackbar('Producto creado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al crear producto', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al crear producto', 'red-snackbar');
        },
        () => {
          this.cargarProductos();
        }
      );
    });
  }

  actualizarProducto(producto: Producto): void {
    this.dialog.open(CrearEditarProductoComponent, {
      data: {
        modo: 'editar',
        producto
      },
      width: '700px'
    }).afterClosed().subscribe((data: FormData | null) => {
      if (!data) return;

      this.productoService.update(producto.id, data).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Producto actualizado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar producto', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al actualizar producto', 'red-snackbar');
        },
        () => {
          this.cargarProductos();
        }
      );
    });
  }

  eliminarProducto(producto: Producto): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar el producto?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.productoService.delete(producto.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Producto eliminado', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar producto', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar producto', 'red-snackbar');
          },
          () => {
            this.cargarProductos();
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

  private cargarProductos(): void {
    this.categoriaService.find()
      .pipe(
        tap(response => this.categorias = response.data),
        switchMap(() => this.productoService.find())
      )
      .subscribe(response => {
        this.dataSource.data = response.data;
        this.dataSource.data.forEach(producto => {
          const categorias = this.categorias.filter(categoria => categoria.id === producto.categoriaId);
          
          producto.categoria = {
            nombre: categorias[0].nombre
          };
        });
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
