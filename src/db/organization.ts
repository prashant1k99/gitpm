import Dexie, { Table } from 'dexie';
import { Favourites, Field, PageInfo, Permissions, Tasks, View } from './schema';

export class OrganizationDB extends Dexie {
  // projects!: Table<Project>;
  views!: Table<View>;
  fields!: Table<Field>;
  permissions!: Table<Permissions>;
  favourites!: Table<Favourites>;
  pageInfo!: Table<PageInfo>;
  tasks!: Table<Tasks>;

  constructor(orgName: string) {
    super(orgName);

    this.version(1).stores({
      // projects: 'id, orgLogin, number',
      views: 'id, number, projectId, layout',
      fields: 'id, projectId',
      permissions: '++id, permissionFor',
      favourites: '++id, itemType',
      pageInfo: '++id, itemType, itemId',
      tasks: "id, projectId"
    });
  }
}

class DBService {
  private dbInstances: {
    [key: string]: OrganizationDB
  }

  constructor() {
    this.dbInstances = {}
  }

  getDatabases(orgLogin: string) {
    if (this.dbInstances[orgLogin]) {
      return this.dbInstances[orgLogin];
    }

    const db = new OrganizationDB(`org_${orgLogin}`);
    // Initial version without project tables

    this.dbInstances[orgLogin] = db;
    return db;
  }
}

const DB = new DBService();

export default DB;
