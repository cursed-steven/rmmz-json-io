/**
 * Models
 */
function newActor() {
    return {
        id: 0, 
        battlerName: '', 
        characterIndex: 0, 
        characterName: '', 
        classId: 0, 
        equips: [0, 0, 0, 0, 0], 
        faceIndex: 0, 
        faceName: '', 
        traits: null, 
        initialLevel: 0, 
        maxLevel: 0, 
        name: '', 
        nickname: '', 
        note: '', 
        profile: '', 
    };
}

function newArmor() {
    return {
        id: 0, 
        atypeId: 0, 
        description: '', 
        etypeId: 0, 
        traits: null, 
        iconIndex: 0, 
        name: '', 
        note: '', 
        params: [0, 0, 0, 0, 0, 0, 0, 0], 
        price: 0, 
    };
}

function newEnemy() {
    return {
        id: 0, 
        actions: null, 
        battlerHue: 0, 
        battlerName: '', 
        dropItems: [
            {
                dataId: 0, 
                denominator: 0, 
                kind: 0, 
            }, 
            {
                dataId: 0, 
                denominator: 0, 
                kind: 0, 
            }, 
            {
                dataId: 0, 
                denominator: 0, 
                kind: 0, 
            }, 
        ], 
        exp: 0, 
        traits: null, 
        gold: 0, 
        name: '', 
        note: '', 
        params: [0, 0, 0, 0, 0, 0, 0, 0], 
    };
}