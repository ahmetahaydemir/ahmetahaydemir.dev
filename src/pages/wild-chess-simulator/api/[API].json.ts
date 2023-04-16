import type { APIRoute } from 'astro';
import { battleSkillDataJsonArray, restSkillDataJsonArray, eventSkillDataJsonArray, treasureSkillDataJsonArray } from '../../../../public/data/SkillDataJsonFile.json';
import { classDataJsonArray } from '../../../../public/data/ClassDataJsonFile.json';
import { originDataJsonArray } from '../../../../public/data/OriginDataJsonFile.json';
import { battleEntityDataJsonArray, restEntityDataJsonArray, eventEntityDataJsonArray, treasureEntityDataJsonArray } from '../../../../public/data/EntityDataJsonFile.json';
import { equipmentCubicDataJsonArray, nodeCubicDataJsonArray, spawnCubicDataJsonArray } from '../../../../public/data/CubicEntityDataJsonFile.json';
import { configDataJson } from '../../../../public/data/GameConfigDataJsonFile.json';

export const get: APIRoute = ({ params, request }) => {
    const API = params.API;
    let jsonData = { Message: "Invalid JSON Data Request" };
    //
    switch (API) {
        case "getEntityData":
            jsonData = { battleEntityDataJsonArray, restEntityDataJsonArray, eventEntityDataJsonArray, treasureEntityDataJsonArray };
            break;
        case "getClassData":
            jsonData = { classDataJsonArray };
            break;
        case "getOriginData":
            jsonData = { originDataJsonArray };
            break;
        case "getSkillData":
            jsonData = { battleSkillDataJsonArray, restSkillDataJsonArray, eventSkillDataJsonArray, treasureSkillDataJsonArray };
            break;
        case "getCubicEntityData":
            jsonData = { equipmentCubicDataJsonArray, nodeCubicDataJsonArray, spawnCubicDataJsonArray };
            break;
        case "getConfigData":
            jsonData = { configDataJson };
            break;
    }
    //
    return {
        body: JSON.stringify(jsonData)
    }
};

export function getStaticPaths() {
    return [
        { params: { API: "getEntityData" } },
        { params: { API: "getClassData" } },
        { params: { API: "getOriginData" } },
        { params: { API: "getSkillData" } },
        { params: { API: "getCubicEntityData" } },
        { params: { API: "getConfigData" } }
    ]
}