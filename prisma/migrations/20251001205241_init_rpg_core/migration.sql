-- CreateEnum
CREATE TYPE "Rarity" AS ENUM ('common', 'uncommon', 'rare', 'very_rare', 'legendary', 'artifact', 'mythic');

-- CreateEnum
CREATE TYPE "Tier" AS ENUM ('low', 'medium', 'high', 'legendary', 'artifact');

-- CreateEnum
CREATE TYPE "DamageType" AS ENUM ('slash', 'pierce', 'blunt', 'fire', 'cold', 'acid', 'poison', 'necrotic', 'radiant', 'thunder', 'lightning', 'psychic', 'force', 'shadow');

-- CreateEnum
CREATE TYPE "Range" AS ENUM ('melee', 'short', 'medium', 'long', 'extra_long', 'infinite');

-- CreateEnum
CREATE TYPE "ArmorType" AS ENUM ('light', 'medium', 'heavy', 'shield');

-- CreateEnum
CREATE TYPE "ArmorPart" AS ENUM ('helmet', 'chestplate', 'gloves', 'bracers', 'boots', 'cloak', 'shield_part');

-- CreateTable
CREATE TABLE "Item" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "rarity" "Rarity" NOT NULL,
    "tier" "Tier" NOT NULL,
    "value" INTEGER NOT NULL,
    "levelRequired" INTEGER NOT NULL,
    "image" TEXT,
    "setCode" TEXT,
    "setName" TEXT,
    "setBonuses" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Weapon" (
    "itemId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subCategory" TEXT,
    "weight" DOUBLE PRECISION NOT NULL,
    "primaryDamage" JSONB NOT NULL,
    "secondaryDamage" JSONB,
    "damageType" "DamageType" NOT NULL,
    "secondaryDamageType" "DamageType",
    "range" "Range" NOT NULL,
    "specialRange" TEXT,
    "properties" JSONB NOT NULL,
    "elementalType" TEXT,
    "requirements" JSONB NOT NULL,
    "abilitiesActive" JSONB NOT NULL,
    "abilitiesPassive" JSONB NOT NULL,
    "attributeBoosts" JSONB,
    "rarityBoosts" JSONB,
    "disadvantages" JSONB,
    "durability" INTEGER NOT NULL,
    "classRestrictions" JSONB,
    "ongoingEffects" JSONB,
    "targetEffects" JSONB,
    "conditionalEffects" JSONB,
    "grantedResistances" JSONB,

    CONSTRAINT "Weapon_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Armor" (
    "itemId" TEXT NOT NULL,
    "armorPart" "ArmorPart" NOT NULL,
    "armorType" "ArmorType" NOT NULL,
    "subType" TEXT,
    "defenseValue" INTEGER NOT NULL,
    "maxDexBonus" INTEGER,
    "resistances" JSONB NOT NULL,
    "vulnerabilities" JSONB,
    "penalties" JSONB NOT NULL,
    "disadvantages" JSONB,
    "requirements" JSONB NOT NULL,
    "abilities" JSONB NOT NULL,
    "ongoingEffects" JSONB,
    "conditionalEffects" JSONB,
    "attributeBoosts" JSONB,
    "grantedResistances" JSONB,
    "durability" INTEGER NOT NULL,
    "classRestrictions" JSONB,

    CONSTRAINT "Armor_pkey" PRIMARY KEY ("itemId")
);

-- CreateTable
CREATE TABLE "Consumable" (
    "itemId" TEXT NOT NULL,
    "consumableType" TEXT NOT NULL,
    "effectType" TEXT NOT NULL,
    "effectIntensity" JSONB NOT NULL,
    "effectDuration" TEXT NOT NULL,
    "usageConditions" JSONB,
    "quantity" INTEGER NOT NULL,
    "expiration" TIMESTAMP(3),

    CONSTRAINT "Consumable_pkey" PRIMARY KEY ("itemId")
);

-- CreateIndex
CREATE INDEX "Item_rarity_idx" ON "Item"("rarity");

-- CreateIndex
CREATE INDEX "Item_tier_idx" ON "Item"("tier");

-- CreateIndex
CREATE INDEX "Item_setCode_idx" ON "Item"("setCode");

-- CreateIndex
CREATE INDEX "Weapon_damageType_idx" ON "Weapon"("damageType");

-- CreateIndex
CREATE INDEX "Armor_armorType_idx" ON "Armor"("armorType");

-- CreateIndex
CREATE INDEX "Armor_armorPart_idx" ON "Armor"("armorPart");

-- AddForeignKey
ALTER TABLE "Weapon" ADD CONSTRAINT "Weapon_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Armor" ADD CONSTRAINT "Armor_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Consumable" ADD CONSTRAINT "Consumable_itemId_fkey" FOREIGN KEY ("itemId") REFERENCES "Item"("id") ON DELETE CASCADE ON UPDATE CASCADE;
