-- CreateEnum
CREATE TYPE "blood_group" AS ENUM ('A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-');

-- CreateEnum
CREATE TYPE "donation_status" AS ENUM ('SCHEDULED', 'COMPLETED', 'CANCELLED', 'NO_SHOW');

-- CreateEnum
CREATE TYPE "request_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED', 'FULFILLED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "urgency_level" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'DONOR', 'SEEKER', 'BLOOD_BANK', 'HOSPITAL');

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "actor_user_id" UUID,
    "action" VARCHAR(120) NOT NULL,
    "entity_type" VARCHAR(80) NOT NULL,
    "entity_id" UUID,
    "meta" JSONB,
    "ip_address" VARCHAR(60),
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blood_bank_profiles" (
    "user_id" UUID NOT NULL,
    "bank_name" VARCHAR(150) NOT NULL,
    "license_no" VARCHAR(80) NOT NULL,
    "address" TEXT NOT NULL,

    CONSTRAINT "blood_bank_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "blood_requests" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "requester_user_id" UUID NOT NULL,
    "requested_for_patient_name" VARCHAR(120),
    "blood_group" "blood_group" NOT NULL,
    "units_needed" INTEGER NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "needed_on" DATE NOT NULL,
    "urgency" "urgency_level" NOT NULL DEFAULT 'MEDIUM',
    "status" "request_status" NOT NULL DEFAULT 'PENDING',
    "assigned_blood_bank_id" UUID,
    "reason" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blood_requests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donations" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "donor_user_id" UUID NOT NULL,
    "request_id" UUID,
    "blood_bank_id" UUID,
    "hospital_id" UUID,
    "scheduled_on" TIMESTAMPTZ(6) NOT NULL,
    "status" "donation_status" NOT NULL DEFAULT 'SCHEDULED',
    "completed_at" TIMESTAMPTZ(6),
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "donations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "donor_profiles" (
    "user_id" UUID NOT NULL,
    "blood_group" "blood_group" NOT NULL,
    "date_of_birth" DATE NOT NULL,
    "weight_kg" DECIMAL(5,2) NOT NULL,
    "last_donation_date" DATE,
    "is_available" BOOLEAN NOT NULL DEFAULT true,
    "medical_notes" TEXT,

    CONSTRAINT "donor_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "fulfillments" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "request_id" UUID NOT NULL,
    "blood_bank_id" UUID NOT NULL,
    "inventory_lot_id" UUID NOT NULL,
    "units_used" INTEGER NOT NULL,
    "fulfilled_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "fulfillments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hospital_profiles" (
    "user_id" UUID NOT NULL,
    "hospital_name" VARCHAR(150) NOT NULL,
    "license_no" VARCHAR(80) NOT NULL,
    "address" TEXT NOT NULL,
    "is_verified" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "hospital_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "inventory_lots" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "blood_bank_id" UUID NOT NULL,
    "blood_group" "blood_group" NOT NULL,
    "units_available" INTEGER NOT NULL,
    "collected_on" DATE NOT NULL DEFAULT CURRENT_DATE,
    "expires_on" DATE NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "inventory_lots_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "notifications" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "title" VARCHAR(150) NOT NULL,
    "message" TEXT NOT NULL,
    "is_read" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "notifications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seeker_profiles" (
    "user_id" UUID NOT NULL,
    "identity_cnic" VARCHAR(30),
    "emergency_contact" VARCHAR(25),

    CONSTRAINT "seeker_profiles_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "test_table_check" (
    "id" SERIAL NOT NULL,
    "name" TEXT,

    CONSTRAINT "test_table_check_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "role" "user_role" NOT NULL,
    "full_name" VARCHAR(120) NOT NULL,
    "email" VARCHAR(200) NOT NULL,
    "phone" VARCHAR(25) NOT NULL,
    "password_hash" TEXT NOT NULL,
    "city" VARCHAR(80) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "idx_audit_actor_time" ON "audit_logs"("actor_user_id", "created_at");

-- CreateIndex
CREATE UNIQUE INDEX "blood_bank_profiles_license_no_key" ON "blood_bank_profiles"("license_no");

-- CreateIndex
CREATE INDEX "idx_blood_requests_group_city" ON "blood_requests"("blood_group", "city");

-- CreateIndex
CREATE INDEX "idx_blood_requests_status" ON "blood_requests"("status");

-- CreateIndex
CREATE INDEX "idx_donations_donor" ON "donations"("donor_user_id");

-- CreateIndex
CREATE INDEX "idx_donations_status" ON "donations"("status");

-- CreateIndex
CREATE INDEX "idx_fulfillments_request" ON "fulfillments"("request_id");

-- CreateIndex
CREATE UNIQUE INDEX "hospital_profiles_license_no_key" ON "hospital_profiles"("license_no");

-- CreateIndex
CREATE INDEX "idx_inventory_bank_group" ON "inventory_lots"("blood_bank_id", "blood_group");

-- CreateIndex
CREATE INDEX "idx_inventory_expiry" ON "inventory_lots"("expires_on");

-- CreateIndex
CREATE INDEX "idx_notifications_user_read" ON "notifications"("user_id", "is_read");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "idx_users_city" ON "users"("city");

-- CreateIndex
CREATE INDEX "idx_users_role" ON "users"("role");

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_actor_user_id_fkey" FOREIGN KEY ("actor_user_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blood_bank_profiles" ADD CONSTRAINT "blood_bank_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blood_requests" ADD CONSTRAINT "blood_requests_assigned_blood_bank_id_fkey" FOREIGN KEY ("assigned_blood_bank_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "blood_requests" ADD CONSTRAINT "blood_requests_requester_user_id_fkey" FOREIGN KEY ("requester_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_blood_bank_id_fkey" FOREIGN KEY ("blood_bank_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_donor_user_id_fkey" FOREIGN KEY ("donor_user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_hospital_id_fkey" FOREIGN KEY ("hospital_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donations" ADD CONSTRAINT "donations_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "blood_requests"("id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "donor_profiles" ADD CONSTRAINT "donor_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_blood_bank_id_fkey" FOREIGN KEY ("blood_bank_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_inventory_lot_id_fkey" FOREIGN KEY ("inventory_lot_id") REFERENCES "inventory_lots"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "fulfillments" ADD CONSTRAINT "fulfillments_request_id_fkey" FOREIGN KEY ("request_id") REFERENCES "blood_requests"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "hospital_profiles" ADD CONSTRAINT "hospital_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "inventory_lots" ADD CONSTRAINT "inventory_lots_blood_bank_id_fkey" FOREIGN KEY ("blood_bank_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "notifications" ADD CONSTRAINT "notifications_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "seeker_profiles" ADD CONSTRAINT "seeker_profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION;
