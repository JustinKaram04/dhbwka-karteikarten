import {
  Component,
  Input,
  Output,
  EventEmitter,
  ViewEncapsulation
} from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-editable-card',
  standalone: true,
  imports: [CommonModule],
  encapsulation: ViewEncapsulation.None,
  templateUrl: './editable-card.component.html',
  styleUrls: ['./editable-card.component.css']
})
export class EditableCardComponent {
  @Input() editing = false;// wenn true, zeigen wir die edit-felder
  @Input() showMenu = false;// wenn true, wird das kontext-menü eingeblendet

  @Output() toggleMenu = new EventEmitter<MouseEvent>();//event wenn menü-icon geklickt
  @Output() cardClick  = new EventEmitter<MouseEvent>(); //event wenn karte selbst geklickt

  onToggleMenu(event: MouseEvent) {
    event.stopPropagation();// klick darf nix anderes triggern
    this.toggleMenu.emit(event);// weiterleiten an parent
  }

  onCardClick(event: MouseEvent) {
    this.cardClick.emit(event);// parent darf reingucken und reagieren
  }
}
