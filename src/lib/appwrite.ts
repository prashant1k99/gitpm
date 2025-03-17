import { Account, Client } from 'appwrite';

const client = new Client();
client.setProject('67d7997a0007790c7e33');

const account = new Account(client);

export default account
