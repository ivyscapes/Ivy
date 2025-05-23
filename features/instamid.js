import Config from "../config"
const IVY_PREFIX = "&8[&cI&ev&ay&8] &f";
const C03PacketPlayer = Java.type("net.minecraft.network.play.client.C03PacketPlayer");
const C06PacketPlayerPosLook = Java.type("net.minecraft.network.play.client.C03PacketPlayer$C06PacketPlayerPosLook");
const C0CPacketInput = Java.type("net.minecraft.network.play.client.C0CPacketInput");
const S1BPacketEntityAttach = Java.type("net.minecraft.network.play.server.S1BPacketEntityAttach");
let preparing = true;

const instamidTrigger = register("packetSent", (packet, event) => {
	cancel(event);
	const riding = Player.getPlayer().func_70115_ae();
	if (riding) preparing = false;
	if (!riding && !preparing) {
		instamidTrigger.unregister();
		preparing = true;
		Client.sendPacket(new C06PacketPlayerPosLook(54, 65, 76, 0, 0, false));
	}
}).setFilteredClasses([C03PacketPlayer, C0CPacketInput]).unregister();

const trigger = register("packetReceived", packet => {
	if (!isOnPlatform()) return;
	if (packet.func_149403_d() !== Player.getPlayer().func_145782_y()) return;
	if (packet.func_149402_e() < 0) return;
	preparing = true;
	instamidTrigger.register();
	ChatLib.chat(IVY_PREFIX + "Attempting to instamid!");
}).setFilteredClass(S1BPacketEntityAttach).unregister();

if (Config().instamid) trigger.register();


function isOnPlatform() {
	if (Player.getY() > 100) return false;
	if (Player.getY() < 64) return false;
	return Math.abs(Player.getX() - 54.5) ** 2 + Math.abs(Player.getZ() - 76.5) ** 2 < 56.25;
}
