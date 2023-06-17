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
import { Pedido } from '../../../../../shared/interfaces/pedido.interface';
import { EditarPedidoComponent } from '../editar-pedido/editar-pedido.component';
import { DetallePedidoComponent } from '../detalle-pedido/detalle-pedido.component';
import { PedidoService } from 'src/app/core/services/pedido.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-pedido',
  templateUrl: './tabla-pedido.component.html',
  styleUrls: ['./tabla-pedido.component.scss'],
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
export class TablaPedidoComponent implements OnInit {

  pedidos: Pedido[] = [];

  @Input()
  columns: TableColumn<Pedido>[] = [
    // { label: 'Casilla', property: 'checkbox', type: 'checkbox', visible: true },
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Cliente', property: 'clienteId', type: 'text', visible: true },
    { label: 'Empleado', property: 'empleadoId', type: 'text', visible: false },
    { label: 'Dirección', property: 'direccion', type: 'text', visible: false },
    { label: 'Monto', property: 'monto', type: 'text', visible: true },
    { label: 'Creado', property: 'fechaCreacion', type: 'text', visible: true },
    { label: 'Entrega', property: 'fechaEntrega', type: 'text', visible: true },
    { label: 'Método de Pago', property: 'metodoPago', type: 'text', visible: true },
    { label: 'Estado', property: 'estado', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Pedido> | null;
  selection = new SelectionModel<Pedido>(true, []);
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
    private snackbar: MatSnackBar,
    private pedidoService: PedidoService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.cargarPedidos();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  detallePedido(pedido: Pedido): void {
    const data: any = {};

    this.pedidoService.findById(pedido.id)
      .subscribe(response => {
        data.pedido = response.data;
      }, error => {
        this.mostrarSnackbar('Error al cargar datos del pedido', 'red-snackbar');
      }, () => {
        // Mostrar el dialogo
        this.dialog.open(DetallePedidoComponent, {
          data,
          width: '900px'
        });
      });
  }

  actualizarPedido(pedido: Pedido): void {
    this.dialog.open(EditarPedidoComponent, {
      data: {
        pedido
      },
      width: '600px'
    }).afterClosed().subscribe((response: any) => {
      if (!response) return;

      if (response.status === 200) {
        this.mostrarSnackbar('Pedido actualizado', 'green-snackbar');
      } else if (response.status === 500) {
        this.mostrarSnackbar('Error al actualizar pedido', 'red-snackbar');
      }
      this.cargarPedidos();
    });
  }

  eliminarPedido(pedido: Pedido): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar el pedido?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.pedidoService.delete(pedido.id)
          .subscribe(response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Pedido eliminado', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar pedido', 'red-snackbar');
            }
            this.cargarPedidos();
          });
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

  private cargarPedidos(): void {
    this.pedidoService.find()
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
