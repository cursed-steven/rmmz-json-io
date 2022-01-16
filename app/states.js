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
        '自動解除タイミング', 
        'ダメージ時の解除率', 
        'アイコンインデックス', 
        '最大継続ターン', 
        'アクター発生時メッセージ', 
        '敵発生時メッセージ', 
        '継続時メッセージ', 
        '解除時メッセージ', 
        '最小継続ターン', 
        'モーション(SV)', 
        '名前', 
        'メモ', 
        '重ね合わせ(SV)', 
        '優先度', 
        '???', 
        '戦闘終了時に解除', 
        'ダメージで解除', 
        '行動制限で解除', 
        '歩きで解除', 
        '行動制限', 
        '解除までの歩数', 
        '特徴(編集不可)', 
        'メッセージタイプ', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].autoRemovalTiming, 
            $objJson[i].chanceByDamage, 
            $objJson[i].iconIndex, 
            $objJson[i].maxTurns, 
            $objJson[i].message1, 
            $objJson[i].message2, 
            $objJson[i].message3, 
            $objJson[i].message4,
            $objJson[i].minTurns, 
            $objJson[i].motion, 
            $objJson[i].name, 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
            $objJson[i].overlay, 
            $objJson[i].priority, 
            $objJson[i].releaseByDamage, 
            $objJson[i].removeAtBattleEnd, 
            $objJson[i].removeByDamage, 
            $objJson[i].removeByRestriction, 
            $objJson[i].removeByWalking, 
            $objJson[i].restriction, 
            $objJson[i].stepsToRemove, 
            encodeJsonData($objJson[i].traits), 
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
        state.autoRemovalTiming = parseInt(col[1]);
        state.chanceByDamage = parseInt(col[2]);
        state.iconIndex = parseInt(col[3]);
        state.maxTurns = parseInt(col[4]);
        state.message1 = col[5];
        state.message2 = col[6];
        state.message3 = col[7];
        state.message4 = col[8];
        state.minTurns = parseInt(col[9]);
        state.motion = parseInt(col[10]);
        state.name = col[11];
        state.note = col[12];
        state.overlay = parseInt(col[13]);
        state.priority = parseInt(col[14]);
        state.releaseByDamage = col[15] == 'true' || col[15] == '1' ? true : false;
        state.removeAtBattleEnd = col[16] == 'true' || col[16] == '1' ? true : false;
        state.removeByDamage = col[17] == 'true' || col[17] == '1' ? true : false;
        state.removeByRestriction = col[18] == 'true' || col[18] == '1' ? true : false;
        state.removeByWalking = col[19] == 'true' || col[19] == '1' ? true : false;
        state.restriction = parseInt(col[20]);
        state.stepsToRemove = parseInt(col[21]);
        state.traits = decodeJsonData(col[22]);
        state.messageType = parseInt(col[23]);

        json.push(state);
    }

    return json;
}