import { Manager, Socket } from 'socket.io-client';

let socket: Socket;

export const connectToServer = (token: string, roomId: string, onQueue: (data: any) => void) => {
  const manager = new Manager('http://localhost:3000', {
    extraHeaders: {
      authorization: token,
    },
  });

  socket?.removeAllListeners();

  socket = manager.socket('/');

  socket.on('queue-from-back', onQueue);

  socket.on('connect', () => {
    console.log('connected');

    socket.emit('join-room', roomId);
  });

  socket.on('disconnect', () => {
    console.log('disconnected');
  });
};
