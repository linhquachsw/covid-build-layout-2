// @flow
import { assignId } from './share/route';

// export const admins = assignId([
//   {
//     path: '/admin/clients',
//     name: '310000',
//     icon: faUsers,
//   },
// ]);

export type MenuItem = {
  permission?: number,
  path: string,
};

export const clients: Array<MenuItem> = assignId([
  {
    path: '/home',
    name: 'Home',
  },
  {
    path: '/about',
    name: 'About Avellino',
  },
  {
    path: '/product',
    name: 'Product',
  },
  {
    path: '/pricing',
    name: 'Pricing',
  },
  {
    path: '/program',
    name: 'Acts Program',
  },
  {
    path: '/news',
    name: 'News',
  },
  {
    path: '/media',
    name: 'Media Room',
  },
  {
    path: '/contact',
    name: 'Contact US',
  },
  // {
  //   path: '',
  //   permission: 79009,
  //   icon: faQuestion,
  // },
]);
