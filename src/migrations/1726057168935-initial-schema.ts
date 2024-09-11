import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialSchema1726057168935 implements MigrationInterface {
    name = 'InitialSchema1726057168935'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "email" varchar NOT NULL, "password" varchar NOT NULL, "token" varchar)`);
        await queryRunner.query(`CREATE TABLE "product" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "photo" varchar, "name" varchar NOT NULL, "stock" integer NOT NULL, "price" float NOT NULL, "category" varchar NOT NULL DEFAULT ('Medicine'))`);
        await queryRunner.query(`CREATE TABLE "supplier" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "name" varchar NOT NULL, "address" varchar NOT NULL, "company" varchar NOT NULL, "date" varchar NOT NULL, "amount" float NOT NULL, "status" varchar NOT NULL DEFAULT ('Inactive'))`);
        await queryRunner.query(`CREATE TABLE "customer" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "image" varchar, "name" varchar NOT NULL, "email" varchar NOT NULL, "spent" float NOT NULL, "phone" varchar NOT NULL, "address" varchar NOT NULL, "registeredAt" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "order" ("id" integer PRIMARY KEY AUTOINCREMENT NOT NULL, "customerName" varchar NOT NULL, "address" varchar NOT NULL, "quantity" integer NOT NULL, "amount" float NOT NULL, "status" varchar NOT NULL DEFAULT ('Pending'), "date" varchar NOT NULL)`);
        await queryRunner.query(`CREATE TABLE "product_suppliers_supplier" ("productId" integer NOT NULL, "supplierId" integer NOT NULL, PRIMARY KEY ("productId", "supplierId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d13f061c3361c028fd062a96a9" ON "product_suppliers_supplier" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aa97955af2c87f6e87271eea64" ON "product_suppliers_supplier" ("supplierId") `);
        await queryRunner.query(`DROP INDEX "IDX_d13f061c3361c028fd062a96a9"`);
        await queryRunner.query(`DROP INDEX "IDX_aa97955af2c87f6e87271eea64"`);
        await queryRunner.query(`CREATE TABLE "temporary_product_suppliers_supplier" ("productId" integer NOT NULL, "supplierId" integer NOT NULL, CONSTRAINT "FK_d13f061c3361c028fd062a96a98" FOREIGN KEY ("productId") REFERENCES "product" ("id") ON DELETE CASCADE ON UPDATE CASCADE, CONSTRAINT "FK_aa97955af2c87f6e87271eea64b" FOREIGN KEY ("supplierId") REFERENCES "supplier" ("id") ON DELETE NO ACTION ON UPDATE NO ACTION, PRIMARY KEY ("productId", "supplierId"))`);
        await queryRunner.query(`INSERT INTO "temporary_product_suppliers_supplier"("productId", "supplierId") SELECT "productId", "supplierId" FROM "product_suppliers_supplier"`);
        await queryRunner.query(`DROP TABLE "product_suppliers_supplier"`);
        await queryRunner.query(`ALTER TABLE "temporary_product_suppliers_supplier" RENAME TO "product_suppliers_supplier"`);
        await queryRunner.query(`CREATE INDEX "IDX_d13f061c3361c028fd062a96a9" ON "product_suppliers_supplier" ("productId") `);
        await queryRunner.query(`CREATE INDEX "IDX_aa97955af2c87f6e87271eea64" ON "product_suppliers_supplier" ("supplierId") `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP INDEX "IDX_aa97955af2c87f6e87271eea64"`);
        await queryRunner.query(`DROP INDEX "IDX_d13f061c3361c028fd062a96a9"`);
        await queryRunner.query(`ALTER TABLE "product_suppliers_supplier" RENAME TO "temporary_product_suppliers_supplier"`);
        await queryRunner.query(`CREATE TABLE "product_suppliers_supplier" ("productId" integer NOT NULL, "supplierId" integer NOT NULL, PRIMARY KEY ("productId", "supplierId"))`);
        await queryRunner.query(`INSERT INTO "product_suppliers_supplier"("productId", "supplierId") SELECT "productId", "supplierId" FROM "temporary_product_suppliers_supplier"`);
        await queryRunner.query(`DROP TABLE "temporary_product_suppliers_supplier"`);
        await queryRunner.query(`CREATE INDEX "IDX_aa97955af2c87f6e87271eea64" ON "product_suppliers_supplier" ("supplierId") `);
        await queryRunner.query(`CREATE INDEX "IDX_d13f061c3361c028fd062a96a9" ON "product_suppliers_supplier" ("productId") `);
        await queryRunner.query(`DROP INDEX "IDX_aa97955af2c87f6e87271eea64"`);
        await queryRunner.query(`DROP INDEX "IDX_d13f061c3361c028fd062a96a9"`);
        await queryRunner.query(`DROP TABLE "product_suppliers_supplier"`);
        await queryRunner.query(`DROP TABLE "order"`);
        await queryRunner.query(`DROP TABLE "customer"`);
        await queryRunner.query(`DROP TABLE "supplier"`);
        await queryRunner.query(`DROP TABLE "product"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }

}
