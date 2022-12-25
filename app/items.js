/**
 * Main routine
 */
function items() {
    let reader;
    let url = null;

    // Listeners
    let inputUploadJson = document.getElementById('upload_json');
    let btnSaveCsv = document.getElementById('save_csv');
    inputUploadJson.addEventListener('change', () => {
        for (let file of inputUploadJson.files) {
            $objJson = null;
            $csv = null;
            reader = new FileReader();

            if (ext(file).toLowerCase() !== 'json') {
                alert('jsonファイルを指定してください。');
                continue;
            }

            reader.readAsText(file, 'UTF-8');
            reader.onload = () => {
                $objJson = JSON.parse(reader.result);
                $csv = convertItemsJsonToCsv();

                if (url) URL.revokeObjectURL(url);

                const blob = new Blob([$csv], { type: 'text/plain' });
                url = URL.createObjectURL(blob);
                btnSaveCsv.href = url;
            };
        }
    });

    let inputUploadCsv = document.getElementById('upload_csv');
    let btnSaveJson = document.getElementById('save_json');
    let tmpJson;
    inputUploadCsv.addEventListener('change', () => {
        for (let file of inputUploadCsv.files) {
            $objJson = null;
            $csv = null;
            reader = new FileReader();

            if (ext(file).toLowerCase() !== 'csv') {
                alert('csvファイルを指定してください。');
                continue;
            }

            reader.readAsText(file, 'UTF-8');
            reader.onload = () => {
                $csv = reader.result;
                $objJson = convertItemsCsvToJson();

                if (url) URL.revokeObjectURL(url);

                tmpJson = JSON.stringify($objJson);
                tmpJson = tmpJson.replaceAll("<改行>", "\\n");
                tmpJson = tmpJson.replaceAll("“", "\\\"");
                tmpJson = tmpJson.replaceAll("”", "\\\"");

                const blob = new Blob([tmpJson], { type: 'text/plain' });
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
        '名前',
        'アイコン',
        '説明',
        'アイテムタイプ',
        '価格',
        '消耗',
        '範囲',
        '使用可能時',
        '速度補正',
        '成功率',
        '連続回数',
        '得TP',
        '命中タイプ',
        'アニメーションID',
        'ダメージタイプ',
        '属性ID',
        '計算式',
        '分散度',
        '会心',
        '使用効果(編集不可)',
        'メモ',
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id,
            $objJson[i].name,
            $objJson[i].iconIndex,
            $objJson[i].description ? $objJson[i].description.replaceAll("\n", "<改行>") : "",
            $objJson[i].itypeId,
            $objJson[i].price,
            $objJson[i].consumable,
            $objJson[i].scope,
            $objJson[i].occasion,
            $objJson[i].speed,
            $objJson[i].successRate,
            $objJson[i].repeats,
            $objJson[i].tpGain,
            $objJson[i].hitType,
            $objJson[i].animationId,
            $objJson[i].damage.type,
            $objJson[i].damage.elementId,
            $objJson[i].damage.formula,
            $objJson[i].damage.variance,
            $objJson[i].damage.critical,
            encodeJsonData($objJson[i].effects),
            $objJson[i].note ? $objJson[i].note.replaceAll("\n", "<改行>") : "",
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertItemsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let item;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        item = newItem();
        item.id = parseInt(col[0]);
        item.name = col[1];
        item.iconIndex = parseInt(col[2]);
        item.description = col[3];
        item.itypeId = parseInt(col[4]);
        item.price = parseInt(col[5]);
        item.consumable = col[6] == 'true' || col[6] == '1' ? true : false;
        item.scope = parseInt(col[7]);
        item.occasion = parseInt(col[8]);
        item.speed = parseInt(col[9]);
        item.successRate = parseInt(col[10]);
        item.repeats = parseInt(col[11]);
        item.tpGain = parseInt(col[12]);
        item.hitType = parseInt(col[13]);
        item.animationId = parseInt(col[14]);
        item.damage = {
            type: parseInt(col[15]),
            elementId: parseInt(col[16]),
            formula: col[17],
            variance: parseInt(col[18]),
            critical: col[19] == 'true' || col[19] == '1' ? true : false,
        };
        item.effects = decodeJsonData(col[20]);
        item.note = col[21];

        json.push(item);
    }

    return json;
}