export interface SkillDataJSONFile {
    battleSkillDataJsonArray:   SkillDataJSONArray[];
    restSkillDataJsonArray:     SkillDataJSONArray[];
    eventSkillDataJsonArray:    SkillDataJSONArray[];
    treasureSkillDataJsonArray: SkillDataJSONArray[];
}

export interface SkillDataJSONArray {
    Identifier: string;
    Type: SkillType;
    CastData: CastData;
    TriggerData: TriggerData;
    OccurenceData: OccurenceData[];
}
export interface CastData {
    Point: number;
    Type: CastType;
    TargetingInput: TargetingInput;
    TargetingRange: number;
}
export interface TriggerData {
    ClassFilter: string;
    OriginFilter: string;
    Type: TriggerType;
}
export interface OccurenceData {
    TargetingInput: TargetingInput;
    MultiplierData: MultiplierData;
    StatisticChanges: StatisticChange[];
    StatusChanges: StatusChange[];
    SpawnChanges: SpawnChange[];
}
export interface MultiplierData {
    Type: MultiplierType;
}
export interface StatisticChange {
    TargetStat: StatisticType;
    FlatChange: number;
    PercentageStat: StatisticType;
    PercentageChange: number;
    PercentageBasedOnCaster: boolean;
}
export interface StatusChange {
    Status: string;
}
export interface SpawnChange {
    Spawn: string;
}
//-----------------------
enum SkillType {
    Cast,
    Passive,
    Origin,
    Class,
    Status,
}
enum CastType {
    InstantCast,
    CastOnTargetInRange,
}
enum TriggerType {
    OnNodeStart,
    OnNodeEnd,
}
enum TargetingInput {
    Arena_Ally_Alive_LowestHealth,
    Arena_Ally_Alive_Nearest,
    Arena_Ally_Alive_Random,
    Arena_Enemy_Alive_LowestHealth,
    Arena_Enemy_Alive_Nearest,
    Arena_Enemy_Alive_Random,
    Self,
}
enum MultiplierType {
    Once,
    EntityCount,
}
enum StatisticType {
    Health,
    MaxHealth,
    Power,
    Defence,
    Speed,
}