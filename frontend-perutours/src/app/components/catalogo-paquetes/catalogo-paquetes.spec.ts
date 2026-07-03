import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CatalogoPaquetes } from './catalogo-paquetes';

describe('CatalogoPaquetes', () => {
  let component: CatalogoPaquetes;
  let fixture: ComponentFixture<CatalogoPaquetes>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CatalogoPaquetes],
    }).compileComponents();

    fixture = TestBed.createComponent(CatalogoPaquetes);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
