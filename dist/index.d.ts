declare enum ColumnType {
    Boolean = "boolean",
    Byte = "byte",
    Integer = "integer",
    Long = "long",
    Currency = "currency",
    Float = "float",
    Double = "double",
    DateTime = "datetime",
    Binary = "binary",
    Text = "text",
    OLE = "ole",
    Memo = "memo",
    RepID = "repid",
    Numeric = "numeric",
    Complex = "complex",
    BigInt = "bigint",
    DateTimeExtended = "datetimextended"
}
declare type ValueMap = {
    [ColumnType.Binary]: Buffer;
    [ColumnType.BigInt]: bigint;
    [ColumnType.Boolean]: boolean;
    [ColumnType.Byte]: number;
    [ColumnType.Complex]: number;
    [ColumnType.Currency]: string;
    [ColumnType.DateTime]: Date;
    [ColumnType.DateTimeExtended]: string;
    [ColumnType.Double]: number;
    [ColumnType.Float]: number;
    [ColumnType.Integer]: number;
    [ColumnType.Long]: number;
    [ColumnType.Memo]: string;
    [ColumnType.Numeric]: string;
    [ColumnType.OLE]: Buffer;
    [ColumnType.RepID]: string;
    [ColumnType.Text]: string;
};
declare type Value = ValueMap[ColumnType] | null;
interface SortOrder {
    value: number;
    version: number;
}

interface Column {
    /**
     * Name of the table
     */
    name: string;
    /**
     * Type of the table
     */
    type: ColumnType;
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

interface JetFormat {
    codecType: CodecType;
    pageSize: number;
    textEncoding: "unknown" | "ucs-2";
    defaultSortOrder: Readonly<SortOrder>;
    databaseDefinitionPage: {
        encryptedSize: number;
        passwordSize: number;
        creationDateOffset: number | null;
        defaultSortOrder: {
            offset: number;
            size: number;
        };
    };
    dataPage: {
        recordCountOffset: number;
        record: {
            countOffset: number;
            columnCountSize: number;
            variableColumnCountSize: 1 | 2;
        };
    };
    tableDefinitionPage: {
        rowCountOffset: number;
        columnCountOffset: number;
        variableColumnCountOffset: number;
        logicalIndexCountOffset: number;
        realIndexCountOffset: number;
        realIndexStartOffset: number;
        realIndexEntrySize: number;
        columnsDefinition: {
            typeOffset: number;
            indexOffset: number;
            flagsOffset: number;
            sizeOffset: number;
            variableIndexOffset: number;
            fixedIndexOffset: number;
            entrySize: number;
        };
        columnNames: {
            /**
             * Number of bytes that store the length of the column name
             */
            nameLengthSize: number;
        };
        usageMapOffset: number;
    };
}
declare const enum CodecType {
    JET = 0,
    MSISAM = 1,
    OFFICE = 2
}

declare class Database {
    private readonly buffer;
    readonly password: string;
    readonly format: JetFormat;
    private readonly codecHandler;
    private readonly databaseDefinitionPage;
    constructor(buffer: Buffer, password: string);
    getPassword(): string | null;
    private getPasswordMask;
    getCreationDate(): Date | null;
    getDefaultSortOrder(): Readonly<SortOrder>;
    getPage(page: number): Buffer;
    /**
     * @param pageRow Lower byte contains the row number, the upper three contain page
     *
     * @see https://github.com/brianb/mdbtools/blob/d6f5745d949f37db969d5f424e69b54f0da60b9b/src/libmdb/data.c#L102-L124
     */
    findPageRow(pageRow: number): Buffer;
    /**
     * @param pageBuffer Buffer of a data page
     *
     * @see https://github.com/brianb/mdbtools/blob/d6f5745d949f37db969d5f424e69b54f0da60b9b/src/libmdb/data.c#L126-L138
     */
    findRow(pageBuffer: Buffer, row: number): Buffer;
}

declare class Table {
    readonly name: string;
    private readonly db;
    private readonly firstDefinitionPage;
    private readonly definitionBuffer;
    private readonly dataPages;
    /**
     * Number of rows.
     */
    readonly rowCount: number;
    /**
     * Number of columns.
     */
    readonly columnCount: number;
    private readonly variableColumnCount;
    private readonly fixedColumnCount;
    private readonly logicalIndexCount;
    private readonly realIndexCount;
    /**
     * @param name Table name. As this is stored in a MSysObjects, it has to be passed in
     * @param db
     * @param firstDefinitionPage The first page of the table definition referenced in the corresponding MSysObject
     */
    constructor(name: string, db: Database, firstDefinitionPage: number);
    /**
     * Returns a column definition by its name.
     *
     * @param name Name of the column. Case sensitive.
     */
    getColumn(name: string): Column;
    /**
     * Returns an ordered array of all column definitions.
     */
    getColumns(): Column[];
    private getColumnDefinitions;
    /**
     * Returns an ordered array of all column names.
     */
    getColumnNames(): string[];
    /**
     * Returns data from the table.
     *
     * @param columns Columns to be returned. Defaults to all columns.
     * @param rowOffset Index of the first row to be returned. 0-based. Defaults to 0.
     * @param rowLimit Maximum number of rows to be returned. Defaults to Infinity.
     */
    getData<TRow extends {
        [column in TColumn]: Value;
    }, TColumn extends string = string>(options?: {
        columns?: ReadonlyArray<string>;
        rowOffset?: number;
        rowLimit?: number;
    }): TRow[];
    private getDataPage;
    private getRecordOffsets;
    private getDataFromPage;
}

interface Options {
    password?: string;
}
declare class MDBReader {
    private readonly buffer;
    private readonly sysObjects;
    private readonly db;
    /**
     * @param buffer Buffer of the database.
     */
    constructor(buffer: Buffer, { password }?: Options);
    /**
     * Date when the database was created
     */
    getCreationDate(): Date | null;
    /**
     * Database password
     */
    getPassword(): string | null;
    /**
     * Default sort order
     */
    getDefaultSortOrder(): Readonly<SortOrder>;
    /**
     * Returns an array of table names.
     *
     * @param normalTables Includes user tables. Default true.
     * @param systemTables Includes system tables. Default false.
     * @param linkedTables Includes linked tables. Default false.
     */
    getTableNames({ normalTables, systemTables, linkedTables, }?: {
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

export { Column, ColumnType, Options, SortOrder, Table, Value, ValueMap, MDBReader as default };
