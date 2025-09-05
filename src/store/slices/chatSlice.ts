import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { ChatMessage, ChatState, LLMConfig } from '../../types/chat';
import { chatService } from '../../services/chatService';

const initialState: ChatState = {
  messages: [],
  isLoading: false,
  isModelReady: false,
  error: null,
};

export const initializeChat = createAsyncThunk(
  'chat/initialize',
  async () => {
    await chatService.initialize();
    return true;
  }
);

export const sendMessage = createAsyncThunk(
  'chat/sendMessage',
  async ({ message, context, config }: { 
    message: string; 
    context: any; 
    config: LLMConfig;
  }) => {
    const response = await chatService.sendMessage(message, context, config);
    return response;
  }
);

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
    },
    clearMessages: (state) => {
      state.messages = [];
      state.error = null;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(initializeChat.pending, (state) => {
        state.isLoading = true;
        state.isModelReady = false;
      })
      .addCase(initializeChat.fulfilled, (state) => {
        state.isLoading = false;
        state.isModelReady = true;
        state.error = null;
      })
      .addCase(initializeChat.rejected, (state, action) => {
        state.isLoading = false;
        state.isModelReady = false;
        state.error = action.error.message || 'Error inicializando el chat';
      })
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(sendMessage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.messages.push(action.payload);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Error enviando mensaje';
      });
  },
});

export const { addMessage, clearMessages, setError, clearError } = chatSlice.actions;
export default chatSlice.reducer;