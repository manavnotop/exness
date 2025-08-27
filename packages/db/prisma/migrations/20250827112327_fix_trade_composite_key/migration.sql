/*
  Warnings:

  - The primary key for the `Trade` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Changed the type of `price` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `quantity` on the `Trade` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "public"."Trade" DROP CONSTRAINT "Trade_pkey",
DROP COLUMN "price",
ADD COLUMN     "price" DECIMAL(18,8) NOT NULL,
DROP COLUMN "quantity",
ADD COLUMN     "quantity" DECIMAL(18,8) NOT NULL,
ALTER COLUMN "trade_time" SET DATA TYPE TIMESTAMP(6),
ADD CONSTRAINT "Trade_pkey" PRIMARY KEY ("id", "trade_time");
