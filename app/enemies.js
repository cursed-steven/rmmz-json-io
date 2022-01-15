/**
 * Main routine
 */
function enemies() {
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
                $csv = convertEnemiesJsonToCsv();

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
                $objJson = convertEnemiesCsvToJson();
    
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

function convertEnemiesJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        '行動パターン(編集不可)', 
        'バトラー色相', 
        'バトラー名', 
        'ドロップ1_種別', 
        'ドロップ1_ID', 
        'ドロップ1_1/n', 
        'ドロップ2_種別', 
        'ドロップ2_ID', 
        'ドロップ2_1/n', 
        'ドロップ3_種別', 
        'ドロップ3_ID', 
        'ドロップ3_1/n', 
        '経験値', 
        '特徴(編集不可)', 
        'ゴールド', 
        '名前', 
        'メモ', 
        '最大HP', 
        '最大MP', 
        '攻撃力', 
        '防御力', 
        '魔法力', 
        '魔法防御', 
        '敏捷性', 
        '運', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            encodeJsonData($objJson[i].actions), 
            $objJson[i].battlerHue, 
            $objJson[i].battlerName, 
            $objJson[i].dropItems[0].kind, 
            $objJson[i].dropItems[0].dataId, 
            $objJson[i].dropItems[0].denominator, 
            $objJson[i].dropItems[1].kind, 
            $objJson[i].dropItems[1].dataId, 
            $objJson[i].dropItems[1].denominator, 
            $objJson[i].dropItems[2].kind, 
            $objJson[i].dropItems[2].dataId, 
            $objJson[i].dropItems[2].denominator, 
            $objJson[i].exp, 
            encodeJsonData($objJson[i].traits), 
            $objJson[i].gold, 
            $objJson[i].name, 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
            $objJson[i].params[0], 
            $objJson[i].params[1], 
            $objJson[i].params[2], 
            $objJson[i].params[3], 
            $objJson[i].params[4], 
            $objJson[i].params[5], 
            $objJson[i].params[6], 
            $objJson[i].params[7], 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertEnemiesCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let armor;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        let enemy = newEnemy();
        enemy.id = parseInt(col[0]);
        enemy.actions = decodeJsonData(col[1]);
        enemy.battlerHue = parseInt(col[2]);
        enemy.battlerName = col[3];
        enemy.dropItems = [
            {
                kind: parseInt(col[4]), 
                dataId: parseInt(col[5]), 
                denominator: parseInt(col[6]), 
            }, 
            {
                kind: parseInt(col[7]), 
                dataId: parseInt(col[8]), 
                denominator: parseInt(col[9]), 
            }, 
            {
                kind: parseInt(col[10]), 
                dataId: parseInt(col[11]), 
                denominator: parseInt(col[12]), 
            }
        ];
        enemy.exp = parseInt(col[13]);
        enemy.traits = decodeJsonData(col[14]);
        enemy.gold = parseInt(col[15]);
        enemy.name = col[16];
        enemy.note = col[17];
        enemy.params = [
            parseInt(col[18]), 
            parseInt(col[19]), 
            parseInt(col[20]), 
            parseInt(col[21]), 
            parseInt(col[22]), 
            parseInt(col[23]), 
            parseInt(col[24]), 
            parseInt(col[25]), 
        ];

        json.push(enemy);
    }

    return json;
}