/**
 * Main routine
 */
function skills() {
    let reader;
    let url = null;

    // Listeners
    let inputUploadJson = document.getElementById('upload_json');
    let btnSaveCsv = document.getElementById('save_csv');
    inputUploadJson.addEventListener('change', ()=>{
        for (let file of inputUploadJson.files) {
            $objJson = null;
            $csv = null;
            reader = new FileReader();

            if (ext(file).toLowerCase() !== 'json') {
                alert('jsonファイルを指定してください。');
                continue;
            }

            reader.readAsText(file, 'UTF-8');
            reader.onload = ()=>{
                $objJson = JSON.parse(reader.result);
                $csv = convertSkillsJsonToCsv();

                if (url) URL.revokeObjectURL(url);

                const blob = new Blob([$csv], {type: 'text/plain'});
                url = URL.createObjectURL(blob);
                btnSaveCsv.href = url;
            };
        }
     });

     let inputUploadCsv = document.getElementById('upload_csv');
     let btnSaveJson = document.getElementById('save_json');
     let tmpJson;
     inputUploadCsv.addEventListener('change', ()=>{
         for (let file of inputUploadCsv.files) {
            $objJson = null;
            $csv = null;
            reader = new FileReader();

            if (ext(file).toLowerCase() !== 'csv') {
                alert('csvファイルを指定してください。');
                continue;
            }

            reader.readAsText(file, 'UTF-8');
            reader.onload = ()=>{
                $csv = reader.result;
                $objJson = convertSkillsCsvToJson();
    
                if (url) URL.revokeObjectURL(url);

                tmpJson = JSON.stringify($objJson);
                tmpJson = tmpJson.replaceAll("<改行>", "\\n");

                const blob = new Blob([tmpJson], {type: 'text/plain'});
                url = URL.createObjectURL(blob);
                btnSaveJson.href = url;
            };
         }
     });
}

function convertSkillsJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        '名前', 
        'アイコン', 
        '説明', 
        'スキルタイプ', 
        '消費MP', 
        '消費TP', 
        '範囲', 
        '使用可能時', 
        '速度補正', 
        '成功率', 
        '連続回数', 
        '得TP', 
        '命中タイプ', 
        'アニメーションID', 
        'メッセージ1行目', 
        'メッセージ2行目', 
        '必要武器タイプ1', 
        '必要武器タイプ2', 
        'ダメージタイプ', 
        '属性', 
        '計算式', 
        '分散度', 
        '会心', 
        '使用効果(編集不可)', 
        'メモ', 
        '???', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].name, 
            $objJson[i].iconIndex, 
            $objJson[i].description.replaceAll("\n", "<改行>"), 
            $objJson[i].stypeId, 
            $objJson[i].mpCost, 
            $objJson[i].tpCost, 
            $objJson[i].scope, 
            $objJson[i].occasion, 
            $objJson[i].speed, 
            $objJson[i].successRate, 
            $objJson[i].repeats, 
            $objJson[i].tpGain, 
            $objJson[i].hitType, 
            $objJson[i].animationId, 
            $objJson[i].message1, 
            $objJson[i].message2, 
            $objJson[i].requiredWtypeId1, 
            $objJson[i].requiredWtypeId2, 
            $objJson[i].damage.type, 
            $objJson[i].damage.elementId, 
            $objJson[i].damage.formula, 
            $objJson[i].damage.variance, 
            $objJson[i].damage.critical, 
            encodeJsonData($objJson[i].effects), 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
            $objJson[i].messageType, 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertSkillsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let skill;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        skill = newSkill();
        skill.id = parseInt(col[0]);
        skill.name = col[1];
        skill.iconIndex = parseInt(col[2]);
        skill.description = col[3];
        skill.stypeId = parseInt(col[4]);
        skill.mpCost = parseInt(col[5]);
        skill.tpCost = parseInt(col[6]);
        skill.scope = parseInt(col[7]);
        skill.occasion = parseInt(col[8]);
        skill.speed = parseInt(col[9]);
        skill.successRate = parseInt(col[10]);
        skill.repeats = parseInt(col[11]);
        skill.tpGain = parseInt(col[12]);
        skill.hitType = parseInt(col[13]);
        skill.animationId = parseInt(col[14]);
        skill.message1 = col[15];
        skill.message2 = col[16];
        skill.requiredWtypeId1 = parseInt(col[17]);
        skill.requiredWtypeId2 = parseInt(col[18]);
        skill.damage = {
            type: parseInt(col[19]), 
            elementId: parseInt(col[20]), 
            formula: col[21], 
            variance: parseInt(col[22]), 
            critical: col[23] == 'true' || col[23] == '1' ? true : false, 
        };
        skill.effects = decodeJsonData(col[24]);
        skill.note = col[25];
        skill.messageType = parseInt(col[26]);

        json.push(skill);
    }

    return json;
}