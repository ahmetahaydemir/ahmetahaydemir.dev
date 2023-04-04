// import type { SkillData } from "./SkillDataStructure";
// import type { ClassData } from "./ClassDataStructure";
// import type { OriginData } from "./OriginDataStructure";

export interface EntityData {
    Identifier: string;
    OriginID: string;
    ClassID: string;
    Rarity: number;
    Statistics: EntityStatistic[];
    SkillID: string
}

export interface EntityStatistic {
    StatType: EntityStatisticType;
    StatAmount: number;
}

export enum EntityStatisticType {
    Health,
    MaxHealth,
    Power,
    Defence,
    Range,
    Speed,
    Gold,
    ActionPoint,
    ExperiencePoint
}
