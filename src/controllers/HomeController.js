require("dotenv").config();
import request from "request";
import chatbotService from '../services/chatbotService'
import moment from 'moment'
const { GoogleSpreadsheet } = require('google-spreadsheet');
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const SPREADSHEET_ID = process.env.SPREADSHEET_ID;
const GOOGLE_SERVICE_ACCOUNT_EMAIL = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
const GOOGLE_PRIVATE_KEY = process.env.GOOGLE_PRIVATE_KEY;

let writeDataToGoogleSheet = async(data) => {
  let currentDate = new Date();
  const format = "HH:mm DD/MM/YYYY"
  let formatedDate = moment(currentDate).format(format);
  // Initialize the sheet - doc ID is the long id in the sheets URL
const doc = new GoogleSpreadsheet(SPREADSHEET_ID);

// Initialize Auth - see more available options at https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication
await doc.useServiceAccountAuth({
client_email: JSON.parse(`"${GOOGLE_SERVICE_ACCOUNT_EMAIL}"`),
private_key: JSON.parse(`"${GOOGLE_PRIVATE_KEY}"`),
});

await doc.loadInfo(); // loads document properties and worksheets

const sheet = doc.sheetsByIndex[0]; // or use doc.sheetsById[id] or doc.sheetsByTitle[title]
//append rows
await sheet.addRow({
  "Tên FB": data.username,
  "Email" : data.email,
  "SĐT" :  data.phoneNumber,
  "Thời gian": formatedDate,
  "Tên KH": data.customerName
});
}
let getHomePage = (req, res) => {
    return res.render("homepage.ejs");
  };
  let postWebhook = (req, res) => {
    let body = req.body;
  
    // Checks this is an event from a page subscription
    if (body.object === "page") {
      // Iterates over each entry - there may be multiple if batched
      body.entry.forEach(function (entry) {
        // Gets the body of the webhook event
        let webhook_event = entry.messaging[0];
        console.log(webhook_event);
  
        // Get the sender PSID
        let sender_psid = webhook_event.sender.id;
        console.log("Sender PSID: " + sender_psid);
  
        // Check if the event is a message or postback and
        // pass the event to the appropriate handler function
        if (webhook_event.message) {
          handleMessage(sender_psid, webhook_event.message);
        } else if (webhook_event.postback) {
          handlePostback(sender_psid, webhook_event.postback);
        }
      });
  
      // Returns a '200 OK' response to all requests
      res.status(200).send("EVENT_RECEIVED");
    } else {
      // Returns a '404 Not Found' if event is not from a page subscription
      res.sendStatus(404);
    }
  };
  let getWebhook = (req, res) => {
    // Your verify token. Should be a random string.
    let VERIFY_TOKEN = process.env.VERIFY_TOKEN;
  
    // Parse the query params
    let mode = req.query["hub.mode"];
    let token = req.query["hub.verify_token"];
    let challenge = req.query["hub.challenge"];
  
    // Checks if a token and mode is in the query string of the request
    if (mode && token) {
      // Checks the mode and token sent is correct
      if (mode === "subscribe" && token === VERIFY_TOKEN) {
        // Responds with the challenge token from the request
        console.log("WEBHOOK_VERIFIED");
        res.status(200).send(challenge);
      } else {
        // Responds with '403 Forbidden' if verify tokens do not match
        res.sendStatus(403);
      }
    }
  };  
  // Handles messages events
async function handleMessage(sender_psid, received_message) {
  
  let response;
    //check message for quick reply
    if (received_message.quick_reply &&  received_message.quick_reply.payload) {
        if (received_message.quick_reply.payload === 'MAIN_MENU'){
          await chatbotService.handleSendMainMenu(sender_psid);
        }
        if (received_message.quick_reply.payload === 'GIUDE_TO_USE'){
          await chatbotService.handleGuideToUse(sender_psid);
        }
      return;
    }

  
    // Checks if the message contains text
    if (received_message.text) {
      // Create the payload for a basic text message, which
      // will be added to the body of our request to the Send API
      response = {
        text: `You sent the message: "${received_message.text}". Now send me an attachment!`,
      };
    } else if (received_message.attachments) {
      // Get the URL of the message attachment
      let attachment_url = received_message.attachments[0].payload.url;
      response = {
        attachment: {
          type: "template",
          payload: {
            template_type: "generic",
            elements: [
              {
                title: "Is this the right picture?",
                subtitle: "Tap a button to answer.",
                image_url: attachment_url,
                buttons: [
                  {
                    type: "postback",
                    title: "Yes!",
                    payload: "yes",
                  },
                  {
                    type: "postback",
                    title: "No!",
                    payload: "no",
                  },
                ],
              },
            ],
          },
        },
      };
    }
  
    // Send the response message
    callSendAPI(sender_psid, response);
  }
  
  // Handles messaging_postbacks events
  async function handlePostback(sender_psid, received_postback) {
    let response;
  
    // Get the payload for the postback
    // Set the response based on the postback payload
  
    let payload = received_postback.payload;
    switch(payload){
      case  'yes':
        response = { text: "Thanks!" };
        break;
        case  'no':
          response = { text: "Oops, try sending another image.!" };
          break;
          case 'Restart_Conversation':
          case  'GET_STARTED':
            await chatbotService.handleGetStarted(sender_psid);
            // response = { text: "Xin chào, mừng bạn đến với Chatbot" };
            break;
            case 'MAIN_MENU':
            await chatbotService.handleSendMainMenu(sender_psid);
            break;
            case 'LUNCH_MENU':
              await chatbotService.handleSendLunchMenu(sender_psid);
            break;
            case 'DINNER_MENU':
              await chatbotService.handleSendDinnerMenu(sender_psid);
            break;
            case 'VIEW_APPETIZER':
                await chatbotService.handleDetailViewAppetizer(sender_psid);
            break;
            case 'VIEW_FISH':
                await chatbotService.handleDetailViewFish(sender_psid);
            break;
            case 'VIEW_MEAT':
                await chatbotService.handleDetailViewMeat(sender_psid);
            break;
            case 'BACK_TO_MAIN_MENU':
                await chatbotService.handleBackToMainMenu(sender_psid);
            break;
            case 'SHOW_ROOMS':
                await chatbotService.handleShowDetailRooms(sender_psid);
            break;
            case 'RESERVE_TABLE':
              await chatbotService.handleShowDetailRooms(sender_psid);
          break;
          case 'GIUDE_TO_USE':
            await chatbotService.handleGuideToUse(sender_psid);
        break;
            default:
            response = { text: `oop! I don't know postback ${payload}` };
  
  
    }
   
    // Send the message to acknowledge the postback
    callSendAPI(sender_psid, response);
  }
  // Sends response messages via the Send API
