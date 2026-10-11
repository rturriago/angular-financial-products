import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppHeaderComponent } from './core/layout/app-header/app-header.component';
import { NotificationsComponent } from './core/notifications/notifications.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, AppHeaderComponent, NotificationsComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class App {}
