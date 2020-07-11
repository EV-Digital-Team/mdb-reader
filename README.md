[![CircleCI](https://circleci.com/gh/andipaetzold/mdb-reader/tree/main.svg?style=svg)](https://circleci.com/gh/andipaetzold/mdb-reader/tree/main)
[![Downloads](https://img.shields.io/npm/dm/mdb-reader)](https://www.npmjs.com/package/mdb-reader)
[![Version](https://img.shields.io/npm/v/mdb-reader.svg)](https://www.npmjs.com/package/mdb-reader)

# MDB Reader

Node Library to read data from Access databases.

## Installation

```sh
npm install mdb-reader
```

or

```sh
yarn add mdb-reader
```

## Compatibility

### Node / JavaScript

TBD

### Access Database versions

-   Access 97 (Jet 3)
-   Access 2000, XP and 2003 (Jet 4)
-   Access 2010 (ACE14)
-   Access 2013 (ACE15)
-   Access 2016 (ACE16)

_Jet 3 databases were not tested during development_

## Usage

```javascript
import { readFileSync } from "fs";
import MDBReader from "mdb-reader";

const buffer = readFileSync("database.mdb");
const reader = new MDBReader(buffer);

reader.getTableNames(); // ['Cats', 'Dogs', 'Cars']

const table = reader.getTable("Cats");
table.getColumnNames(); // ['id', 'name', 'color']
table.getData(); // [{id: 5, name: 'Ashley', color: 'black'}, ...]
```

## API

### MDBReader

```typescript
class MDBReader {
    /**
     * @param buffer Buffer of the database.
     */
    constructor(buffer: Buffer);

    /**
     * Buffer of the database.
     */
    readonly buffer: Buffer;

    getFormat(): "Jet3" | "Jet4";

    /**
     * Returns an array of table names.
     *
     * @param normalTables Includes user tables.
     * @param systemTables Includes system tables.
     * @param linkedTables Includes linked tables.
     */
    getTableNames({
        normalTables,
        systemTables,
        linkedTables,
    }?: {
        normalTables: boolean;
        systemTables: boolean;
        linkedTables: boolean;
    }): string[];

    /**
     * Returns a table by its name.
     *
     * @param name Name of the table. Case sensitive.
     */
    getTable(name: string): Table;
}
```

### Table

```typescript
class Table {

    /**
     * Name of the table
     */
    readonly name: string,

    /**
     * Number of rows.
     */
    readonly rowCount: number;

    /**
     * Number of columns.
     */
    readonly columnCount: number;

    /**
     * Returns an ordered array of all column definitions.
     */
    getColumns(): Column[];

    /**
     * Returns a column definition by its name.
     *
     * @param name Name of the column. Case sensitive.
     */
    getColumn(name: string): Column;

    /**
     * Returns an ordered array of all column names.
     */
    getColumnNames(): string[];

    /**
     * Returns all rows.
     */
    getData(): {
        [column: string]: number | string | Buffer | Date | boolean | null;
    };
}
```

### Column

```typescript
interface Column {
    /**
     * Name of the table
     */
    name: string;

    /**
     * Type of the table
     */
    type:
        | "boolean"
        | "byte"
        | "integer"
        | "long"
        | "money"
        | "float"
        | "double"
        | "datetime"
        | "binary"
        | "text"
        | "ole"
        | "memo"
        | "repid"
        | "numeric"
        | "complex";
    size: number;

    fixedLength: boolean;
    nullable: boolean;
    autoLong: boolean;
    autoUUID: boolean;

    /**
     * Only exists if type = 'numeric'
     */
    precision?: number;

    /**
     * Only exists if type = 'numeric'
     */
    scale?: number;
}
```

## Resources

### MDB Tool

[GitHub](https://github.com/brianb/mdbtools)

Set of applications to read and write Access files, written in C. Main source of knowledge about the file structure and algorithms to extract data from it.

### Jackcess

[Jackcess](https://jackcess.sourceforge.io)

Java library to read and write Access files. It inspired the interface of this library. The databases used for testing are copied from the [repository](https://github.com/jahlborn/jackcess).

## License

[MIT](LICENSE)
