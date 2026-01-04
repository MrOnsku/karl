const { Client, IntentsBitField, ActivityType, EmbedBuilder } = require("discord.js");
const http = require("http");
require("dotenv").config();

//setup client
const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
    ]
});

const version = "1.4.0";
const changelog = "**Changes:**\n- Added the ``/dailydeal`` command.";

const dev = process.env.DEV;

const resourceCounts = {
    'Mining Expedition,1,1': '200',
    'Mining Expedition,1,2': '225',
    'Mining Expedition,2,2': '250',
    'Mining Expedition,2,3': '325',
    'Mining Expedition,3,3': '400',
    'Egg Hunt,1': '4',
    'Egg Hunt,2': '6',
    'Egg Hunt,default': '8',
    'Elimination,2': '2',
    'Elimination,default': '3',
    'Salvage Operation,2': '2',
    'Salvage Operation,default': '3',
    'Deep Scan,2,1': '3',
    'Deep Scan,3,2': '5',
};

const primaryObjectiveEmojis = {
    "Mining Expedition": "<:me:1391449720299327518>",
    "Egg Hunt": "<:eh:1391449782383411381>",
    "On-Site Refining": "<:or:1391449825018646629>",
    "Salvage Operation": "<:so:1391449868492607550>",
    "Escort Duty": "<:ed:1391449968631353486>",
    "Point Extraction": "<:pe:1391449913552015520>",
    "Elimination": "<:el:1391450005478310038>",
    "Industrial Sabotage": "<:is:1391450035132043294>",
    "Deep Scan": "<:ds:1391450076655652944>",
};

const primaryObjectiveNames = {
    "Mining Expedition": "Morkite",
    "Egg Hunt": "Egg",
    "On-Site Refining": "On-Site Refining",
    "Salvage Operation": "Mule",
    "Escort Duty": "Escort Duty",
    "Point Extraction": "Point Extraction",
    "Elimination": "Dreadnought",
    "Industrial Sabotage": "Industrial Sabotage",
    "Deep Scan": "Deep Scan",
};

const deepDiveSecondaryObjectiveEmojis = {
    "Repair Minimules": "<:so:1391449868492607550>",
    "Eliminate Dreadnought": "<:el:1391450005478310038>",
    "Mine Morkite": "<:me:1391449720299327518>",
    "Get Alien Eggs": "<:eh:1391449782383411381>",
    "Black Box": "<:bb:1391451896450908203>",
    "Perform Deep Scans": "<:ds:1391450076655652944>",
    "Build Liquid Morkite Pipeline": "<:or:1391449825018646629>",
};

const deepDiveSecondaryObjectiveNames = {
    "Repair Minimules": "Mule",
    "Eliminate Dreadnought": "Dreadnought",
    "Mine Morkite": "Morkite",
    "Get Alien Eggs": "Egg",
    "Black Box": "Black Box",
    "Perform Deep Scans": "Crystal Scan",
    "Build Liquid Morkite Pipeline": "Morkite Well",
};

const deepDiveSecondaryObjectiveCounts = {
    "Repair Minimules": "2",
    "Eliminate Dreadnought": "1",
    "Mine Morkite": "150",
    "Get Alien Eggs": "2",
    "Perform Deep Scans": "2",
    "Build Liquid Morkite Pipeline": "1",
};

const warningEmojis = {
    "Cave Leech Cluster": "<:cl:1391488050244223027>",
    "Duck and Cover": "<:dc:1391488073329803344>",
    "Ebonite Outbreak": "<:ri:1391488221484941312>",
    "Elite Threat": "<:et:1391488087925981316>",
    "Exploder Infestation": "<:ei:1391488106871525376>",
    "Haunted Cave": "<:hc:1391488119450107994>",
    "Lethal Enemies": "<:le:1391488133534847005>",
    "Low Oxygen": "<:lx:1391488160298569769>",
    "Mactera Plague": "<:mp:1391488174663929867>",
    "Parasites": "<:pa:1391488187389575198>",
    "Regenerative Bugs": "<:rb:1391488198110085170>",
    "Rival Presence": "<:rp:1391488209233383426>",
    "Shield Disruption": "<:sd:1391488233241710784>",
    "Swarmageddon": "<:sw:1391488250803388518>",
};

