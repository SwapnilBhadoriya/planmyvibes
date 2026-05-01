-- CreateEnum
CREATE TYPE "DestinationType" AS ENUM ('country', 'state', 'city');

-- CreateEnum
CREATE TYPE "TravelMode" AS ENUM ('car', 'bike', 'train', 'flight', 'bus', 'mixed');

-- CreateEnum
CREATE TYPE "TripType" AS ENUM ('solo', 'couple', 'family', 'group');

-- CreateEnum
CREATE TYPE "DifficultyLevel" AS ENUM ('easy', 'moderate', 'hard');

-- CreateEnum
CREATE TYPE "ActivityType" AS ENUM ('sightseeing', 'food', 'travel', 'adventure', 'relaxation', 'shopping', 'other');

-- CreateEnum
CREATE TYPE "TransportMode" AS ENUM ('walk', 'scooter', 'bike', 'car', 'cab', 'bus', 'metro', 'train', 'flight');

-- CreateTable
CREATE TABLE "destinations" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "slug" VARCHAR(150) NOT NULL,
    "type" "DestinationType" NOT NULL,
    "parentId" VARCHAR(100),
    "country" VARCHAR(100),
    "state" VARCHAR(100),
    "description" TEXT,
    "shortDescription" VARCHAR(255),
    "bestTimeStartMonth" INTEGER,
    "bestTimeEndMonth" INTEGER,
    "bestTimeNote" TEXT,
    "avgBudgetPerDay" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "places" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(255),
    "destinationId" VARCHAR(100),
    "type" VARCHAR(50),
    "description" TEXT,
    "priceMin" INTEGER,
    "priceMax" INTEGER,
    "durationMinutes" INTEGER,
    "rating" DECIMAL(2,1),
    "address" TEXT,
    "googleMapsLink" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itineraries" (
    "id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255),
    "subtitle" VARCHAR(255),
    "description" TEXT,
    "durationDays" INTEGER,
    "budgetMin" INTEGER,
    "budgetMax" INTEGER,
    "currency" VARCHAR(10),
    "tripType" "TripType",
    "difficulty" "DifficultyLevel",
    "minPeople" INTEGER,
    "maxPeople" INTEGER,
    "totalPlaces" INTEGER,
    "estimatedBudget" INTEGER,
    "travelMode" "TravelMode",
    "stayNights" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_destinations" (
    "id" SERIAL NOT NULL,
    "itineraryId" VARCHAR(100) NOT NULL,
    "destinationId" VARCHAR(100) NOT NULL,
    "position" INTEGER,

    CONSTRAINT "itinerary_destinations_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "itinerary_days" (
    "id" SERIAL NOT NULL,
    "itineraryId" VARCHAR(100) NOT NULL,
    "dayNumber" INTEGER,
    "title" VARCHAR(255),
    "destinationId" VARCHAR(100),

    CONSTRAINT "itinerary_days_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activities" (
    "id" VARCHAR(100) NOT NULL,
    "dayId" INTEGER,
    "title" VARCHAR(255),
    "activityType" "ActivityType",
    "startTime" TIME,
    "endTime" TIME,
    "position" INTEGER,
    "notes" TEXT,
    "isOptional" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "activity_places" (
    "id" SERIAL NOT NULL,
    "activityId" VARCHAR(100) NOT NULL,
    "placeId" VARCHAR(100) NOT NULL,

    CONSTRAINT "activity_places_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "transports" (
    "id" SERIAL NOT NULL,
    "activityId" VARCHAR(100),
    "mode" "TransportMode",
    "provider" VARCHAR(100),
    "fromPlaceId" VARCHAR(100),
    "toPlaceId" VARCHAR(100),
    "durationMinutes" INTEGER,
    "distanceKm" DECIMAL(5,2),
    "cost" INTEGER,
    "notes" TEXT,

    CONSTRAINT "transports_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collections" (
    "id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255),
    "description" TEXT,
    "destinationId" VARCHAR(100),
    "type" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "collections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "collection_items" (
    "id" SERIAL NOT NULL,
    "collectionId" VARCHAR(100) NOT NULL,
    "placeId" VARCHAR(100) NOT NULL,
    "position" INTEGER,

    CONSTRAINT "collection_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "blogs" (
    "id" VARCHAR(100) NOT NULL,
    "title" VARCHAR(255),
    "slug" VARCHAR(255),
    "content" TEXT,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100),
    "type" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "blogs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tags" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tag_mappings" (
    "id" SERIAL NOT NULL,
    "tagId" INTEGER NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,

    CONSTRAINT "tag_mappings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tips" (
    "id" SERIAL NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "type" VARCHAR(50),
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "tips_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "images" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "altText" VARCHAR(255),
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "isPrimary" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "rating" INTEGER,
    "comment" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100),
    "email" VARCHAR(255),
    "image" TEXT,
    "role" VARCHAR(20) NOT NULL DEFAULT 'user',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comments" (
    "id" SERIAL NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "content" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "comments_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "saved_itineraries" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "itineraryId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "saved_itineraries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "likes" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(100) NOT NULL,
    "entityType" VARCHAR(50) NOT NULL,
    "entityId" VARCHAR(100) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "destinations_slug_key" ON "destinations"("slug");

-- CreateIndex
CREATE INDEX "itinerary_destinations_itineraryId_idx" ON "itinerary_destinations"("itineraryId");

-- CreateIndex
CREATE INDEX "itinerary_destinations_destinationId_idx" ON "itinerary_destinations"("destinationId");

-- CreateIndex
CREATE INDEX "itinerary_days_itineraryId_idx" ON "itinerary_days"("itineraryId");

-- CreateIndex
CREATE INDEX "itinerary_days_destinationId_idx" ON "itinerary_days"("destinationId");

-- CreateIndex
CREATE UNIQUE INDEX "itinerary_days_itineraryId_dayNumber_key" ON "itinerary_days"("itineraryId", "dayNumber");

-- CreateIndex
CREATE INDEX "activities_dayId_idx" ON "activities"("dayId");

-- CreateIndex
CREATE INDEX "activity_places_activityId_idx" ON "activity_places"("activityId");

-- CreateIndex
CREATE INDEX "activity_places_placeId_idx" ON "activity_places"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "activity_places_activityId_placeId_key" ON "activity_places"("activityId", "placeId");

-- CreateIndex
CREATE INDEX "transports_activityId_idx" ON "transports"("activityId");

-- CreateIndex
CREATE INDEX "transports_fromPlaceId_idx" ON "transports"("fromPlaceId");

-- CreateIndex
CREATE INDEX "transports_toPlaceId_idx" ON "transports"("toPlaceId");

-- CreateIndex
CREATE INDEX "collections_destinationId_idx" ON "collections"("destinationId");

-- CreateIndex
CREATE INDEX "collection_items_collectionId_idx" ON "collection_items"("collectionId");

-- CreateIndex
CREATE INDEX "collection_items_placeId_idx" ON "collection_items"("placeId");

-- CreateIndex
CREATE UNIQUE INDEX "collection_items_collectionId_placeId_key" ON "collection_items"("collectionId", "placeId");

-- CreateIndex
CREATE UNIQUE INDEX "blogs_slug_key" ON "blogs"("slug");

-- CreateIndex
CREATE INDEX "blogs_entityType_entityId_idx" ON "blogs"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "tags_name_key" ON "tags"("name");

-- CreateIndex
CREATE INDEX "tag_mappings_tagId_idx" ON "tag_mappings"("tagId");

-- CreateIndex
CREATE INDEX "tag_mappings_entityType_entityId_idx" ON "tag_mappings"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "tag_mappings_tagId_entityType_entityId_key" ON "tag_mappings"("tagId", "entityType", "entityId");

-- CreateIndex
CREATE INDEX "tips_entityType_entityId_idx" ON "tips"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "images_entityType_entityId_idx" ON "images"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "images_isPrimary_idx" ON "images"("isPrimary");

-- CreateIndex
CREATE INDEX "reviews_entityType_entityId_idx" ON "reviews"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "comments_entityType_entityId_idx" ON "comments"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "saved_itineraries_userId_idx" ON "saved_itineraries"("userId");

-- CreateIndex
CREATE INDEX "saved_itineraries_itineraryId_idx" ON "saved_itineraries"("itineraryId");

-- CreateIndex
CREATE UNIQUE INDEX "saved_itineraries_userId_itineraryId_key" ON "saved_itineraries"("userId", "itineraryId");

-- CreateIndex
CREATE INDEX "likes_userId_idx" ON "likes"("userId");

-- CreateIndex
CREATE INDEX "likes_entityType_entityId_idx" ON "likes"("entityType", "entityId");

-- CreateIndex
CREATE UNIQUE INDEX "likes_userId_entityType_entityId_key" ON "likes"("userId", "entityType", "entityId");

-- AddForeignKey
ALTER TABLE "destinations" ADD CONSTRAINT "destinations_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "places" ADD CONSTRAINT "places_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_destinations" ADD CONSTRAINT "itinerary_destinations_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_destinations" ADD CONSTRAINT "itinerary_destinations_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "itinerary_days" ADD CONSTRAINT "itinerary_days_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activities" ADD CONSTRAINT "activities_dayId_fkey" FOREIGN KEY ("dayId") REFERENCES "itinerary_days"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_places" ADD CONSTRAINT "activity_places_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "activity_places" ADD CONSTRAINT "activity_places_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_activityId_fkey" FOREIGN KEY ("activityId") REFERENCES "activities"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_fromPlaceId_fkey" FOREIGN KEY ("fromPlaceId") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transports" ADD CONSTRAINT "transports_toPlaceId_fkey" FOREIGN KEY ("toPlaceId") REFERENCES "places"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collections" ADD CONSTRAINT "collections_destinationId_fkey" FOREIGN KEY ("destinationId") REFERENCES "destinations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "collections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "collection_items" ADD CONSTRAINT "collection_items_placeId_fkey" FOREIGN KEY ("placeId") REFERENCES "places"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tag_mappings" ADD CONSTRAINT "tag_mappings_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "tags"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comments" ADD CONSTRAINT "comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "saved_itineraries" ADD CONSTRAINT "saved_itineraries_itineraryId_fkey" FOREIGN KEY ("itineraryId") REFERENCES "itineraries"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "likes" ADD CONSTRAINT "likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
