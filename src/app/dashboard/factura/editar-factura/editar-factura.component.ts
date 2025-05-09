import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FacturaService } from '../../../services/factura.service';
import { DuenoService } from '../../../services/dueno.service';
import { ServicioService } from '../../../services/servicio.service';
import { Factura } from '../../../models/factura.model';
import { Dueno } from '../../../models/dueno.model';
import { Servicio } from '../../../models/servicio.model';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-editar-factura',
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-factura.component.html',
  styleUrl: './editar-factura.component.css'
})
export class EditarFacturaComponent {
  factura: Factura = {
    id: undefined, 
    fecha: '',
    dueno: undefined, 
    detalles: []
  };
  duenosDisponibles: Dueno[] = [];
  serviciosDisponibles: Servicio[] = [];
  mensajeExito: string = '';
  facturaId: number | undefined;  

  constructor(
    private facturaService: FacturaService,
    private duenoService: DuenoService,
    private servicioService: ServicioService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.facturaId = Number(this.route.snapshot.paramMap.get('id'));
  }

  ngOnInit(): void {
    this.obtenerDuenos();
    // this.obtenerServicios();
    this.servicioService.getAll().subscribe({
    next: (servicios: Servicio[]) => {
      this.serviciosDisponibles = servicios;

      if (this.facturaId) {
        this.obtenerFactura(); 
      }
    },
    error: (error) => {
      console.log(error);
    }
  });
   
    // if (this.facturaId) {
    //   this.obtenerFactura();
    // }
  }

  obtenerFactura() {
    if (this.facturaId) {
      this.facturaService.getOne(this.facturaId).subscribe({
        next: (factura: Factura) => {
          console.log('Factura cargada:', factura); 
          this.factura = factura;
          
          
          if (!this.factura.detalles) {
            this.factura.detalles = []; 
          }
          
          this.factura.detalles.forEach(detalle => {
          const servicioEncontrado = this.serviciosDisponibles.find(
            s => s.id === detalle.servicio?.id
          );
          if (servicioEncontrado) {
            detalle.servicio = servicioEncontrado; 
          }
        });
        },
        error: (error: HttpErrorResponse) => {
          console.log('Error al obtener la factura:', error.message);
        }
      });
    }
  }
  
  

  obtenerDuenos() {
    this.duenoService.getAll().subscribe({
      next: (duenos: Dueno[]) => {
        this.duenosDisponibles = duenos;
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  // obtenerServicios() {
  //   this.servicioService.getAll().subscribe({
  //     next: (servicios: Servicio[]) => {
  //       this.serviciosDisponibles = servicios;
  //     },
  //     error: (error) => {
  //       console.log(error);
  //     }
  //   });
  // }

  calcularSubtotal(index: number) {
    const detalle = this.factura?.detalles?.[index];
    if (detalle) {
      if (detalle.servicio?.precio && detalle.cantidad) {
        detalle.subtotal = detalle.servicio.precio * detalle.cantidad;
      } else {
        detalle.subtotal = 0;
      }
    }
  }

  agregarDetalle() {
    if (!this.factura.detalles) {
      this.factura.detalles = [];  
    }
    this.factura.detalles.push({
      servicio: undefined,
      cantidad: 1,
      subtotal: 0
    });
  }

  eliminarDetalle(index: number) {
    console.log('Eliminando detalle en el índice:', index); 
  
    if (this.factura.detalles && this.factura.detalles.length > 0) {
      // Asegúrate de eliminar solo si hay detalles en la lista
      this.factura.detalles.splice(index, 1);
      console.log('Detalles después de eliminar:', this.factura.detalles);
    }
  }

  guardarFactura() {
    if (this.factura.id) {
      console.log(this.factura.fecha);
      this.factura.fecha = new Date(this.factura.fecha || "").toISOString().split('T')[0];
      console.log(this.factura.fecha);
      this.facturaService.update(this.factura.id, this.factura).subscribe(()=>{
         
        this.router.navigate(['/dashboard/factura']);
      });
    } else {
      this.facturaService.create(this.factura).subscribe({
        next: () => {
          this.mensajeExito = 'Factura creada correctamente.';
          setTimeout(() => {
            this.mensajeExito = '';
          }, 1500);
        },
        error: (error) => {
          console.log(error);
        }
      });
    }
  }
}
