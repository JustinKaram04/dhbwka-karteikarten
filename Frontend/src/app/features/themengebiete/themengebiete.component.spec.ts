import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThemengebieteComponent } from './themengebiete.component';

describe('ThemengebieteComponent', () => {
  let component: ThemengebieteComponent;
  let fixture: ComponentFixture<ThemengebieteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThemengebieteComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThemengebieteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
