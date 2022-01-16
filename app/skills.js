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
        'アニメーションID', 
        '会心', 
        '属性', 
        '計算式', 
        'ダメージタイプ', 
        '分散度', 
        '説明', 
        '効果(編集不可)', 
        '命中タイプ', 
        'アイコンインデックス', 
        'メッセージ1行目', 
        'メッセージ2行目', 
        '消費MP', 
        '名前', 
        'メモ', 
        '使用可能時', 
        '連続回数', 
        '必要武器タイプ1', 
        '必要武器タイプ2', 
        '範囲', 
        '速度補正', 
        'スキルタイプID', 
        '成功率', 
        '消費TP', 
        '得TP', 
        'メッセージタイプ', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].animationId, 
            $objJson[i].damage.critical, 
            $objJson[i].damage.elementId, 
            $objJson[i].damage.formula, 
            $objJson[i].damage.type, 
            $objJson[i].damage.variance, 
            $objJson[i].description.replaceAll("\n", "<改行>"), 
            encodeJsonData($objJson[i].effects), 
            $objJson[i].hitType, 
            $objJson[i].iconIndex, 
            $objJson[i].message1, 
            $objJson[i].message2, 
            $objJson[i].mpCost, 
            $objJson[i].name, 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
            $objJson[i].occasion, 
            $objJson[i].repeats, 
            $objJson[i].requiredWtypeId1, 
            $objJson[i].requiredWtypeId2, 
            $objJson[i].scope, 
            $objJson[i].speed, 
            $objJson[i].stypeId, 
            $objJson[i].successRate, 
            $objJson[i].tpCost, 
            $objJson[i].tpGain, 
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
        skill.animationId = parseInt(col[1]);
        skill.damage = {
            critical: col[2] == 'true' || col[2] == '1' ? true : false, 
            elementId: parseInt(col[3]), 
            formula: col[4], 
            type: parseInt(col[5]), 
            variance: parseInt(col[6]), 
        };
        skill.description = col[7];
        skill.effects = decodeJsonData(col[8]);
        skill.hitType = parseInt(col[9]);
        skill.iconIndex = parseInt(col[10]);
        skill.message1 = col[11];
        skill.message2 = col[12];
        skill.mpCost = parseInt(col[13]);
        skill.name = col[14];
        skill.note = col[15];
        skill.occasion = parseInt(col[16]);
        skill.repeats = parseInt(col[17]);
        skill.requiredWtypeId1 = parseInt(col[18]);
        skill.requiredWtypeId2 = parseInt(col[19]);
        skill.scope = parseInt(col[20]);
        skill.speed = parseInt(col[21]);
        skill.stypeId = parseInt(col[22]);
        skill.successRate = parseInt(col[23]);
        skill.tpCost = parseInt(col[24]);
        skill.tpGain = parseInt(col[25]);
        skill.messageType = parseInt(col[26]);

        json.push(skill);
    }

    return json;
}