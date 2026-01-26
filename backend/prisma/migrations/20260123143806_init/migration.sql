/*
  Warnings:

  - The primary key for the `replies` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `thread_reactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `threads` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "replies" DROP CONSTRAINT "replies_threadId_fkey";

-- DropForeignKey
ALTER TABLE "thread_reactions" DROP CONSTRAINT "thread_reactions_threadId_fkey";

-- AlterTable
ALTER TABLE "replies" DROP CONSTRAINT "replies_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "threadId" SET DATA TYPE TEXT,
ADD CONSTRAINT "replies_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "replies_id_seq";

-- AlterTable
ALTER TABLE "thread_reactions" DROP CONSTRAINT "thread_reactions_pkey",
ALTER COLUMN "threadId" SET DATA TYPE TEXT,
ADD CONSTRAINT "thread_reactions_pkey" PRIMARY KEY ("threadId", "userId");

-- AlterTable
ALTER TABLE "threads" DROP CONSTRAINT "threads_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "threads_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "threads_id_seq";

-- AddForeignKey
ALTER TABLE "replies" ADD CONSTRAINT "replies_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "thread_reactions" ADD CONSTRAINT "thread_reactions_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "threads"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
