import type { Size } from "./ObjectDataStructure";

export interface EntityDataJSONFile {
    battleEntityDataJsonArray: EntityDataJSONArray[];
    restEntityDataJsonArray: EntityDataJSONArray[];
    eventEntityDataJsonArray: EntityDataJSONArray[];
    treasureEntityDataJsonArray: EntityDataJSONArray[];
}

export interface EntityDataJSONArray {
    Identifier: string;
    OriginID: string;
    ClassID: string;
    Value: number;
    Size: Size;
    Statistics: EntityStatistic[];
    SkillID: string;
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