import { Injectable } from '@angular/core';
import * as signalR from "@microsoft/signalr";
import { BehaviorSubject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class ChatService {

  connection :signalR.HubConnection =new signalR.HubConnectionBuilder()
  .withUrl("http://localhost:5000/chat")
  
  .configureLogging(signalR.LogLevel.Information)
  .build();

  public messages$=new BehaviorSubject<any>([]);
  public connectedUsers$=new BehaviorSubject<any>([]);
  public messages:any[]=[];
  public users:any[]=[];

constructor() {
  console.log("ChatService initialized"); // Add a debug log to check if the service is initialized

  this.connection.start();
  // Rest of the constructor code remains the same...

  this.connection.on("ReceiveMessage", (user: string, message: string, messageTime: string) => {
    console.log("Received message:", { user, message, messageTime }); // Add a debug log for received messages
    this.messages = [...this.messages, { user, message, messageTime }];
    this.messages$.next(this.messages);
  });

  this.connection.on("ConnectedUser", (users: any) => {
    console.log("Received connected users:", users); // Add a debug log for received connected users
    this.connectedUsers$.next(users);
  });
}


  // start connection 

  public async start() {
    try {
      await this.connection.start();
      console.log("SignalR connection established successfully.");
    } catch (error) {
      console.error("Error starting SignalR connection:", error);
    }
  }
  // join room
  public async joinRoom(user:string , room:string)
  {
    return this.connection.invoke("JoinRoom",{user,room})
  }

  //  send Messages
  public async sendMessage(message: string)
  {
    return this.connection.invoke("SendMessage",message)
  }

  // leave chat 
  public async  leaveChat()
  {
    return this.connection.stop();
  }


}
