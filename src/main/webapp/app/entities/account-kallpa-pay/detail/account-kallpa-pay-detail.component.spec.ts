import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AccountKallpaPayDetailComponent } from './account-kallpa-pay-detail.component';

describe('AccountKallpaPay Management Detail Component', () => {
  let comp: AccountKallpaPayDetailComponent;
  let fixture: ComponentFixture<AccountKallpaPayDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AccountKallpaPayDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ accountKallpaPay: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AccountKallpaPayDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AccountKallpaPayDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load accountKallpaPay on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.accountKallpaPay).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});