const anomalyEmojis = {
    "Blood Sugar": "<:bs:1391493623421603931>",
    "Critical Weakness": "<:cw:1391493634863534350>",
    "Double XP": "<:dx:1391493713028714506>",
    "Gold Rush": "<:gr:1391493654551724164>",
    "Golden Bugs": "<:gb:1391493665527959552>",
    "Low Gravity": "<:lg:1391493676903039057>",
    "Mineral Mania": "<:mm:1391493688584306720>",
    "Rich Atmosphere": "<:ra:1391493700894593164>",
    "Secret Secondary": "<:ss:1391493739284926615>",
    "Volatile Guts": "<:vg:1391493727792529568>",
};

const biomeEmojis = {
    "Crystalline Caverns": "<:cc:1391499366207979700>",
    "Salt Pits": "<:sp:1391499610098241556>",
    "Fungus Bogs": "<:fb:1391499436458512414>",
    "Radioactive Exclusion Zone": "<:re:1391499567333380147>",
    "Dense Biozone": "<:db:1391499401326760016>",
    "Glacial Strata": "<:gs:1391499465524904076>",
    "Hollow Bough": "<:hb:1391499494901682356>",
    "Azure Weald": "<:aw:1391499316316864552>",
    "Magma Core": "<:mc:1391499530956046549>",
    "Sandblasted Corridors": "<:sc:1391499639777398905>",
};

const deepDiveStageEmojis = {
    1: "<:s1:1391771439492890755>",
    2: "<:s2:1391771465371619492>",
    3: "<:s3:1391771488083906620>",
};

const caveComplexityEmojis = {
    0: "<:cf:1391798697783988376>",
    1: "<:cn:1391798726632280184>",
};

const caveLengthEmojis = {
    0: "<:lf:1391798762971725956>",
    1: "<:ln:1391798785956380693>",
};

const mineralEmojis = {
    "Bismor": "<:bi:1400101851868823674>",
    "Croppa": "<:co:1400101875822493827>",
    "Enor Pearl": "<:en:1400101932504449024>",
    "Jadiz": "<:ja:1400101964498468924>",
    "Magnite": "<:ma:1400101988380708984>",
    "Umanite": "<:um:1400102009545166858>",
    "Phazyonite": "<:ph:1400102034132439172>",
}

client.on("ready", (c) => {
    //bot login
    console.log("bot is running");
    client.user.setActivity("Deep Rock Galactic", { type: ActivityType.Playing });
});

