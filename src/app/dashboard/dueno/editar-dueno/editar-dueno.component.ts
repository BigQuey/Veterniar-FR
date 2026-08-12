import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Dueno } from '../../../models/dueno.model';
import { DuenoService } from '../../../services/dueno.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-editar-dueno',
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './editar-dueno.component.html',
  styleUrl: './editar-dueno.component.css'
})
export class EditarDuenoComponent {
  dueno!: Dueno;

  constructor(
    private duenoService: DuenoService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.duenoService.getOne(id).subscribe((data: any) => {
      this.dueno = data;
    });
  }

  actualizar() {
    this.duenoService.update(this.dueno).subscribe(() => {
      this.router.navigate(['/dashboard/dueno']);
    });
  }
}
