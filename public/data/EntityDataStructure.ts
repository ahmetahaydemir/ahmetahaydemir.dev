import type { SkillData } from "./SkillDataStructure";
import type { TeamEffectData } from "./TeamEffectDataStructure";

export interface EntityData {
    Identifier: string;
    Origin: TeamEffectData;
    Class: TeamEffectData;
    Rarity: number;
    Health: number;
    Power: number;
    Defence: number;
    Speed: number;
    Range: number;
    Skill: SkillData
}