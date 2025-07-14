import type { ComponentType } from 'react';
import type { AppType } from '../store/windowsSlice';

// 导入所有应用组件
import FinderApp from './apps/FinderApp';
import SafariApp from './apps/SafariApp';
import MailApp from './apps/MailApp';
import MessagesApp from './apps/MessagesApp';
import FaceTimeApp from './apps/FaceTimeApp';
import ImageEditorApp from './apps/ImageEditorApp';
import MarkdownNoteApp from './apps/MarkdownNoteApp';

// 应用配置接口
export interface AppConfig {
  name: string;
  component: ComponentType;
  icon: string;
  defaultSize: { width: number; height: number };
}

// 应用注册表
export const APP_REGISTRY: Record<AppType, AppConfig> = {
  Finder: {
    name: 'Finder',
    component: FinderApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732200.png',
    defaultSize: { width: 300, height: 400 }
  },
  Safari: {
    name: 'Safari',
    component: SafariApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732201.png',
    defaultSize: { width: 500, height: 400 }
  },
  Mail: {
    name: 'Mail',
    component: MailApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732212.png',
    defaultSize: { width: 400, height: 500 }
  },
  Messages: {
    name: 'Messages',
    component: MessagesApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732213.png',
    defaultSize: { width: 350, height: 450 }
  },
  FaceTime: {
    name: 'FaceTime',
    component: FaceTimeApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732214.png',
    defaultSize: { width: 300, height: 350 }
  },
  ImageEditor: {
    name: 'Image Editor',
    component: ImageEditorApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/1998/1998342.png',
    defaultSize: { width: 600, height: 500 }
  },
  MarkdownNote: {
    name: 'Markdown Note',
    component: MarkdownNoteApp,
    icon: 'https://cdn-icons-png.flaticon.com/512/732/732220.png',
    defaultSize: { width: 500, height: 600 }
  }
};

// 获取应用配置
export function getAppConfig(appType: AppType): AppConfig {
  return APP_REGISTRY[appType];
}

// 获取所有应用列表（用于 Dock）
export function getAllApps(): Array<{ name: string; icon: string; appType: AppType }> {
  return Object.entries(APP_REGISTRY).map(([appType, config]) => ({
    name: config.name,
    icon: config.icon,
    appType: appType as AppType
  }));
}
