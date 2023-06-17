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
import { CrearEditarClienteComponent } from '../crear-editar-cliente/crear-editar-cliente.component';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CustomDialogComponent } from 'src/app/shared/components/custom-dialog/custom-dialog.component';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from '../../../../../../shared/interfaces/cliente.interface';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-tabla-cliente',
  templateUrl: './tabla-cliente.component.html',
  styleUrls: ['./tabla-cliente.component.scss'],
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
export class TablaClienteComponent implements OnInit, AfterViewInit {

  userLoggedIsAdmin: boolean = false;
  clientes: Cliente[];

  @Input()
  columns: TableColumn<Cliente>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Nombres', property: 'nombres', type: 'text', visible: false },
    { label: 'Apellidos', property: 'apellidos', type: 'text', visible: false },
    { label: 'DNI', property: 'dni', type: 'text', visible: true },
    { label: 'Email', property: 'email', type: 'text', visible: true },
    { label: 'Teléfono', property: 'telefono', type: 'text', visible: true },
    { label: 'Dirección', property: 'direccion', type: 'text', visible: false },
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
    private clienteService: ClienteService,
    private tokenService: TokenService
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.cargarClientes();

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

  crearCliente(): void {
    this.dialog.open(CrearEditarClienteComponent, {
      data: {
        modo: 'crear'
      },
      width: '700px'
    }).afterClosed().subscribe((cliente: Cliente | null) => {
      if (!cliente) return;

      this.clienteService.create(cliente).subscribe(
        response => {
          if (response.status === 201) {
            this.mostrarSnackbar('Cliente creado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al crear cliente', 'red-snackbar');
          } 
        },
        error => {
          this.mostrarSnackbar('Error al crear cliente', 'red-snackbar');
        },
        () => {
          this.cargarClientes();
        }
      );
    });

  }

  actualizarCliente(cliente: Cliente): void {
    this.dialog.open(CrearEditarClienteComponent, {
      data: {
        modo: 'editar',
        cliente
      },
      width: '700px'
    }).afterClosed().subscribe((cliente: Cliente | null) => {
      if (!cliente) return;

      this.clienteService.update(cliente.id, cliente).subscribe(
        response => {
          if (response.status === 200) {
            this.mostrarSnackbar('Cliente actualizado', 'green-snackbar');
          } else if (response.status === 500) {
            this.mostrarSnackbar('Error al actualizar cliente', 'red-snackbar');
          } 
        },
        error => {
          this.mostrarSnackbar('Error al actualizar cliente', 'red-snackbar');
        },
        () => {
          this.cargarClientes();
        }
      );
    });

  }

  eliminarCliente(cliente: Cliente): void {
    this.dialog.open(CustomDialogComponent, {
      data: {
        pregunta: '¿Está seguro de eliminar el cliente?'
      },
      disableClose: false,
      width: '400px'
    }).afterClosed().subscribe(result => {
      if (result === 'si') {
        this.clienteService.delete(cliente.id).subscribe(
          response => {
            if (response.status === 200) {
              this.mostrarSnackbar('Cliente eliminado', 'green-snackbar');
            } else {
              this.mostrarSnackbar('Error al eliminar cliente', 'red-snackbar');
            }
          },
          error => {
            this.mostrarSnackbar('Error al eliminar cliente', 'red-snackbar');
          },
          () => {
            this.cargarClientes();
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

  private cargarClientes(): void {
    this.clienteService.find()
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


