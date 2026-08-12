import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MascotaService } from '../../services/mascota.service';
import { DuenoService } from '../../services/dueno.service';
import { FacturaService } from '../../services/factura.service';
import { Mascota } from '../../models/mascota.models';
import { forkJoin } from 'rxjs';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  totalPets = 0;
  totalOwners = 0;
  totalInvoices = 0;
  totalRevenue = 0;
  recentPets: Mascota[] = [];
  loading = true;

  constructor(
    private mascotaService: MascotaService,
    private duenoService: DuenoService,
    private facturaService: FacturaService
  ) { }

  ngOnInit() {
    this.fetchData();
  }

  get esPersonalAdmin(): boolean {
    const rol = localStorage.getItem('rol');
    return rol === 'ADMIN' || rol === 'EMPLEADO';
  }

  fetchData() {
    this.loading = true;

    const observables: any = {
      pets: this.mascotaService.getAll()
    };

    if (this.esPersonalAdmin) {
      observables.owners = this.duenoService.getAll();
      observables.invoices = this.facturaService.getAll();
    }

    forkJoin(observables).subscribe({
      next: (data: any) => {
        this.totalPets = data.pets.length;
        this.totalOwners = data.owners?.length ?? 0;
        this.totalInvoices = data.invoices?.length ?? 0;
        this.totalRevenue = data.invoices?.reduce((acc: number, inv: any) => acc + (inv.total || 0), 0) ?? 0;

        this.recentPets = data.pets.slice(-5).reverse();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error fetching dashboard data', err);
        this.loading = false;
      }
    });
  }
}