function callSendAPI(sender_psid, response) {
    // Construct the message body
    let request_body = {
      recipient: {
        id: sender_psid,
      },
      message: response,
    };
  
    // Send the HTTP request to the Messenger Platform
    request(
      {
        uri: "https://graph.facebook.com/v2.6/me/messages",
        qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        if (!err) {
          console.log("message sent!");
        } else {
          console.error("Unable to send message:" + err);
        }
      }
    );
  }

  // setup get started button, whitelisted domains
let setupProfile = async (req, res) => {
    //call profile Facebook API
    // Construct the message body
    let request_body = {
      get_started: { payload: "GET_STARTED" },
      whitelisted_domains: ["https://restaurant-chatbot-v2.herokuapp.com/"],
    };
  
    // Send the HTTP request to the Messenger Platform
    await request(
      {
        uri: `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        console.log(body);
        if (!err) {
          console.log("Setup user profile success!");
        } else {
          console.error("Unable to setup profile :" + err);
        }
      }
    );
    return res.send("Setup user profile success!");
  };
  //setup persistent menu
   let setupPersistentMenu = async (req,res) => {
     //call profile Facebook API
    // Construct the message body
    let request_body = {
      "persistent_menu": [
        {
            "locale": "default",
            "composer_input_disabled": false,
            "call_to_actions": [
                {
                    "type": "web_url",
                    "title": "Foody",
                    
                    "url": "https://www.foody.vn/",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "web_url",
                    "title": "Facebook Page",
                    
                    "url": "https://www.facebook.com/FoodyVietnam",
                    "webview_height_ratio": "full"
                },
                {
                    "type": "postback",
                    "title": "Khởi động lại Bot",
                    "payload": "Restart_Conversation"
  
                }
            ]
        }
    ]
    }
  
    // Send the HTTP request to the Messenger Platform
    await request(
      {
        uri: `https://graph.facebook.com/v10.0/me/messenger_profile?access_token=${PAGE_ACCESS_TOKEN}`,
        qs: { access_token: PAGE_ACCESS_TOKEN },
        method: "POST",
        json: request_body,
      },
      (err, res, body) => {
        console.log(body);
        if (!err) {
          console.log("Setup persistent menu success!");
        } else {
          console.error("Unable to persistent menu :" + err);
        }
      }
    );
    return res.send("Setup persistent menu success!");
  };
  let handleReserveTable = (req,res) =>{
    return res.render('reserve-table.ejs')
  }

  let handlePostReserveTable =async(req,res) =>{
    try {
      
      let username = await chatbotService.getUser(req.body.psid);
      //viet dl vao ggsheet
      let data = {
        username :username,
        email : req.body.email,
        phoneNumber : `'${req.body.phoneNumber}`,
        customerName : req.body.customerName
      }
      await writeDataToGoogleSheet(data) ;
      let customerName = "";
      if(req.body.customerName === ""){
        customerName = username;

       } else customerName = req.body.customerName;
      let response1 = {
        "text": `----Thông tin khách hàng đặt bàn----
        \nHọ và tên: ${customerName}
        \nEmail: ${req.body.email}
        \nSố điện thoại: ${req.body.phoneNumber}
        `
      };
   
      await chatbotService.callSendAPI(req.body.psid, response1);
      
      return res.status(200).json({
        message: "OK"
      });
     }
      catch (e) {
      console.log("Lỗi post reserve table: " , e)
      return res.status(500).json({
        message: "Server error"
    });
  }
  }


  module.exports = {
    getHomePage: getHomePage,
    postWebhook: postWebhook,
    getWebhook: getWebhook,
    setupProfile: setupProfile,
    setupPersistentMenu:setupPersistentMenu,
    handleReserveTable:handleReserveTable,
    handlePostReserveTable:handlePostReserveTable
  };
  