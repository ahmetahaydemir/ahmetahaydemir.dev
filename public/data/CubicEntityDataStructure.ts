import type { EntityStatistic } from "./EntityDataStructure";

export interface EquipmentData {
    Identifier: string;
    Type: CubicEntityType;
    OriginID: string;
    Statistics: EntityStatistic[];
    SkillID: string;
}

export enum CubicEntityType {
    Spawn,
    Equipment,
    Node
}