client.on("interactionCreate", async (interaction) => {
    if(!interaction.isChatInputCommand()) return;

    //slash commands
    let command = interaction.commandName;
    if(command == "info"){
        let embed = new EmbedBuilder();
        embed.setTitle("❔ Info");
        embed.setDescription("Your one-stop helper for all things Deep Rock Galactic, Karl!\n\n**Commands:**\n- ``/deepdive`` - Shows the details of the ongoing Deep Dives\n- ``/dailydeal`` - Shows the current Daily Deal\n- ``/invite`` - Get an invite link for this bot\n- ``/info`` - Shows this message\n- ``/changelog`` - Shows a list of changes from the most recent update");
        embed.setColor("#4f2daa");
        embed.setFooter({ text: "Bot by @realonsku, Rock and Stone! (v." + version + ")"});

        interaction.reply({ embeds: [embed] });
    }
    else if(command == "deepdive"){
        let mobile = interaction.options.getBoolean("mobile");
        
        let variantKeys = ["Deep Dive Normal", "Deep Dive Elite"];
        let variantNames = ["Deep Dive", "Elite Deep Dive"];

        let apiResponse = await fetch(`https://doublexp.net/static/json/DD_${getLatestDeepDiveTimestamp()}.json`);
        let apiJson = await apiResponse.json();

        let diveIcons = ["<:dd:1391497167964999781>", "<:hd:1391497596350107689>"];

        if(apiJson == null || apiResponse == null){
            return interaction.reply("Cannot get Deep Dive data at this moment, try again later. Mission Control is working on it...");
        }

        let embed = new EmbedBuilder();
        let fields = [];
        
        embed.setTitle("<:dd:1391497167964999781> Current Deep Dives");

        function addDiveField(variant, fields, inline){
            let dive = apiJson["Deep Dives"][variantKeys[variant]];
            
            fields.push({
                name: diveIcons[variant] + " " + variantNames[variant],
                value: "- **Name:** " + dive.CodeName + "\n- **Biome:** " + dive.Biome + " " + biomeEmojis[dive.Biome] + "\n",
                inline: inline,
            });
        }
        
        function addStageField(variant, stageNum, fields, mobile, inline){
            let dive = apiJson["Deep Dives"][variantKeys[variant]];

            let stage = dive.Stages[stageNum];

            let primaryEmoji = primaryObjectiveEmojis[stage.PrimaryObjective];
            let secondaryEmoji = deepDiveSecondaryObjectiveEmojis[stage.SecondaryObjective];

            let anomaly = "None";
            let warning = "None";
            let warningEmoji = "";
            let anomalyEmoji = "";

            if(stage.MissionMutator != null){
                anomaly = stage.MissionMutator;
                anomalyEmoji = anomalyEmojis[stage.MissionMutator];
            }
            if(stage.MissionWarnings != null){
                warning = stage.MissionWarnings[0];
                warningEmoji = warningEmojis[stage.MissionWarnings[0]];
            }

            let complexity = Number(stage.Complexity);
            let length = Number(stage.Length);

            let complexityBar = caveComplexityEmojis[1].repeat(complexity) + caveComplexityEmojis[0].repeat(3 - complexity);
            let lengthBar = caveLengthEmojis[1].repeat(length) + caveLengthEmojis[0].repeat(3 - length);

            let primaryCount = getObjectiveCount(stage.PrimaryObjective, complexity, length);
            let secondaryCount = deepDiveSecondaryObjectiveCounts[stage.SecondaryObjective] || null;

            let indent = "\u00A0\u00A0\u00A0";

            let primaryText = `${indent}**○ Primary:** ${primaryObjectiveNames[stage.PrimaryObjective]}${primaryCount !== null ? ` x${primaryCount}` : ""} ${primaryEmoji}`;
            let secondaryText = `${indent}**○ Secondary:** ${deepDiveSecondaryObjectiveNames[stage.SecondaryObjective]}${secondaryCount !== null ? ` x${secondaryCount}` : ""} ${secondaryEmoji}`;

            let extraLine = "";
            if(mobile && variant == 0 && stageNum == 2) extraLine = "\n\u200B";

            let fieldString =
                `**- ${deepDiveStageEmojis[stageNum + 1]} Stage ${stageNum + 1}:**` +
                `${primaryText}` +
                `\n${secondaryText}` +
                `\n${indent}**○ Anomaly:** ${anomaly} ${anomalyEmoji}` +
                `\n${indent}**○ Warning:** ${warning} ${warningEmoji}` +
                `\n${indent}${complexityBar} ${lengthBar}${extraLine}`;

            fields.push({
                name: "",
                value: fieldString,
                inline: inline,
            });
        }

        if(!mobile){
            //dives
            for (let v = 0; v < variantKeys.length; v++) {
                addDiveField(v, fields, true);
            }

            //pad to 3 columns
            addPadding(1, fields);

            //stages
            for (let s = 0; s < 3; s++) {
                for (let v = 0; v < variantKeys.length; v++) {
                    addStageField(v, s, fields, mobile, true);
                }
                //pad to 3 columns
                addPadding(1, fields);
            }
        }
        else{
            //dives
            for (let v = 0; v < variantKeys.length; v++) {
                addDiveField(v, fields, false);

                //stages
                for (let s = 0; s < 3; s++) {
                    addStageField(v, s, fields, mobile, false);
                }
            }
        }
        
        let startDate = new Date(getLatestDeepDiveTimestamp().replace("T11-00-00Z", "T11:00:00Z"));
        startDate.setUTCDate(startDate.getUTCDate() + 7);
        let nextRefresh = startDate.toISOString();

        embed.addFields(fields);
        embed.setColor("#4f2daa");
        embed.setFooter({ text: "New Deep Dives at: " + formatEEST(nextRefresh) });

        interaction.reply({ embeds: [embed] });
    }
    else if(command == "invite"){
        interaction.reply("https://discord.com/oauth2/authorize?client_id=1391334479930331148");
    }
    else if(command == "changelog"){
        let embed = new EmbedBuilder();
        embed.setTitle("🗒️ Changelog");
        embed.setDescription(changelog);
        embed.setColor("#4f2daa");
        embed.setFooter({ text: "v." + version});

        interaction.reply({ embeds: [embed] });
    }
    else if(command == "dailydeal"){
        let apiResponse = await fetch(`https://doublexp.net/static/json/bulkmissions/${getDailyDealDate()}.json`);
        let apiJson = await apiResponse.json();

        if(apiJson == null || apiResponse == null){
            return interaction.reply("Cannot get Daily Deal data at this moment, try again later. Mission Control is working on it...");
        }

        let buyOrGet = {
            "Buy": "Pay",
            "Sell": "Get",
        };

        let saveProfit = {
            "Buy": "Savings!",
            "Sell": "Profit!",
        };

        let embed = new EmbedBuilder();
        embed.setTitle("<:cr:1400101820616937542> Daily Deal");
        embed.setDescription("**Today's Offer: " + apiJson["dailyDeal"]["Resource"] + "** " + mineralEmojis[apiJson["dailyDeal"]["Resource"]]+ "\n- **" + apiJson["dailyDeal"]["DealType"] + ":** " + apiJson["dailyDeal"]["ResourceAmount"] + " " + mineralEmojis[apiJson["dailyDeal"]["Resource"]] + "\n- **" + buyOrGet[apiJson["dailyDeal"]["DealType"]] + ":** " + apiJson["dailyDeal"]["Credits"] + " <:cr:1400101820616937542>\n**" + Math.round(apiJson["dailyDeal"]["ChangePercent"]) + "% " + saveProfit[apiJson["dailyDeal"]["DealType"]] + "**");
        embed.setColor("#4f2daa");

        const parts = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Helsinki",
            year:  "numeric",
            month: "2-digit",
            day:   "2-digit",
        }).formatToParts(new Date());
        const year  = parts.find(p => p.type === "year").value;
        const month = parts.find(p => p.type === "month").value;
        const day   = parts.find(p => p.type === "day").value;

        let d = new Date(Date.UTC(+year, +month - 1, +day, 0, 0));
        d.setUTCHours(d.getUTCHours() - 3);
        d.setUTCDate(d.getUTCDate() + 1);

        const nextDealDate = new Intl.DateTimeFormat("en-GB", {
            timeZone: "Europe/Helsinki",
            year:  "numeric",
            month: "short",
            day:   "numeric",
        }).format(d);

        embed.setFooter({ text: "New Daily Deal at: " + nextDealDate});

        interaction.reply({ embeds: [embed] });
    }
});

