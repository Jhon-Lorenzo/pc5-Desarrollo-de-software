import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminPaquetes } from './admin-paquetes';

describe('AdminPaquetes', () => {
  let component: AdminPaquetes;
  let fixture: ComponentFixture<AdminPaquetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminPaquetes],
    }).compileComponents();

    fixture = TestBed.createComponent(AdminPaquetes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
