import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-item',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-item.component.html',
  styleUrls: ['./add-item.component.scss']
})
export class AddItemComponent {
  /** namens feld */
  @Input() labelName = 'Name';
  /** placeholder für namens feld */
  @Input() placeholderName = '';
  /** label für  bschreibungs feld */
  @Input() labelDescription = 'Beschreibung';
  /** placeholder für  beschreibungs feld */
  @Input() placeholderDescription = '';
  /** text für  Submit Button */
  @Input() buttonText = 'Hinzufügen';
  /** Text für  cancel button */
  @Input() cancelText = 'Abbrechen';

  /**event wenn Item hinzugefügt werden soll*/
  @Output() add = new EventEmitter<{ name: string; description: string }>();

  showInput = false;           //anzeige formulaar
  valueName = '';              //eingabe name
  valueDescription = '';       //eingabe beschreibung

  /**öffne formular*/
  toggleInput(): void {
    this.showInput = true;
  }

  /**emit und reset bei hinzufügen*/
  submit(): void {
    if (!this.valueName.trim()) return;
    this.add.emit({ name: this.valueName.trim(), description: this.valueDescription.trim() });
    this.reset();
  }

  /**abruch und reset*/
  cancel(): void {
    this.reset();
  }

  /**reset logik*/
  private reset(): void {
    this.valueName = '';
    this.valueDescription = '';
    this.showInput = false;
  }
}
