import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlogsDeatilsComponent } from './blogs-deatils.component';

describe('BlogsDeatilsComponent', () => {
  let component: BlogsDeatilsComponent;
  let fixture: ComponentFixture<BlogsDeatilsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BlogsDeatilsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BlogsDeatilsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
