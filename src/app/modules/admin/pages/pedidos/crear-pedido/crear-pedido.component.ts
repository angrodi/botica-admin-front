import { SelectionModel } from '@angular/cdk/collections';
import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
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

import { fadeInUp400ms } from 'src/@vex/animations/fade-in-up.animation';
import { stagger40ms } from 'src/@vex/animations/stagger.animation';
import { MatFormFieldDefaultOptions, MAT_FORM_FIELD_DEFAULT_OPTIONS } from '@angular/material/form-field';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Producto } from 'src/app/shared/interfaces/producto.interface';
import { ProductoService } from 'src/app/core/services/producto.service';
import { CategoriaService } from 'src/app/core/services/categoria.service';
import { Categoria } from 'src/app/shared/interfaces/categoria.interface';
import { switchMap, tap } from 'rxjs/operators';
import { ProveedorService } from 'src/app/core/services/proveedor.service';
import { Proveedor } from 'src/app/shared/interfaces/proveedor.interface';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { Pedido } from 'src/app/shared/interfaces/pedido.interface';
import { DetallePedido } from 'src/app/shared/interfaces/detalle-pedido.interface';
import { ClienteService } from 'src/app/core/services/cliente.service';
import { Cliente } from 'src/app/shared/interfaces/cliente.interface';
import { PedidoService } from 'src/app/core/services/pedido.service';
import { TokenService } from 'src/app/core/services/token.service';

@UntilDestroy()
@Component({
  selector: 'vex-crear-compra',
  templateUrl: './crear-pedido.component.html',
  styleUrls: ['./crear-pedido.component.scss'],
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
export class CrearPedidoComponent implements OnInit {

  categorias: Categoria[];
  productos: Producto[];
  proveedores: Proveedor[];
  clientes: Cliente[];
  pedido: Pedido;

  @Input()
  columns: TableColumn<Producto>[] = [
    { label: 'Código', property: 'id', type: 'text', visible: true },
    { label: 'Nombre', property: 'nombre', type: 'text', visible: true },
    { label: 'Precio', property: 'precio', type: 'text', visible: true },
    { label: 'Categoría', property: 'categoriaId', type: 'text', visible: true },
    { label: 'Descripción', property: 'descripcion', type: 'text', visible: false },
    { label: 'Stock', property: 'stock', type: 'text', visible: true },
    { label: 'Acciones', property: 'actions', type: 'button', visible: true }
  ];

  pageSize = 5;
  pageSizeOptions: number[] = [5, 10, 20, 50];
  dataSource: MatTableDataSource<Producto> | null;
  selection = new SelectionModel<Producto>(true, []);
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
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private clienteService: ClienteService,
    private pedidoService: PedidoService,
    private tokenService: TokenService,
    private snackbar: MatSnackBar,
    private router: Router
  ) {}

  get visibleColumns() {
    return this.columns.filter(column => column.visible).map(column => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.pedido = {
      monto: 0,
      direccion: '',
      fechaCreacion: '',
      fechaActualizacion: '',
      metodoPago: '',
      estado: '',
      clienteId: 0,
      empleadoId: 0,
      detalles: [],
      cliente: {} as Cliente
    };

    this.cargarProductos();
    this.cargarProveedores();
    this.cargarClientes();

    this.searchCtrl.valueChanges.pipe(
      untilDestroyed(this)
    ).subscribe(value => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  agregarDetalle(producto: Producto): void {
    // Buscar si el producto ya fue agregado
    let estaAgregado = false;

    this.pedido.detalles.forEach(d => {
      if (d.productoId === producto.id) {
        estaAgregado = true;
      }
    });

    if (estaAgregado) return;

    // Agregar detalle producto
    let detalle: DetallePedido = {
      cantidad: 0,
      productoId: producto.id,
      producto
    };

    this.pedido.detalles.push(detalle);
  }

  eliminarDetalle(detalle: DetallePedido): void {
    this.pedido.detalles = this.pedido.detalles.filter(d => d.productoId !== detalle.productoId);
    this.calcularMonto();
  }

  calcularMonto(): void {
    let monto = 0;

    this.pedido.detalles.forEach(d => {
      if (d.cantidad > d.producto.stock) {
        d.cantidad = 0;
        this.mostrarSnackbar('La cantidad solicitada excede el stock', 'yellow-snackbar');
      }

      monto += d.cantidad * d.producto.precio;
    });

    this.pedido.monto = monto;
  }

  datosValidos(): boolean {
    if (this.pedido.monto > 0 && this.pedido.detalles.length > 0 && this.pedido.cliente && this.pedido.metodoPago && this.pedido.estado) {
      return true;
    } 
    return false;
  }

  crearPedido(): void {
    this.pedido.empleadoId = this.tokenService.getUsuarioJWT().id;
    this.pedido.clienteId = this.pedido.cliente.id;
    this.pedido.direccion = this.pedido.cliente.direccion;

    this.pedidoService.create(this.pedido)
      .subscribe(response => {
        if (response.status === 201) {
          this.mostrarSnackbar('Pedido creado', 'green-snackbar');
          this.router.navigate(['/admin/pedidos']);
        } else {
          this.mostrarSnackbar('Error al crear pedido', 'red-snackbar');
        }
      }, err => {
        this.mostrarSnackbar('Error al crear pedido', 'red-snackbar');
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
        this.productos = response.data;
        this.dataSource.data = this.productos;
        this.dataSource.data.forEach(producto => {
          const categorias = this.categorias.filter(categoria => categoria.id === producto.categoriaId);
          
          producto.categoria = {
            nombre: categorias[0].nombre
          };
        });
      }, err => {
        this.productos = [];
        this.dataSource.data = this.productos;
        this.mostrarSnackbar('Error al cargar los productos', 'red-snackbar');
      });
  }

  private cargarProveedores(): void {
    this.proveedorService.find()
    .subscribe(response => {
        this.proveedores = response.data;
      }, err => {
        this.proveedores = [];
        this.mostrarSnackbar('Error al cargar los proveedores', 'red-snackbar');
      });
  }

  private cargarClientes(): void {
    this.clienteService.find()
    .subscribe(response => {
        this.clientes = response.data;
      }, err => {
        this.clientes = [];
        this.mostrarSnackbar('Error al cargar los clientes', 'red-snackbar');
      });
  }

  private mostrarSnackbar(mensaje: string, ...clases: string[]): void {
    this.snackbar.open(mensaje, 'OK', {
      duration: 3000,
      panelClass: clases
    });
  }
}
