import { Component } from '@angular/core';
import { ShowUsersComponent } from '../show-users/show-users.component';
import { HeaderComponent } from '../header/header.component';
import { MessageBoxComponent } from '../message-box/message-box.component';

@Component({
  selector: 'app-chart-show',
  standalone: true,
  imports: [ShowUsersComponent,HeaderComponent,MessageBoxComponent],
  templateUrl: './chart-show.component.html',
  styleUrl: './chart-show.component.css'
})
export class ChartShowComponent {

}
