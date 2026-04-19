import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteMatDialog } from './delete-mat-dialog';

describe('DeleteMatDialog', () => {
  let component: DeleteMatDialog;
  let fixture: ComponentFixture<DeleteMatDialog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteMatDialog],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteMatDialog);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
