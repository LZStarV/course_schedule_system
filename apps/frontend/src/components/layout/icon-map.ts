import { h } from 'vue';
import { NIcon } from 'naive-ui';
import {
  SettingsOutline,
  PeopleOutline,
  CheckmarkCircleOutline,
  ListOutline,
  CalendarOutline,
  BookOutline,
  PencilOutline,
  PersonOutline,
} from '@vicons/ionicons5';

const map: Record<string, any> = {
  settings: SettingsOutline,
  people: PeopleOutline,
  check: CheckmarkCircleOutline,
  checklist: ListOutline,
  calendar: CalendarOutline,
  book: BookOutline,
  edit_note: PencilOutline,
  user: PersonOutline,
};

export function renderIconFn(name?: string) {
  const IconComp = name ? map[name] : null;
  if (!IconComp) return undefined;
  return () => h(NIcon, null, { default: () => h(IconComp) });
}

export function iconNameOrError(name?: string) {
  if (!name || !map[name]) return 'error';
  return name;
}
