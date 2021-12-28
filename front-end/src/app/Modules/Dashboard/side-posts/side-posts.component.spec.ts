import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SidePostsComponent } from './side-posts.component';

describe('SidePostsComponent', () => {
  let component: SidePostsComponent;
  let fixture: ComponentFixture<SidePostsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SidePostsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SidePostsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
