/**
 * Main routine
 */
function actors() {
    let reader = new FileReader();
    let url = null;

    // Listeners
    let inputUploadJson = document.getElementById('upload_json');
    let btnSaveCsv = document.getElementById('save_csv');
    inputUploadJson.addEventListener('change', ()=>{
        for (let file of inputUploadJson.files) {
            $objJson = null;
            $csv = null;

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

            reader.readAsText(file, 'UTF-8');
            reader.onload = ()=>{
                $csv = reader.result;
                $objJson = convertActorsCsvToJson();

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

function convertActorsJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        'バトラー名', 
        'キャラインデックス', 
        'キャラ名', 
        '職業ID', 
        '装備1', 
        '装備2', 
        '装備3', 
        '装備4', 
        '装備5', 
        '顔グラインデックス', 
        '顔グラ名', 
        '初期レベル', 
        '最大レベル', 
        'アクター名', 
        '二つ名', 
        'メモ', 
        'プロフィール', 
    ];
    rows.push(col0);

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].battlerName, 
            $objJson[i].characterIndex, 
            $objJson[i].characterName, 
            $objJson[i].classId, 
            $objJson[i].equips[0], 
            $objJson[i].equips[1], 
            $objJson[i].equips[2], 
            $objJson[i].equips[3], 
            $objJson[i].equips[4], 
            $objJson[i].faceIndex, 
            $objJson[i].faceName, 
            $objJson[i].initialLevel, 
            $objJson[i].maxLevel, 
            $objJson[i].name, 
            $objJson[i].nickname, 
            $objJson[i].note, 
            $objJson[i].profile.replaceAll("\n", "<改行>"), 
        ];
        rows.push(col.join(','));
    }

    return rows.join("\n");
}

function convertActorsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let actor;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split(',');

        actor = newActor();
        actor.id = col[0];
        actor.battlerName = col[1];
        actor.characterIndex = col[2];
        actor.characterName = col[3];
        actor.classId = col[4];
        actor.equips = [
            col[5], 
            col[6], 
            col[7], 
            col[8], 
            col[9]
        ];
        actor.faceIndex = col[10];
        actor.faceName = col[11];
        actor.initialLevel = col[12];
        actor.maxLevel = col[13];
        actor.name = col[14];
        actor.nickname = col[15];
        actor.note = col[16];
        actor.profile = col[17];

        json.push(actor);
    }

    return json;
}