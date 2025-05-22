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








