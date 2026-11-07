import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddFreeItineraryCreditGrantFlag1794086400000 implements MigrationInterface {
  name = 'AddFreeItineraryCreditGrantFlag1794086400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "free_itinerary_credits_granted" boolean NOT NULL DEFAULT false`,
    );
    await queryRunner.query(
      `UPDATE "users" SET "free_itinerary_credits_granted" = true`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" DROP COLUMN "free_itinerary_credits_granted"`,
    );
  }
}
