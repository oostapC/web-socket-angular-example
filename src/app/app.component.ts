import { Component, OnInit } from '@angular/core';
import { WebSocketService } from '../services/webSocket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  constructor(private webSocketService: WebSocketService) {}

  ngOnInit(): void {
    this.webSocketService.subscribeToData((data) => {
      console.log(data);
    });
  }
}
