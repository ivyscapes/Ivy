import PogObject from "PogData";

const IVY_PREFIX = "&8[&cI&ev&ay&8] &f";

const KeyBinding = Java.type("net.minecraft.client.settings.KeyBinding");
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


function isWithinTolerence(n1, n2) {
	return Math.abs(n1 - n2) < 1e-4;
};