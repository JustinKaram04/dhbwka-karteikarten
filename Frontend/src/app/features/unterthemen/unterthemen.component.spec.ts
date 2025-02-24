import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UnterthemenComponent } from './unterthemen.component';

describe('UnterthemenComponent', () => {
  let component: UnterthemenComponent;
  let fixture: ComponentFixture<UnterthemenComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UnterthemenComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(UnterthemenComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
