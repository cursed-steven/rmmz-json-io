/**
 * Main routine
 */
function armors() {
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
                $csv = convertArmorsJsonToCsv();

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
                $objJson = convertArmorsCsvToJson();
    
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

function convertArmorsJsonToCsv() {
    let rows = [];
    let col;
    const col0 = [
        'ID', 
        '名前', 
        'アイコン', 
        '説明', 
        '防具タイプ', 
        '装備タイプ', 
        '価格', 
        '攻撃力', 
        '防御力', 
        '魔法力', 
        '魔法防御', 
        '敏捷性', 
        '運', 
        '最大HP', 
        '最大MP', 
        '特徴(編集不可)', 
        'メモ', 
    ];
    rows.push(col0.join("\t"));

    for (let i = 1; i < $objJson.length; i++) {
        col = [
            $objJson[i].id, 
            $objJson[i].name, 
            $objJson[i].iconIndex, 
            $objJson[i].description.replaceAll("\n", "<改行>"),
            $objJson[i].atypeId, 
            $objJson[i].etypeId, 
            $objJson[i].price, 
            $objJson[i].params[2], 
            $objJson[i].params[3], 
            $objJson[i].params[4], 
            $objJson[i].params[5], 
            $objJson[i].params[6], 
            $objJson[i].params[7], 
            $objJson[i].params[0], 
            $objJson[i].params[1], 
            encodeJsonData($objJson[i].traits), 
            $objJson[i].note.replaceAll("\n", "<改行>"), 
        ];
        rows.push(col.join("\t"));
    }

    return rows.join("\n");
}

function convertArmorsCsvToJson() {
    const rows = $csv.split("\n");
    let col;
    let armor;
    let json = [null];

    for (let i = 1; i < rows.length; i++) {
        col = rows[i].split("\t");

        armor = newArmor();
        armor.id = parseInt(col[0]);
        armor.name = col[1];
        armor.iconIndex = parseInt(col[2]);
        armor.description = col[3];
        armor.atypeId = parseInt(col[4]);
        armor.etypeId = parseInt(col[5]);
        armor.price = parseInt(col[6]);
        armor.params = [
            parseInt(col[13]), 
            parseInt(col[14]), 
            parseInt(col[7]), 
            parseInt(col[8]), 
            parseInt(col[9]), 
            parseInt(col[10]), 
            parseInt(col[11]), 
            parseInt(col[12]), 
        ];
        armor.traits = decodeJsonData(col[15]);
        armor.note = col[16];

        json.push(armor);
    }

    return json;
}