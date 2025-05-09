import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearDuenoComponent } from './crear-dueno.component';

describe('CrearDuenoComponent', () => {
  let component: CrearDuenoComponent;
  let fixture: ComponentFixture<CrearDuenoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrearDuenoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrearDuenoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
