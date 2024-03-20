import mongoose from 'mongoose';

export interface ISenderAndReceiver {
  userId?: number;
  lecturerId?: number;
}

export interface ChatInputData {
  sender: ISenderAndReceiver;
  receiver: ISenderAndReceiver;
  content?: string;
  imageUrl?: string;
  chattingRoomId: mongoose.Types.ObjectId;
}
