import type { SkillData } from "./SkillDataStructure";

export interface TeamEffectData {
    Identifier: string;
    EffectArray: EffectData[];
}
export interface EffectData {
    Size: number;
    Description: string;
    Skill: SkillData;
}