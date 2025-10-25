export const tagColors = [
  {
    name: 'Red',
    value: 'red',
    class: 'bg-gradient-to-tr from-red-500 to-red-700',
  },
  {
    name: 'Orange',
    value: 'orange',
    class: 'bg-gradient-to-tr from-orange-400 to-orange-600',
  },
  {
    name: 'Yellow',
    value: 'yellow',
    class: 'bg-gradient-to-tr from-amber-400 to-amber-600',
  },
  {
    name: 'Green',
    value: 'green',
    class: 'bg-gradient-to-tr from-emerald-500 to-emerald-700',
  },
  {
    name: 'Teal',
    value: 'teal',
    class: 'bg-gradient-to-tr from-teal-400 to-cyan-600',
  },
  {
    name: 'Blue',
    value: 'blue',
    class: 'bg-gradient-to-tr from-sky-500 to-blue-700',
  },
  {
    name: 'Indigo',
    value: 'indigo',
    class: 'bg-gradient-to-tr from-indigo-500 to-indigo-700',
  },
  {
    name: 'Purple',
    value: 'purple',
    class: 'bg-gradient-to-tr from-violet-500 to-purple-700',
  },
  {
    name: 'Pink',
    value: 'pink',
    class: 'bg-gradient-to-tr from-pink-500 to-rose-600',
  },
  {
    name: 'Gray',
    value: 'gray',
    class: 'bg-gradient-to-tr from-slate-500 to-slate-700',
  },
];

export type TagColor = (typeof tagColors)[number];

export const LINKS_PER_PAGE = 20;
