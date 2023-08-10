import { Injectable, NgZone } from '@angular/core';

@Injectable()
export class WebSocketService {
  private socket: WebSocket;
  private dataSubscribers: ((data: any) => void)[] = [];
  private currentData: any = null;

  constructor(private zone: NgZone) {
    this.socket = new WebSocket('wss://test');

    this.socket.onopen = (event) => {
      console.log('WebSocket connection opened');
      this.socket.onmessage = (messageEvent) => {
        const newData = JSON.parse(messageEvent.data);
        if (this.isDataChanged(newData)) {
          this.zone.run(() => {
            this.dataSubscribers.forEach((subscriber) => subscriber(newData));
            this.currentData = newData;
          });
        }
      };
    };

    this.socket.onerror = (errorEvent) => {
      console.error('WebSocket error:', errorEvent);
    };

    this.socket.onclose = (closeEvent) => {
      console.log('WebSocket connection closed:', closeEvent);
    };
  }

  private isDataChanged(newData: any): boolean {
    return JSON.stringify(newData) !== JSON.stringify(this.currentData);
  }

  subscribeToData(subscriber: (data: any) => void): void {
    this.dataSubscribers.push(subscriber);
  }

  unsubscribeFromData(subscriber: (data: any) => void): void {
    this.dataSubscribers = this.dataSubscribers.filter(
      (sub) => sub !== subscriber
    );
  }
}
