import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';
import { Categoria } from 'src/app/shared/interfaces/categoria.interface';
import { CrearEditarCategoriaComponent } from '../crear-editar-categoria/crear-editar-categoria.component';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-categoria',
  templateUrl: './tabla-categoria.component.html',
  styleUrls: ['./tabla-categoria.component.scss'],
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
export class TablaCategoriaComponent implements OnInit {

  userLoggedIsAdmin: boolean = false;

  @Input()
  columns: TableColumn<Categoria>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: true },
    { label: 'Estado', property: 'estado', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Categoria> | null;
  searchCtrl = new FormControl();

  // Iconos
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
    private categoriaService: CategoriaService,
    private snackbar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    // Cargar categorias
    this.cargarCategorias();

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

  crearCategoria(): void {
    this.dialog.open(CrearEditarCategoriaComponent, {
      data: {
        modo: 'crear'
      },
      width: '600px'
    }).afterClosed().subscribe((categoria: Categoria | null) => {
      if (!categoria) return;

      this.categoriaService.create(categoria).subscribe(
        response => {
          if (response.status === 201) {
            this.mostrarSnackbar('Categoría creada', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al crear categoría', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al crear categoría', 'red-snackbar');
        },
        () => {
          this.cargarCategorias();
        }
      );
    });
  }

  actualizarCategoria(categoria: Categoria): void {
    this.dialog.open(CrearEditarCategoriaComponent, {
      data: {
        modo: 'editar',
        categoria
      },
      width: '600px'
    }).afterClosed().subscribe((categoria: Categoria | null) => {
      if (!categoria) return;

      this.categoriaService.update(categoria.id, categoria).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Categoría actualizada', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar categoría', 'red-snackbar');
          }
        },
        error => {
          this.mostrarSnackbar('Error al actualizar categoría', 'red-snackbar');
        },
        () => {
          this.cargarCategorias();
        }
      );
    });
  }

  eliminarCategoria(categoria: Categoria): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar la categoría?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.categoriaService.delete(categoria.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Categoría eliminada', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar categoría', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar categoría', 'red-snackbar');
          },
          () => {
            this.cargarCategorias();
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

  toggleColumnVisibility(column: any, event: any) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  private cargarCategorias(): void {
    this.categoriaService.find()
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
