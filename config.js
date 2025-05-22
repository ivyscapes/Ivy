// Make sure these go to the right directory 
import Settings from "../Amaterasu/core/Settings"
import DefaultConfig from "../Amaterasu/core/DefaultConfig"
const defaultConf = new DefaultConfig("Ivy", "data/settings.json")



// Dungeons - Mask notifications

.addSwitch({
    category: "Dungeons",
    configName: "autoterms",
    title: "AutoTerms",
    description: "Automatically completes terminals for you (NOT DONE DONT USE)",
    subcategory: "P3"
})
.addButton({
    category: "Dungeons",
    configName: "hclip",
    title: "rqf",
    description: "clips you forward",
    subcategory: "P3",
    onClick() {
        ChatLib.command(`ivyclip`, true)
    }
    
})
.addSwitch({
    category: "Dungeons",
    configName: "coreclip",
    title: "core clip",
    description: "clips into core",
    subcategory: "P3",
})
.addSwitch({
    category: "Dungeons",
    configName: "barphase",
    title: "Bar Phase",
    description: "Slip through the jail bars.",
    subcategory: "P3",
   
    
})
// Dev

.addButton({
    category: "Developer",
    configName: "credit1",
    title: "ivyscapes",
    description: "Developer",
    subcategory: "Developer",
    onClick() {
    }
})
.addButton({
    category: "Developer",
    configName: "credit2",
    title: "kiwi i love kiwi",
    description: "good artists copy, great artists steal",
    subcategory: "Contributor",
    onClick() {
    }
})
.addSwitch({
    category: "Developer",
    configName: "debug",
    title: "Debug",
    description: "Enables debug messages",
    subcategory: "Debug"
})

const config = new Settings("[Ivy]", defaultConf, "data/ColorScheme.json").setCommand("Ivy", ["ivys", "purr"])
config
      .setSize(60,60)
      .apply()
export default () => config.settings
