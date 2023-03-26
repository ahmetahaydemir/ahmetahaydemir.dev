import type { SkillData } from "./SkillDataStructure";
import type { ClassData } from "./ClassDataStructure";
import type { OriginData } from "./OriginDataStructure";

export interface EntityData {
    Identifier: string;
    Origin: OriginData;
    Class: ClassData;
    Rarity: number;
    Health: number;
    Power: number;
    Defence: number;
    Speed: number;
    Range: number;
    Skill: SkillData
}