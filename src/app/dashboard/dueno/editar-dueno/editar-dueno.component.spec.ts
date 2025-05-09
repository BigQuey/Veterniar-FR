import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarDuenoComponent } from './editar-dueno.component';

describe('EditarDuenoComponent', () => {
  let component: EditarDuenoComponent;
  let fixture: ComponentFixture<EditarDuenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarDuenoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarDuenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
