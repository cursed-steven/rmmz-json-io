/**
 * Main routine
 */
function states() {
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
                $csv = convertStatesJsonToCsv();

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
                $objJson = convertStatesCsvToJson();
    
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

function convertStatesJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        '名前', 
        'アイコン', 
        '行動制約', 
        '優先度', 
        'モーション(SV)', 
        '重ね合わせ(SV)', 
        '戦闘終了時に解除', 
        '行動制約で解除', 
        '自動解除タイミング', 
        '最小継続ターン数', 
        '最大継続ターン数', 
        'ダメージで解除', 
        'ダメージ時の解除率', 
        '歩きで解除', 
        '解除までの歩数', 
        'アクター発生時メッセージ', 
        '敵発生時メッセージ', 
        '継続時メッセージ', 
        '解除時メッセージ', 
        '特徴(編集不可)', 
        'メモ', 
        '???', 
        'メッセージタイプ', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].name, 
            $objJson[i].iconIndex, 
            $objJson[i].restriction, 
            $objJson[i].priority, 
            $objJson[i].motion, 
            $objJson[i].overlay, 
            $objJson[i].removeAtBattleEnd, 
            $objJson[i].removeByRestriction, 
            $objJson[i].autoRemovalTiming, 
            $objJson[i].minTurns, 
            $objJson[i].maxTurns, 
            $objJson[i].removeByDamage, 
            $objJson[i].chanceByDamage, 
            $objJson[i].removeByWalking, 
            $objJson[i].stepsToRemove, 
            $objJson[i].message1, 
            $objJson[i].message2, 
            $objJson[i].message3, 
            $objJson[i].message4,
            encodeJsonData($objJson[i].traits), 
            $objJson[i].note ? $objJson[i].note.replaceAll("\n", "<改行>") : '', 
            $objJson[i].releaseByDamage, 
            $objJson[i].messageType, 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertStatesCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let state;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        state = newState();
        state.id = parseInt(col[0]);
        state.name = col[1];
        state.iconIndex = parseInt(col[2]);
        state.restriction = parseInt(col[3]);
        state.priority = parseInt(col[4]);
        state.motion = parseInt(col[5]);
        state.overlay = parseInt(col[6]);
        state.removeAtBattleEnd = col[7] == 'true' || col[7] == '1' ? true : false;
        state.removeByRestriction = col[8] == 'true' || col[8] == '1' ? true : false;
        state.autoRemovalTiming = parseInt(col[9]);
        state.minTurns = parseInt(col[10]);
        state.maxTurns = parseInt(col[11]);
        state.removeByDamage = col[12] == 'true' || col[12] == '1' ? true : false;
        state.chanceByDamage = parseInt(col[13]);
        state.removeByWalking = col[14] == 'true' || col[14] == '1' ? true : false;
        state.stepsToRemove = parseInt(col[15]);
        state.message1 = col[16];
        state.message2 = col[17];
        state.message3 = col[18];
        state.message4 = col[19];
        state.traits = decodeJsonData(col[20]);
        state.note = col[21];
        state.releaseByDamage = col[22] == 'true' || col[22] == '1' ? true : false;
        state.messageType = parseInt(col[23]);

        json.push(state);
    }

    return json;
}