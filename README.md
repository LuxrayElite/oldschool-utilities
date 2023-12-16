# oldschool-utilities
This is a discord utility bot repository for the oldschoolbot project

# Features
Tracking time for your trip to return using relative time.
Tracking your slayer task (Currently only operates of gettings tasks via autoslay)
Tracking farming timers (Although all are not yet displayed)
Tracking whether or not you have a clue (Patron or non-patron) (Doesnt tell which clue you have)
Tracks Tears of guthix timer.
Allows you to check masses going on at the moment (This list complies all raids going on within servers the bot is active)

With the exception of trip timer and raid tracking, the bot will not display this information until you actively participate (eg you never do herb runs or birdhouses it wont be displayed)

# Commands
Currently there are only three commands present within the bot:

track - In combination with your minion name the bot will start tracking your minion (You will have to redo this command if you change the name)
t - Posts an embed of currently active timers/tracked data on your account
cm - Posts a current list of active raids going on

### Setting up the bot to run locally for contributing

To run the bot, you need the following things first: Git, [NodeJS v18+](https://nodejs.org/en/), [Postgres](https://www.postgresql.org/download/) or [MongoDB](https://www.mongodb.com/) and a discord bot account.

#### **Setting up a Discord Bot**

1. Head to [Discord Developers](https://discord.com/developers) and create an application.
2. Once created, click into your Application.
3. Copy and store the Application ID, you'll need this later on.
4. Create a Bot on the Bot tab. Copy and store the token for your bot, you'll need this later on.
5. Ensure your bot has `Privileged Gateway Intents > Message Content Intent` enabled.
6. Invite your bot to your server via this URL. Be sure to input your `Application ID` into the URL. `[https://discord.com/api/oauth2/authorize?client_id=<INSERT APPLICATION ID HERE>&permissions=329728&scope=bot](https://discord.com/api/oauth2/authorize?client_id=<INSERT APPLICATION ID HERE>&permissions=329728&scope=bot)`

#### **Setting up your environment**

1. Clone the repository: `git clone https://github.com/LuxrayElite/oldschool-utilities.git`
2. Change into the new directory: `cd oldschool-utilities`
3. If utilising postgres change to the postgres branch using `git checkout postgres`
4. Install the yarn dependency: `npm install --global yarn`
5. Make a .env file copy from the example `cp .env.example .env`
7. Update this new `.env` file:
   1. Input your bot token you retrieved earlier into `TOKEN`
   2. Change the prefix to whatever you wish with PREFIX
   4. Input your username, password, and schema names into `DATABASE_URL` using the format `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`
   5. If using mongoDB utilise the format `mongodb+srv://USER:PASSWORD@CLUSTERNAME.NODE.mongodb.net/PROJECTNAME` when clicking on the connect button on mongodb atlas it will give you a similarly formated url, you just have to add the project name
8. Run `yarn` then `yarn install`
9. Run `npx prisma generate` to generate the Prisma client files.
10. Run `npx prisma db push` to create the tables on the database referenced in .env
11. Run `yarn build` - then run `yarn start`. 
