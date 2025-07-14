// store/windowSlice.ts
import { nanoid } from "nanoid";
import { createSlice } from "./createAppSlice";
import { getAppConfig } from "../components/appRegistry";

export type AppType = "ImageEditor" | "MarkdownNote" | "Finder" | "Safari" | "Mail" | "Messages" | "FaceTime";

export interface WindowState {
  id: string;
  app: AppType;
  position: { x: number; y: number };
  size: { width: number; height: number };
  isMinimized: boolean;
  isMaximized: boolean;
  zIndex: number;
}

type WindowsSliceState = {
  windows: WindowState[];
  activeWindowId: string | null;
  zIndexCounter: number;
};

const initialState: WindowsSliceState = {
  windows: [],
  activeWindowId: null,
  zIndexCounter: 100,
};

export const windowSlice = createSlice({
  name: "window",
  initialState,
  reducers: (create) => ({
    openWindow: create.reducer<AppType>((state, action) => {
      const id = nanoid();
      const appConfig = getAppConfig(action.payload);
      const randomOffset = Math.floor(Math.random() * 50);
      
      state.windows.push({
        id,
        app: action.payload,
        position: { x: 100 + randomOffset, y: 100 + randomOffset },
        size: appConfig.defaultSize,
        isMinimized: false,
        isMaximized: false,
        zIndex: ++state.zIndexCounter,
      });
      state.activeWindowId = id;
    }),

    closeWindow: create.reducer<string>((state, action) => {
      state.windows = state.windows.filter(w => w.id !== action.payload);
      if (state.activeWindowId === action.payload) {
        state.activeWindowId = null;
      }
    }),

    focusWindow: create.reducer<string>((state, action) => {
      const win = state.windows.find(w => w.id === action.payload);
      if (win) {
        win.zIndex = ++state.zIndexCounter;
        state.activeWindowId = action.payload;
      }
    }),

    minimizeWindow: create.reducer<string>((state, action) => {
      const win = state.windows.find(w => w.id === action.payload);
      if (win) win.isMinimized = true;
    }),

    restoreWindow: create.reducer<string>((state, action) => {
      const win = state.windows.find(w => w.id === action.payload);
      if (win) win.isMinimized = false;
    }),

    moveWindow: create.reducer<{
      id: string;
      position: { x: number; y: number };
    }>((state, action) => {
      const win = state.windows.find(w => w.id === action.payload.id);
      if (win) win.position = action.payload.position;
    }),

    resizeWindow: create.reducer<{
      id: string;
      size: { width: number; height: number };
    }>((state, action) => {
      const win = state.windows.find(w => w.id === action.payload.id);
      if (win) win.size = action.payload.size;
    }),
  }),
  selectors: {
    allWindows: slice => slice.windows,
    activeWindow: slice =>
      slice.windows.find(w => w.id === slice.activeWindowId),
  },
});

export const {
  openWindow,
  closeWindow,
  focusWindow,
  minimizeWindow,
  restoreWindow,
  moveWindow,
  resizeWindow,
} = windowSlice.actions;

export const windowSelectors = windowSlice.selectors;
