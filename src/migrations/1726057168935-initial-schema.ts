const {
  MigrationInterface,
  TableIndex,
  QueryRunner,
  Table,
  TableForeignKey,
} = require('typeorm');

module.exports = class InitialSchema1726057168935 {
  name = 'InitialSchema1726057168935';

  async up(queryRunner) {
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'email', type: 'varchar', isNullable: false },
          { name: 'password', type: 'varchar', isNullable: false },
          { name: 'token', type: 'varchar', isNullable: true },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'product',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'photo', type: 'varchar', isNullable: true },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'stock', type: 'integer', isNullable: false },
          { name: 'price', type: 'float', isNullable: false },
          {
            name: 'category',
            type: 'varchar',
            default: `'Medicine'`,
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'supplier',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'address', type: 'varchar', isNullable: false },
          { name: 'company', type: 'varchar', isNullable: false },
          { name: 'date', type: 'varchar', isNullable: false },
          { name: 'amount', type: 'float', isNullable: false },
          {
            name: 'status',
            type: 'varchar',
            default: `'Inactive'`,
            isNullable: false,
          },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'customer',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'image', type: 'varchar', isNullable: true },
          { name: 'name', type: 'varchar', isNullable: false },
          { name: 'email', type: 'varchar', isNullable: false },
          { name: 'spent', type: 'float', isNullable: false },
          { name: 'phone', type: 'varchar', isNullable: false },
          { name: 'address', type: 'varchar', isNullable: false },
          { name: 'registeredAt', type: 'varchar', isNullable: false },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'order',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          { name: 'customerName', type: 'varchar', isNullable: false },
          { name: 'address', type: 'varchar', isNullable: false },
          { name: 'quantity', type: 'integer', isNullable: false },
          { name: 'amount', type: 'float', isNullable: false },
          {
            name: 'status',
            type: 'varchar',
            default: `'Pending'`,
            isNullable: false,
          },
          { name: 'date', type: 'varchar', isNullable: false },
        ],
      }),
    );

    await queryRunner.createTable(
      new Table({
        name: 'product_suppliers_supplier',
        columns: [
          { name: 'productId', type: 'integer', isNullable: false },
          { name: 'supplierId', type: 'integer', isNullable: false },
        ],
        foreignKeys: [
          new TableForeignKey({
            columnNames: ['productId'],
            referencedTableName: 'product',
            referencedColumnNames: ['id'],
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
          }),
          new TableForeignKey({
            columnNames: ['supplierId'],
            referencedTableName: 'supplier',
            referencedColumnNames: ['id'],
          }),
        ],
      }),
    );

    await queryRunner.createIndex(
      'product_suppliers_supplier',
      new TableIndex({
        name: 'IDX_product_suppliers_productId',
        columnNames: ['productId'],
      }),
    );

    await queryRunner.createIndex(
      'product_suppliers_supplier',
      new TableIndex({
        name: 'IDX_product_suppliers_supplierId',
        columnNames: ['supplierId'],
      }),
    );
  }

  async down(queryRunner) {
    await queryRunner.dropTable('product_suppliers_supplier');
    await queryRunner.dropTable('order');
    await queryRunner.dropTable('customer');
    await queryRunner.dropTable('supplier');
    await queryRunner.dropTable('product');
    await queryRunner.dropTable('user');
  }
};
