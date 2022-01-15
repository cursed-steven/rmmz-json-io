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

function newItem() {
    return {
        id: 0, 
        animationId: 0, 
        consumable: false, 
        damage: {
            critical: false, 
            elementId: 0, 
            formula: '', 
            type: 0, 
            variance: 0, 
        }, 
        description: '', 
        effects: null, 
        hitType: 0, 
        iconIndex: 0, 
        itypeId: 0, 
        name: '', 
        note: '', 
        occasion: 0, 
        price: 0, 
        repeats: 0, 
        scope: 0, 
        speed: 0, 
        successRate: 0, 
        tpGain: 0, 
    };
}

function newSkill() {
    return {
        id: 0, 
        animationId: 0, 
        damage: {
            critical: true, 
            elementId: 0, 
            formula: '', 
            type: 0, 
            variance: 0, 
        }, 
        description: '', 
        effects: null, 
        hitType: 0, 
        iconIndex: 0, 
        message1: '', 
        message2: '', 
        mpCost: 0, 
        name: '', 
        note: '', 
        occasion: 0, 
        repeats: 0, 
        requiredWtypeId1: 0, 
        requiredWtypeId2: 0, 
        scope: 0, 
        speed: 0, 
        stypeId: 0, 
        successRate: 0, 
        tpCost: 0, 
        tpGain: 0, 
        messageType: 0, 
    };
}