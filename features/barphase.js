let toggled = false; 
let lastUse = Date.now();
const IVY_PREFIX = "&8[&cI&ev&ay&8] &f";
const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
function isWithinTolerance(n1, n2) {
	return Math.abs(n1 - n2) < 1e-4;
};


const movementKeys = [];
if (typeof Client !== "undefined" && Client.getMinecraft() && Client.getMinecraft().field_71474_y) {
    movementKeys.push(Client.getMinecraft().field_71474_y.field_74351_w); // forward
    movementKeys.push(Client.getMinecraft().field_71474_y.field_74370_x); // back
    movementKeys.push(Client.getMinecraft().field_71474_y.field_74368_y); // left
    movementKeys.push(Client.getMinecraft().field_71474_y.field_74366_z); // right
} else {
    ChatLib.chat(IVY_PREFIX + "&cWarning: Could not initialize movementKeys. Key release/repress might not work.");
}


const releaseMovementKeys = () => {
    if (!movementKeys || movementKeys.length === 0) {
        // console.log("movementKeys not defined or empty for release");
        return;
    }
    movementKeys.forEach(keybind => {
        if (keybind && typeof keybind.func_151463_i === 'function') { 
            KeyBinding.func_74510_a(keybind.func_151463_i(), false);
        } else if (typeof keybind === 'number') { 
             KeyBinding.func_74510_a(keybind, false);
        }
    });
}

const repressMovementKeys = () => {
    if (!movementKeys || movementKeys.length === 0) {
        // console.log("movementKeys not defined or empty for repress");
        return;
    }
    movementKeys.forEach(keybind => {
        let keyCode;
        if (keybind && typeof keybind.func_151463_i === 'function') { 
            keyCode = keybind.func_151463_i();
        } else if (typeof keybind === 'number') { 
            keyCode = keybind;
        } else {
            return;
        }
        if (Keyboard.isKeyDown(keyCode)) {
            KeyBinding.func_74510_a(keyCode, true);
        } else {
            KeyBinding.func_74510_a(keyCode, false); 
        }
    });
}

function getIdOfBlock(x, y, z) {
    const block = World.getBlockAt(x, y, z);
    return block ? block.type.getID() : 0; 
}


register("command", () => {
    toggled = !toggled; 
    if (toggled) {
        ChatLib.chat(IVY_PREFIX + "Barphase: &aON");
    } else {
        ChatLib.chat(IVY_PREFIX + "Barphase: &cOFF");
    }
}).setName("barphase");


register("tick", () => {
    if (!toggled) return; 

    if (Date.now() - lastUse < 50) return;
    lastUse = Date.now();

    const player = Player.getPlayer();
    if (!player || !player.field_70124_G || !player.field_70123_F) return; // FUCKIGN WORK

    const pX = Math.floor(Player.getX());
    const pY = Math.floor(Player.getY());
    const pZ = Math.floor(Player.getZ());

    const ID = getIdOfBlock(pX, pY, pZ);
    const ID1 = getIdOfBlock(pX, pY + 1, pZ);

    if (ID === 0 && ID1 === 0) return; // Don't fucking bar phase through air
 
    const allowedBarBlocks = [101, 102];
    if (!allowedBarBlocks.includes(ID) && ID !== 0) return;
    if (!allowedBarBlocks.includes(ID1) && ID1 !== 0) return;


    let distanceX = 0;
    let distanceZ = 0;

    
    if (isWithinTolerance(Player.getZ() - pZ, 0.13749998807907104)) { distanceZ = +0.06; }
    if (isWithinTolerance(Player.getX() - pX, 0.13749998807907104)) { distanceX = +0.06; }
    if (isWithinTolerance(Player.getZ() - pZ, 0.862500011920929)) { distanceZ = -0.06; }
    if (isWithinTolerance(Player.getX() - pX, 0.862500011920929)) { distanceX = -0.06; }

    if (distanceX === 0 && distanceZ === 0) return; 

    releaseMovementKeys();
    player.func_70107_b(Player.getX() + distanceX, Player.getY(), Player.getZ() + distanceZ); // setPosition
    Client.scheduleTask(0, () => { 
        const currentX = Player.getX(); 
        const currentZ = Player.getZ();
        player.func_70107_b(currentX + distanceX * 5, Player.getY(), currentZ + distanceZ * 5); // setPosition again
        repressMovementKeys();
    });
});