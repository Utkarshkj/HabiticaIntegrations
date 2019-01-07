var habId = "9c59f8c2-8b41-48fb-82ad-a120a541b647"; //"HABITICA-ID-IN-QUOTES"
var habToken = "dsfsdf"; //"HABITICA-TOKEN-IN-QUOTES"
var webScript = 'https://script.google.com/macros/s/sdfsdf/dev' //WebApp script
var emailID = "sdfdsf@gmail.com";



//-------------------------------------------------

var paramsTemplatePost = {
  "method" : "post",
  "headers" : {
    "x-api-user" : habId, 
    "x-api-key" : habToken
  }
}

var paramsTemplateGet = {
  "method" : "get",
  "headers" : {
    "x-api-user" : habId, 
    "x-api-key" : habToken
  },
}  

var hr = webScript + '?';

//-------------------------------------------------

function cronScript() {
  var str;  
  var str1 = '';
  var msg = ' ';
  var originalH = 1000;
  var originalMP = 1000;
  var originalGP = 1000;
  
  
  //----------------- Test from here -------------------    
  var response = UrlFetchApp.fetch("https://habitica.com/api/v3/user", paramsTemplateGet);
  var user = JSON.parse(response);
  var hp = user.data.stats.hp;
  var mp = user.data.stats.mp;
  var gp = user.data.stats.gp;
  originalH = hp; originalMP = mp; originalGP = gp;
  
  //---------------------Health-------------------------------  
  
  while (hp < 36 && user.data.stats.gp >26)
  {
    var resp1 = UrlFetchApp.fetch("https://habitica.com/api/v3/user/buy-health-potion", paramsTemplatePost);
    var user1 = JSON.parse(resp1);
    str1 = str1 + 'Bought Health <br>';
    msg = msg + 'Bought HP';
    hp = user1.data.hp;
    Utilities.sleep(2000)
  }
  
  //----------------------Cron------------------------------  
  
  UrlFetchApp.fetch("https://habitica.com/api/v3/cron", paramsTemplatePost);
  Utilities.sleep(2000)
  var responsef = UrlFetchApp.fetch("https://habitica.com/api/v3/user", paramsTemplateGet);
  var userf = JSON.parse(responsef);
  
  
  //----------------------Buff------------------------------  
  mp = userf.data.stats.mp;
  for(i = 0;i < 3;i++)
  {
    if (mp > 25)
    {
      var resp1 = UrlFetchApp.fetch("https://habitica.com/api/v3/user/class/cast/toolsOfTrade", paramsTemplatePost);
      str1 = str1 + 'Buffed PER<br>';
      mp = mp-25;
      Utilities.sleep(2000)
    }
  }
  
  //-----------------------Armoire-----------------------------  
  gp = userf.data.stats.mp;
  for(i = 0;i < 2;i++)
  {
    if (gp > 125)
    {
      var respArm = UrlFetchApp.fetch("https://habitica.com/api/v3/user/buy-armoire", paramsTemplatePost);
      var resultArm = JSON.parse(respArm);

      str1 = str1 + 'Bought Armoire<br>';

      if (resultArm.data.armoire.type == 'food') {
        str1 = str1 + "You gained " + resultArm.data.armoire.dropText + "<br>"
      } else {
        str1 = str1 + "You gained " + resultArm.data.armoire.value + " " + resultArm.data.armoire.type + "<br>"    
      }      
      gp = gp-100;
      Utilities.sleep(2000)
    }
  }
  
  //-------------------------Email---------------------------  
  
  var hpR = Math.ceil(userf.data.stats.hp * 10)/10;

  
  str = 'H: '+ hpR + '  E: '+ userf.data.stats.exp + '/' + userf.data.stats.toNextLevel + 
    '  M: '+ Math.floor(userf.data.stats.mp) + '/'+ userf.data.stats.maxMP + 
    '  L: '+ userf.data.stats.lvl + ' ' + msg;
  
  str1 = str1 + 'Health Delta = ' + Math.floor(hpR - originalH) + '<br>' +
    'Mana Delta = ' + Math.floor(userf.data.stats.mp - originalMP) + '<br>' +
    'Gold Delta = ' + Math.floor(userf.data.stats.gp - originalGP) + '<br>' +
    'Buffed Per = ' + userf.data.stats.buffs.per + '<br>' +
    'GP = ' + Math.floor(userf.data.stats.gp) + '<br>' +
    'Points = ' + userf.data.stats.points + '<br>' ;
  
  var mailBody = str1 + '<br><a href="' + hr + 'display">Habitica Dashboard</a><br><br>HabiticaTasksMail'
  
  
  MailApp.sendEmail({
    to: emailID,
    name: "Stats",
    subject: str,
    htmlBody: mailBody
  });
  
}

//----------------------------------------------------  
  

function todoFromGcal() {
  
  var now = new Date();
  var events = CalendarApp.getCalendarsByName("HabiticaReminders")[0].getEventsForDay(now);
  
  for (i = 0; i < events.length; i++) {
    var params = paramsTemplatePost;
    params["payload"] = {
      "text" : events[i].getTitle(), 
      "type" : "todo",
      "priority" : "1.5"
    }
    
    UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user", params)
  } 
}


