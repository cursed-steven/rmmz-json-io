/**
 * Main routine
 */
function actors() {
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
                $csv = convertActorsJsonToCsv();

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
                $objJson = convertActorsCsvToJson();

                if (url) URL.revokeObjectURL(url);

                tmpJson = JSON.stringify($objJson);
                tmpJson = tmpJson.replaceAll("<改行>", "\\n");
                tmpJson = tmpJson.replaceAll("“", "\\\"");
                tmpJson = tmpJson.replaceAll("”", "\\\"");

                const blob = new Blob([tmpJson], {type: 'text/plain'});
                url = URL.createObjectURL(blob);
                btnSaveJson.href = url;
            };
         }
     });
}

function convertActorsJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        'アクター名', 
        '二つ名', 
        '職業ID', 
        '初期レベル', 
        '最大レベル', 
        'プロフィール', 
        '顔グラ名', 
        '顔グラインデックス', 
        '歩行キャラ', 
        '歩行キャラインデックス', 
        '戦闘キャラ(SV)', 
        '装備1', 
        '装備2', 
        '装備3', 
        '装備4', 
        '装備5', 
        '特徴(編集不可)', 
        'メモ', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].name, 
            $objJson[i].nickname, 
            $objJson[i].classId, 
            $objJson[i].initialLevel, 
            $objJson[i].maxLevel, 
            $objJson[i].profile.replaceAll("\n", "<改行>"), 
            $objJson[i].faceName, 
            $objJson[i].faceIndex, 
            $objJson[i].characterName, 
            $objJson[i].characterIndex, 
            $objJson[i].battlerName, 
            $objJson[i].equips[0], 
            $objJson[i].equips[1], 
            $objJson[i].equips[2], 
            $objJson[i].equips[3], 
            $objJson[i].equips[4], 
            encodeJsonData($objJson[i].traits), 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertActorsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let actor;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        actor = newActor();
        actor.id = parseInt(col[0]);
        actor.name = col[1];
        actor.nickname = col[2];
        actor.classId = parseInt(col[3]);
        actor.initialLevel = parseInt(col[4]);
        actor.maxLevel = parseInt(col[5]);
        actor.profile = col[6];
        actor.faceName = col[7];
        actor.faceIndex = parseInt(col[8]);
        actor.characterName = col[9];
        actor.characterIndex = parseInt(col[10]);
        actor.battlerName = col[11];
        actor.equips = [
            parseInt(col[12]), 
            parseInt(col[13]), 
            parseInt(col[14]), 
            parseInt(col[15]), 
            parseInt(col[16]), 
        ];
        actor.traits = decodeJsonData(col[17]);
        actor.note = col[18];

        json.push(actor);
    }

    return json;
}