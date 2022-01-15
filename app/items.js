/**
 * Main routine
 */
function items() {
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
                $csv = convertItemsJsonToCsv();

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
                $objJson = convertItemsCsvToJson();
    
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

function convertItemsJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        'アニメーションID', 
        '消耗', 
        '会心', 
        '属性ID', 
        '計算式', 
        'ダメージタイプ', 
        '分散度', 
        '説明', 
        '使用効果(編集不可)', 
        '命中タイプ', 
        'アイコンインデックス', 
        'アイテムタイプ', 
        '名前', 
        'メモ', 
        '使用可能時', 
        '価格', 
        '連続回数', 
        '範囲', 
        '速度補正', 
        '成功率', 
        '得TP', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].animationId, 
            $objJson[i].consumable, 
            $objJson[i].damage.critical, 
            $objJson[i].damage.elementId, 
            $objJson[i].damage.formula, 
            $objJson[i].damage.type, 
            $objJson[i].damage.variance, 
            $objJson[i].description.replaceAll("\n", "<改行>"), 
            encodeJsonData($objJson[i].effects), 
            $objJson[i].hitType, 
            $objJson[i].iconIndex, 
            $objJson[i].itypeId, 
            $objJson[i].name, 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
            $objJson[i].occasion, 
            $objJson[i].price, 
            $objJson[i].repeats, 
            $objJson[i].scope, 
            $objJson[i].speed, 
            $objJson[i].successRate, 
            $objJson[i].tpGain, 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertItemsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let armor;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        let item = newItem();
        item.id = parseInt(col[0]);
        item.animationId = parseInt(col[1]);
        item.consumable = col[2] == 'true' || col[2] == '1' ? true : false;
        item.damage = {
            critical: col[3] == 'true' || col[3] == '1' ? true : false, 
            elementId: parseInt(col[4]), 
            formula: col[5], 
            type: parseInt(col[6]), 
            variance: parseInt(col[7]), 
        };
        item.description = col[8];
        item.effects = decodeJsonData(col[9]);
        item.hitType = parseInt(col[10]);
        item.iconIndex = parseInt(col[11]);
        item.itypeId = parseInt(col[12]);
        item.name = col[13];
        item.note = col[14];
        item.occasion = parseInt(col[15]);
        item.price = parseInt(col[16]);
        item.repeats = parseInt(col[17]);
        item.scope = parseInt(col[18]);
        item.speed = parseInt(col[19]);
        item.successRate = parseInt(col[20]);
        item.tpGain = parseInt(col[21]);

        json.push(item);
    }

    return json;
}