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
  styleUrls: ['./editable-card.component.scss']
})
export class EditableCardComponent {
  @Input() editing = false;
  @Input() showMenu = false;

  @Output() toggleMenu = new EventEmitter<MouseEvent>();
  @Output() cardClick  = new EventEmitter<MouseEvent>();

  onToggleMenu(event: MouseEvent) {
    event.stopPropagation();
    this.toggleMenu.emit(event);
  }

  onCardClick(event: MouseEvent) {
    this.cardClick.emit(event);
  }
}
