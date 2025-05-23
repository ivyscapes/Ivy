// MADE BY IVY
// MADE BY IVY
// MADE BY IVY
// MADE BY IVY
// MADE BY IVY
// MADE BY IVY
// MADE BY IVY
const IVY_PREFIX = "&8[&cI&ev&ay&8] &f";

import Config from "./config"
import "./features/barphase"
import "./features/coreclip"
import "./features/hclip"
import "./features/instamid"

ChatLib.chat(IVY_PREFIX + "Sucessfully loaded! Use /ivys or /purr to open the menu.");


register("command", (...args) => {
    Config()?.getConfig()?.openGui()
        }).setName("ivys").setAliases(["ivy", "purr"])
