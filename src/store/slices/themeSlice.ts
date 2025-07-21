import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Theme } from '../../types/theme';

interface ThemeState {
  theme: Theme;
}

const getInitialTheme = (): Theme => {
  const savedTheme = localStorage.getItem('walletfy-theme') as Theme;
  return savedTheme || 'light';
};

const initialState: ThemeState = {
  theme: getInitialTheme(),
};

const themeSlice = createSlice({
  name: 'theme',
  initialState,
  reducers: {
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('walletfy-theme', state.theme);
    },
    setTheme: (state, action: PayloadAction<Theme>) => {
      state.theme = action.payload;
      localStorage.setItem('walletfy-theme', state.theme);
    },
  },
});

export const { toggleTheme, setTheme } = themeSlice.actions;
export default themeSlice.reducer;