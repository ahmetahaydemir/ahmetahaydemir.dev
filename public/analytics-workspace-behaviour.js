import EntityDataJsonFile from "./data/EntityDataJsonFile.json" assert { type: "json" };
import ObjectDataJsonFile from "./data/ObjectDataJsonFile.json" assert { type: "json" };
import ClassDataJsonFile from "./data/ClassDataJsonFile.json" assert { type: "json" };
import OriginDataJsonFile from "./data/OriginDataJsonFile.json" assert { type: "json" };
import SkillDataJsonFile from "./data/SkillDataJsonFile.json" assert { type: "json" };
//
console.log("Data Bank - Loaded");
window.entityBank = EntityDataJsonFile.battleEntityDataJsonArray
	.concat(EntityDataJsonFile.restEntityDataJsonArray)
	.concat(EntityDataJsonFile.eventEntityDataJsonArray)
	.concat(EntityDataJsonFile.treasureEntityDataJsonArray);
window.objectBank = ObjectDataJsonFile.equipmentObjectDataJsonArray
	.concat(ObjectDataJsonFile.nodeObjectDataJsonArray)
	.concat(ObjectDataJsonFile.spawnObjectDataJsonArray);
window.classBank = ClassDataJsonFile;
window.originBank = OriginDataJsonFile;
window.skillBank = SkillDataJsonFile.battleSkillDataJsonArray
	.concat(SkillDataJsonFile.restSkillDataJsonArray)
	.concat(SkillDataJsonFile.eventSkillDataJsonArray)
	.concat(SkillDataJsonFile.treasureSkillDataJsonArray);
