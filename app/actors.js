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
            //console.log(file);
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
            $objJson[i].profile.replace("\n", "<改行>"), 
        ];
        rows.push(col.join(','));
    }

    return rows.join("\n");
}