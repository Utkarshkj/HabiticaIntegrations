Images: 

The Webpage: https://imgur.com/a/WuhyTiT   
Email notifications: https://imgur.com/a/5LEtc2L  
Bookmark the address to the "Simple Page" for quick access, thus avoiding the temptation of notifications/guilds/party/quests etc.

How to use:
----------------
1. Go to google script page. Create a new Project.
2. Add a new script titled WebApp.gs
3. Paste the contents into that script. Save. 
4. Add your HabiticaID And HabiticaToken in the file.
5. Go to Publish > Deploy as WebApp > Click Test web app for the latest code. Grant the permissions when asked. 
   > Copy the URL of the new page opened. (Google may warn that the source is unverified, but click "I understand the risks" and agree.)
6. Paste this URL in front of webScript.
7. Add your email address.
8. (Optional) Add the skill name and skill MP for auto casting. 

9. Add the triggers:
Edit Tab in top bar > Current Project triggers > Add the following triggers: 
(Select function > Event Source: "Time driven" > Type of time based trigger: "Day Timer" >  Select the appropriate time > Save)
	a. cronScript > around 10am, gives you the chance to mark yesterday's dailies. (Also sends an email with stats after cron.)
	b. todoFromGcal > early morning, 5am
	c. todoAsEmail > early morning but AFTER todoFromGcal, 6am
	d. statsEmail > If you want extra email reminders throughout the day, whenever you want.
9. If you would not alike to use certain functions, dont add a trigger for them, or comment them out in the script.


Connecting google calendar:
-----------------------------------
1. Go to google calendar.
2. Create a new calendar named: "HabiticaReminders".
3. All events belonging to this calendar that are scheduled for today will get added as a ToDo.



This script does the following functions:
-----------------------------------------
1. Display a dashboard of current stats, sleep, habits, dailies and todos on a simple web page.
2. Send stats and todos as emails that can be clicked to score the tasks
4. Creates todos from events in google calendar. Therefore helps to create scheduled todos with advanced repeat functions. Like paying the phone bill on every 10th of the month.
3. Some automation features like auto buy health, auto cron, auto cast skills etc.

Benefits:
---------
1. Works on low end/mobile browsers. 
2. Can work from inside email clients.
3. Bookmark the "simple page" for quick access. Does not require logging in.
4. For Digital addicts: Those who prefer not to be distracted by guilds and chats.
5. For Digital addicts: Works for those who have blocked all apps. Can use the email to mark todos.
6. When habitica website is blocked in workplace, but gmail is allowed.
7. Email Reminder for Stats: Health, Exp, Mana, Gold, Level, and buffs as Email.

Email:
------
1. Daily reminder of stats without having to open the website.
2. Daily reminder of ToDos. Added incentive to complete the todos and get the email inbox clean.
3. No need to open the website/app. The tasks can be completed right from the email client.


Auto Tasks:
------------
1. Auto buy health if it falls below 35.
2. Auto cast skills (party and player skills).
3. Auto buy armoire.
4. Auto cron.


Notes:
------
Emails sent by the script which are older than 1 day will be automatically marked as read. 
You also have the option to permanently move them to the trash by changing the script.
You can find all the mails sent via the script by searching for "HabiticaTasksMail" (And create a filter)


-------------------------------------------
The following skills can be auto cast:
-------------------------------------------
Example: Skill = Tools of Trade:
skillName = "toolsOfTrade";
skillMP = "25";


MAGE 
Ethereal Surge: "mpheal"; 30
Earthquake: "earth"; 35
Chilling Frost: "frost"; 40

WARRIOR
Defensive Stance: "defensiveStance"; 25
Valorous Presence: "valorousPresence"; 20
Intimidating Gaze: "intimidate"; 15

ROGUE 
Tools of the Trade: "toolsOfTrade"; 25
Stealth: "stealth"; 45

HEALER 
Healing Light: "heal"; 15
Protective Aura: "protectAura"; 30
Searing Brightness: "brightness"; 15
Blessing: "healAll"; 25
