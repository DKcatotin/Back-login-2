import { MigrationInterface, QueryRunner } from "typeorm";

export class AddUniqueConstraintsToUser1734209345554 implements MigrationInterface {
    name = 'AddUniqueConstraintsToUser1734209345554'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8"`);
        await queryRunner.query(`ALTER TABLE "user" DROP CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f"`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_7395ecde6cda2e7fe90253ec59f" UNIQUE ("mail")`);
        await queryRunner.query(`ALTER TABLE "user" ADD CONSTRAINT "UQ_065d4d8f3b5adb4a08841eae3c8" UNIQUE ("name")`);
    }

}
