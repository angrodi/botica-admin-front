import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { TableColumn } from 'src/@vex/interfaces/table-column.interface';

import icEdit from '@iconify/icons-ic/twotone-edit';
import icDelete from '@iconify/icons-ic/twotone-delete';
import icSearch from '@iconify/icons-ic/twotone-search';
import icAdd from '@iconify/icons-ic/twotone-add';
import icFilterList from '@iconify/icons-ic/twotone-filter-list';
import icMoreHoriz from '@iconify/icons-ic/twotone-more-horiz';
import icPageview from '@iconify/icons-ic/twotone-pageview';

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Compra } from 'src/app/shared/interfaces/compra.interface';
import { DetalleCompraComponent } from '../detalle-compra/detalle-compra.component';
import { CompraService } from 'src/app/core/services/compra.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-compra',
  templateUrl: './tabla-compra.component.html',
  styleUrls: ['./tabla-compra.component.scss'],
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
export class TablaCompraComponent implements OnInit {

  userLoggedIsAdmin: boolean = false;

  @Input()
  columns: TableColumn<Compra>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Proveedor', property: 'proveedorId', type: 'text', visible: true },
    { label: 'Monto', property: 'monto', type: 'text', visible: true },
    { label: 'Fecha', property: 'fecha', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Compra> | null;
  selection = new SelectionModel<Compra>(true, []);
  searchCtrl = new FormControl();

  icEdit = icEdit;
  icSearch = icSearch;
  icDelete = icDelete;
  icAdd = icAdd;
  icFilterList = icFilterList;
  icMoreHoriz = icMoreHoriz;
  icPageview = icPageview;

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort: MatSort;

  constructor(
    private dialog: MatDialog,
    private compraService: CompraService,
    private snackbar: MatSnackBar,
    private tokenService: TokenService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.cargarCompras();

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

  detalleCompra(compra: Compra): void {
    const data: any = {};

    this.compraService.findById(compra.id).subscribe(
      response => {
        data.compra = response.data;
      }, 
      error => {
        this.mostrarSnackbar('Error al cargar datos de la compra', 'red-snackbar');
      }, 
      () => {
        // Mostrar el dialogo
        this.dialog.open(DetalleCompraComponent, {
          data,
          width: '900px'
        });
      }
    );
  }

  eliminarCompra(compra: Compra): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar la compra?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.compraService.delete(compra.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Compra eliminada', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar compra', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar compra', 'red-snackbar');
          },
          () => {
            this.cargarCompras();
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

  private cargarCompras(): void {
    this.compraService.find()
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
