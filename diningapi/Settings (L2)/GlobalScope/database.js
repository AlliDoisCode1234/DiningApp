/**
 * database object pollutes namespace when imported, workaround could use static
 */
const database = {};
global.__database = database;
