import Dexie, { Table } from 'dexie';
import { Favourites, Field, PageInfo, Permissions, View } from './schema';

export class OrganizationDB extends Dexie {
  // projects!: Table<Project>;
  views!: Table<View>;
  fields!: Table<Field>;
  permissions!: Table<Permissions>;
  favourites!: Table<Favourites>;
  pageInfo!: Table<PageInfo>;

  constructor() {
    super("GitPMDB");

    this.version(1).stores({
      // projects: 'id, orgLogin, number',
      views: 'id, number, projectId, layout',
      fields: '++id, projectId, isRequired',
      permissions: '++id, permissionFor, orgLogin',
      favourites: '++id, itemType, orgLogin',
      pageInfo: '++id, itemType, itemId, orgLogin',
    });
  }
}

const db = new OrganizationDB();

export default db;
