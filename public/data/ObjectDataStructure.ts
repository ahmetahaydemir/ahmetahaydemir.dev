import type { EntityStatistic } from "./EntityDataStructure";

export interface ObjectDataJSONFile {
    equipmentObjectDataJsonArray: ObjectDataJSONArray[];
    nodeObjectDataJsonArray: ObjectDataJSONArray[];
    spawnObjectDataJsonArray: ObjectDataJSONArray[];
}

export interface ObjectDataJSONArray {
    Identifier: string;
    Type: ObjectType;
    OriginID: string;
    Value: number;
    Size: Size;
    Lifetime: number;
    Block: boolean;
    Statistics: EntityStatistic[];
    SkillID: string;
}

export interface Size {
    x: number;
    y: number;
}

export enum ObjectType {
    Spawn,
    Equipment,
    Node
}
