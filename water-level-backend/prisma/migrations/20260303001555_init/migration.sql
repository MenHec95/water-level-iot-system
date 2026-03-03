-- CreateTable
CREATE TABLE "readings" (
    "id" SERIAL NOT NULL,
    "level" INTEGER NOT NULL,
    "mode" INTEGER NOT NULL,
    "alert" BOOLEAN NOT NULL,
    "calib" BOOLEAN NOT NULL,
    "uptime" INTEGER NOT NULL,
    "savedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "serverTimestamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "readings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "readings_savedAt_idx" ON "readings"("savedAt");

-- CreateIndex
CREATE INDEX "readings_alert_idx" ON "readings"("alert");
