import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ICard } from '../card.model';
import { CardService } from '../service/card.service';
import { CardDeleteDialogComponent } from '../delete/card-delete-dialog.component';

@Component({
  selector: 'jhi-card',
  templateUrl: './card.component.html',
})
export class CardComponent implements OnInit {
  cards?: ICard[];
  isLoading = false;

  constructor(protected cardService: CardService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.cardService.query().subscribe({
      next: (res: HttpResponse<ICard[]>) => {
        this.isLoading = false;
        this.cards = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ICard): number {
    return item.id!;
  }

  delete(card: ICard): void {
    const modalRef = this.modalService.open(CardDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.card = card;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}