function getObjectiveCount(primary, complexity, length){
    return (
        resourceCounts[`${primary},${length}`] ||
        resourceCounts[`${primary},${complexity},${length}`] ||
        resourceCounts[`${primary},${complexity},default`] ||
        resourceCounts[`${primary},default`] ||
        null
    );
}

function addPadding(count, fields){
    for (let i = 0; i < count; i++) {
        fields.push({ name: "\u200B", value: "\u200B", inline: true });
    }
}

function getLatestDeepDiveTimestamp(){
    const now = new Date();
    if (now.getUTCDay() === 4 && now.getUTCHours() < 11) now.setUTCDate(now.getUTCDate() - 7);
    const diff = (now.getUTCDay() + 7 - 4) % 7;
    now.setUTCDate(now.getUTCDate() - diff);
    now.setUTCHours(11,0,0,0);
    return now.toISOString().slice(0,19).replace(/:/g,"-") + "Z";
}

function getDailyDealDate(){
    const now = new Date();
    const parts = new Intl.DateTimeFormat("en-GB", {
        timeZone: "Europe/Helsinki",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    }).formatToParts(now);

    const year = parts.find(p => p.type === "year").value;
    const month = parts.find(p => p.type === "month").value;
    const day = parts.find(p => p.type === "day").value;

    return `${year}-${month}-${day}`;
}

function formatEEST(utcString){
    let date = new Date(utcString);
    return new Intl.DateTimeFormat("en-GB", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        timeZone: "Europe/Helsinki",
        timeZoneName: "short"
    }).format(date);
}

//start client
if(dev == "true"){
    //dev token
    client.login(process.env.DEVTOKEN);
    console.log("starting dev bot (token: " + client.token + ")");
}
else{
    //non dev token
    client.login(process.env.TOKEN);
    console.log("starting main bot (token: " + client.token + ")");
}