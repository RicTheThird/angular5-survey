import {Component, Inject} from '@angular/core';
import {MAT_SNACK_BAR_DATA } from '@angular/material';

@Component({
  selector: 'your-snack-bar',
  template: '<span [innerHtml]="data | sanitizeHtml"></span>',
})
export class MessageArchivedComponent {
  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: any) { }
}