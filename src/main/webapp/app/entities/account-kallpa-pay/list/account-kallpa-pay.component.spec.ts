import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AccountKallpaPayService } from '../service/account-kallpa-pay.service';

import { AccountKallpaPayComponent } from './account-kallpa-pay.component';

describe('AccountKallpaPay Management Component', () => {
  let comp: AccountKallpaPayComponent;
  let fixture: ComponentFixture<AccountKallpaPayComponent>;
  let service: AccountKallpaPayService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AccountKallpaPayComponent],
    })
      .overrideTemplate(AccountKallpaPayComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AccountKallpaPayComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AccountKallpaPayService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.accountKallpaPays?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});