function todoAsEmail() {
  
  var response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user", paramsTemplateGet);
  var tasks = JSON.parse(response);
  
  for(var i = 0; i < tasks.data.length; i++){
    if (tasks.data[i].type == 'todo') {
      
      var mailBody = 'HabiticaTasksMail <a href="' + hr + 'U' + tasks.data[i].id + '">Completed</a>'  
      
      MailApp.sendEmail({
        to: emailID,
        name: "ToDo: " + tasks.data[i].text,
        subject: "ToDo: " + tasks.data[i].text,
        htmlBody: mailBody
      });
      
      Utilities.sleep(2000)    
    }
  }
  
  // Purging old emails
  // For details, refer http://labnol.org/?p=27605
  
  var PURGE_AFTER = "2";
  
  var age = new Date();  
  age.setDate(age.getDate() - PURGE_AFTER);    
  
  var purge  = Utilities.formatDate(age, Session.getScriptTimeZone(), "yyyy-MM-dd");
  var search = "label:HTD older_than:1d is:unread"
  
  var threads = GmailApp.search(search, 0, 100);
  
  for (var i=0; i<threads.length; i++) {
    var messages = GmailApp.getMessagesForThread(threads[i]);
    for (var j=0; j<messages.length; j++) {
      var email = messages[j];       
      email.markRead();
      //          email.moveToTrash();
      
    }
  }
}


//----------------------------------------------------------
//-------------------WebApp---------------------------------

function doGet(e)
{
 
  var response;
  var strResponse;
  
  if (e.queryString == '' || e.queryString == 'display')
  {
    strResponse = 'Welcome !!';
    
  }

//-------------------------------------------------
  
  else if (e.queryString == 'sleep')
  {

    response = UrlFetchApp.fetch('https://habitica.com/api/v3/user/sleep', paramsTemplatePost);
    var result = JSON.parse(response);
    if (result.data == true) {
      strResponse = 'You are resting in the Tavern' }
    if (result.data == false) {
      strResponse = 'You have left the Tavern and are ACTIVE' }
      
      } 
      
//-------------------------------------------------
  
  else {
    
    var taskId = e.queryString;
    
    if (taskId.charAt(0) == 'U') {
      response = UrlFetchApp.fetch('https://habitica.com/api/v3/tasks/' + taskId.slice(1) + '/score/up', paramsTemplatePost);
    }
    else {
      response = UrlFetchApp.fetch('https://habitica.com/api/v3/tasks/' + taskId.slice(1) + '/score/down', paramsTemplatePost);
    }
    
    var result = JSON.parse(response);
    if (result.success == true) 
    {strResponse = 'Success !!'}
    else {strResponse = 'ERROR'}
              
    if (result.data._tmp.drop != null) 
    {strResponse = strResponse + '\t  ' + result.data._tmp.drop.dialog}

  }

//-------------------------------------------------
  
  
  response = UrlFetchApp.fetch("https://habitica.com/api/v3/user", paramsTemplateGet);
  var user = JSON.parse(response);
  var str = '<b>'+ strResponse + 
    '</b> <br><br>Health: '+ Math.floor(user.data.stats.hp) + 
    '<br>Exp: &nbsp&nbsp&nbsp'+ Math.floor(user.data.stats.exp) + '/' + user.data.stats.toNextLevel + 
    '<br>Mana: &nbsp'+ Math.floor(user.data.stats.mp) + '/' + user.data.stats.maxMP + 
    '<br>Level: &nbsp'+ user.data.stats.lvl + 
    '<br>Sleep: &nbsp' + user.data.preferences.sleep

  var newDate = Date();
  var result = Utilities.formatDate(new Date(), Session.getScriptTimeZone(),  "MMM d yyyy HH:mm:ss") + '<br><br>Daily List:  ';

  str = str + ' <a href="'+ hr + 'sleep">(Toggle)</a> <br><br><p>' + result + '</p>';

  var response = UrlFetchApp.fetch("https://habitica.com/api/v3/tasks/user", paramsTemplateGet);
  var tasks = JSON.parse(response);
  
//----------------------------------------------------------
  
  for(var i = 0; i < tasks.data.length; i++){
    if (tasks.data[i].type == 'daily' && tasks.data[i].completed == false) {
      str = str + '\n<li><a href="' + hr + 'U' + tasks.data[i].id + '">' + tasks.data[i].text + ' (' + tasks.data[i].streak + ')</a></li>'
    }
  }
  
  str = str + '<br><br><p>' + 'ToDo List' + '</p>';

  for(var i = 0; i < tasks.data.length; i++){
    if (tasks.data[i].type == 'todo') {
      str = str + '\n<li><a href="' + hr + 'U' + tasks.data[i].id + '">' + tasks.data[i].text + '</a></li>'
    }
  }
  
  str = str + '<br><br><p>' + 'Habit List' + '</p>';
  
  for(var i = 0; i < tasks.data.length; i++){
    if (tasks.data[i].type == 'habit') {
      str = str + '\n<li>(<a href="' + hr + 'U' + tasks.data[i].id + '">Up</a> / <a href="' + hr + 'D' + tasks.data[i].id + '">Down</a>)  ' + 
        '<a href="' + hr + 'U' + tasks.data[i].id + '">' + tasks.data[i].text + '</a></li>'
      
    }
  }
    
  var template1 = '<!DOCTYPE html>\n<html>\n  <head>\n    <base target="_top">\n  <\head>\n  <body>\n';
  var template2 = '\n</body>\n</html>';
  return HtmlService.createHtmlOutput(template1+str+template2) 
  
}
