import type { SkillData } from "./SkillDataStructure";

export interface OriginData {
    Identifier: string;
    EffectArray: EffectData[];
}
export interface EffectData {
    Size: number;
    Description: string;
    Skill: SkillData;
}