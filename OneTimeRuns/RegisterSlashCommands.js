require('dotenv').config();
const { REST, Routes,ApplicationCommandOptionType } = require('discord.js');


//The Below Snippets Shows How to Create a Slash Command( generally for Moderator and Higher Level Use (Make the Command Name and Conditions Discriptive ))

//  Registering SLash Command to have Banned word
const commands = [ {
  name : 'addbanword',
  description: 'Add banned word that cannot be used in the server(Moderator Permission Only',
  options:[
    {
      name: "word",
      type: ApplicationCommandOptionType.String,
      description: "The Word to Ban",
      required: true,
    },
  ],
},

{
  name: 'setalloweddomain',
  description: 'Add a domain to the allowed list (Moderator Only)',
  options: [
      {
          name: "domain",
          type: ApplicationCommandOptionType.String,
          description: "The domain to allow (e.g., youtube.com)",
          required: true,
      },
  ],
},
{
  name: 'removealloweddomain',
  description: 'Remove a domain from the allowed list (Moderator Only)',
  options: [
      {
          name: "domain",
          type: ApplicationCommandOptionType.String,
          description: "The domain to remove from allowed list",
          required: true,
      },
  ],
},
{
  name: 'requestdomain',
  description: 'Request a new domain to be added to the allowed list',
  options: [
      {
          name: "domain",
          type: ApplicationCommandOptionType.String,
          description: "The domain you want to request permission for",
          required: true,
      },
  ],
},
{
  name: 'listalloweddomains',
  description: 'Show all currently allowed domains',
},
{
  name: 'listdomainrequests',
  description: 'Show all pending domain requests (Moderator Only)',
}

//   {
//     name: 'createrole',
//     description: 'create a new role along with the needed channel(Admin Level Only)',
//     options:[
//       {
//         name:'role_name',
//         description:'name of the role',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
//       {
//         name: 'role_emoji',
//         description: 'emoji for the role',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
     
     
//     ]
//   },
//   {
//     name: 'createproject',
//     description: 'create a new role project with the needed channel(Admin Level Only)',
//     options:[
//       {
//         name:'project_name',
//         description:'name of the project',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
//       {
//         name: 'project_emoji',
//         description: 'emoji for the project',
//         type: ApplicationCommandOptionType.String,
//         required: true,
//       },
     
     
//     ]
//   },
//   {
//     name: 'deletechannel',
//     description: 'create a new role project with the needed channel(Admin Level Only)',
    
//   },
  


 
];

const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);

(async () => {
  try {
    console.log('Registering slash commands...');

    await rest.put(
      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),
      { body: commands }
    );

    console.log('Slash commands were registered successfully!');
  } catch (error) {
    console.log(`There was an error: ${error}`);
  }
})();