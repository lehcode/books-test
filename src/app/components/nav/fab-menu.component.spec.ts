import { ComponentFixture, TestBed } from '@angular/core/testing'

import { FabMenuComponent } from './fab-menu.component'

describe('FabMenuComponent', () => {
  let component: FabMenuComponent
  let fixture: ComponentFixture<FabMenuComponent>

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FabMenuComponent],
    }).compileComponents()

    fixture = TestBed.createComponent(FabMenuComponent)
    component = fixture.componentInstance
    fixture.detectChanges()
  })

  it('should create', () => {
    expect(component).toBeTruthy()
  })
})
