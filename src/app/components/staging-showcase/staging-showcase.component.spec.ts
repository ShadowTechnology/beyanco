import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StagingShowcaseComponent } from './staging-showcase.component';

describe('StagingShowcaseComponent', () => {
  let component: StagingShowcaseComponent;
  let fixture: ComponentFixture<StagingShowcaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StagingShowcaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StagingShowcaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
