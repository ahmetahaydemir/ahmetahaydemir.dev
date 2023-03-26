import type { SkillData } from "./SkillDataStructure";

export interface ClassData {
    Identifier: string;
    EffectArray: EffectData[];
}
export interface EffectData {
    Size: number;
    Description: string;
    Skill: SkillData;
}