const { REST, Routes } = require("discord.js");
require("dotenv").config();

//to register commands, run: "node src/register-commands.js"

const dev = "true"; //remember to save when changing this

//commands
const commands = [
    {
        name: "deepdive",
        description: "Information about the current Deep Dives",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
        options: [
            {
                name: "mobile",
                description: "Use tighter formatting that's easier to view on mobile devices",
                type: 5,
                required: false,
            },
        ],
    },
    {
        name: "dailydeal",
        description: "Shows the current Daily Deal",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: "info",
        description: "Information about this bot",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: "changelog",
        description: "Shows a changelog containing all the new changes in the latest update",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
    {
        name: "invite",
        description: "Get an invite for this bot",
        integration_types: [0, 1],
        contexts: [0, 1, 2],
    },
];

let rest;

if(dev == "true"){
    rest = new REST({ version: "10" }).setToken(process.env.DEVTOKEN);
}
else{
    rest = new REST({ version: "10" }).setToken(process.env.TOKEN);
}

updateCommands();

async function updateCommands() {
    let idToUse = null;

    if(dev == "true"){
        idToUse = process.env.DEVCLIENTID;
        console.log("using dev id");
    }
    else{
        idToUse = process.env.CLIENTID;
        console.log("using main id");
    }

    if(idToUse == null) return;

	try {
		//delete all commands
		console.log("deleting all commands...");
        await rest.put(
            Routes.applicationCommands(idToUse),
            { body: [] }
        );
        console.log("old commands deleted");
        
		//register the new commands
		console.log("registering new commands...");
		await rest.put(
			Routes.applicationCommands(idToUse),
			{ body: commands }
		);
        console.log("new commands registered");
	} catch (error) {
		console.error("error updating commands:", error);
	}
}