import Config from "./config"

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");


const CLIP_MESSAGE = "&8[&cI&ev&ay&8] &fClipping!";
const IVY_PREFIX = "&8[&cI&ev&ay&8] &f";


let showClipMessage = true;


function getXZFromYaw(yaw) {
   const radians = yaw * (Math.PI / 180);
   const x = -Math.sin(radians);
   const z = Math.cos(radians);
   return [x, z];
}


register("command", () => {
   if (showClipMessage) {
       ChatLib.chat(CLIP_MESSAGE);
   }


   const currentPlayer = Player.getPlayer();
   if (!currentPlayer) {
       ChatLib.chat(IVY_PREFIX + "Error: Player object not found.");
       return;
   }


   const keyForward = Client.getMinecraft().field_71474_y.field_74351_w.func_151463_i();
  
   const [xDir, zDir] = getXZFromYaw(Player.getYaw());


   const calculatedSpeed = (5.612 / 20) * (currentPlayer.field_71075_bZ.func_75094_b() * 10);


   KeyBinding.func_74510_a(keyForward, false);
  
   currentPlayer.func_70016_h(0, Player.getMotionY(), 0);


   Client.scheduleTask(0, () => {
       currentPlayer.func_70016_h(calculatedSpeed * xDir, Player.getMotionY(), calculatedSpeed * zDir);
       KeyBinding.func_74510_a(keyForward, Keyboard.isKeyDown(keyForward));
   });


}).setName("ivyclip");
register("command", () => {
   showClipMessage = !showClipMessage;
   ChatLib.chat(IVY_PREFIX + "Clipping message: " + (showClipMessage ? "&aON" : "&cOFF"));
}).setName("ivytoggle");

import PogObject from "../PogData";

const data = new PogObject("coreclip", {
	enabled: false
});

const trigger = register("tick", () => {
	const [x, y, z] = [Player.getX(), Player.getY(), Player.getZ()];
	if (y !== 115) return;
	if (x < 52 || x > 57) return;
	const handleKeys = () => {
		const gameSettings = Client.getMinecraft().field_71474_y;
		const keys = [gameSettings.field_74351_w.func_151463_i(), gameSettings.field_74370_x.func_151463_i(), gameSettings.field_74366_z.func_151463_i(), gameSettings.field_74368_y.func_151463_i()];
		for (let key of keys) {
			KeyBinding.func_74510_a(key, false);
		}
		Client.scheduleTask(() => {
			for (let key of keys) {
				KeyBinding.func_74510_a(key, Keyboard.isKeyDown(key));
			}
		});
	};
	if (isWithinTolerence(z, 53.7)) {
		Player.getPlayer().func_70107_b(x, y, 53.7624);
		Client.scheduleTask(() => Player.getPlayer().func_70107_b(x, y, 55.301));
		handleKeys();

	} else if (isWithinTolerence(z, 55.3)) {
		Player.getPlayer().func_70107_b(x, y, 55.2376);
		Client.scheduleTask(() => Player.getPlayer().func_70107_b(x, y, 53.699));
		handleKeys();
	}
}).unregister();

if (data.enabled) trigger.register();

register("command", () => {
	data.enabled = !data.enabled;
	if (data.enabled) trigger.register();
	else trigger.unregister();
	data.save();
	ChatLib.chat(IVY_PREFIX + "Coreclip: " + (data.enabled ? "&aON" : "&cOFF"));
}).setName("coreclip");


let toggled = false; 
let lastUse = Date.now();


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

ChatLib.chat(IVY_PREFIX + "Sucessfully loaded! Use /ivys or /purr to open the menu.");



register("command", (...args) => {
    Config()?.getConfig()?.openGui()
        }).setName("ivys").setAliases(["ivy", "purr"])
