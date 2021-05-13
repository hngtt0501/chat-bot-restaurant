import { json } from 'body-parser';
import request from'request';
require('dotenv').config();
const PAGE_ACCESS_TOKEN = process.env.PAGE_ACCESS_TOKEN;
const IMAGE_GET_STARTED = 'http://bit.ly/tt-bo1'
const IMAGE_MAIN_MENU_1 = 'https://bit.ly/3sYYSyQ'
const IMAGE_MAIN_MENU_2 = 'https://bit.ly/2Q5JPoM'

const IMAGE_MAIN_MENU_3 = 'https://bit.ly/3mpErbR'
const IMAGE_LUNCH_MENU_1 ='https://bit.ly/3fMPXgs'
const IMAGE_LUNCH_MENU_2 ='https://bit.ly/31UFkQc'

const IMAGE_LUNCH_MENU_3 ='https://bit.ly/3giLfr5'
const IMAGE_BACK_MAIN_MENU='https://bit.ly/32JEGpi'
const IMAGE_DETAIL_APPETIZER_1 ='https://bit.ly/3gN2Ebr'
const IMAGE_DETAIL_APPETIZER_2 ='https://bit.ly/3xxqhKV'
const IMAGE_DETAIL_APPETIZER_3 ='https://bit.ly/3u5HE3r'
const IMAGE_DETAIL_FISH_1 ='https://bit.ly/3u3jtT7'
const IMAGE_DETAIL_FISH_2 ='https://bit.ly/3eJ10Vw'
const IMAGE_DETAIL_FISH_3 ='https://bit.ly/3eEfPZt'
const IMAGE_DETAIL_MEAT_1 ='https://bit.ly/3eEm5R3'
const IMAGE_DETAIL_MEAT_2 ='https://bit.ly/3tbx2yZ'
const IMAGE_DETAIL_MEAT_3 ='https://bit.ly/3eDDoSg'

const IMAGE_DETAIL_ROOMS = 'https://bit.ly/3vvMHL4'

const IMAGE_GIF ='https://bit.ly/2RoFQUW'

let callSendAPI = async(sender_psid,response) =>{

  return new Promise(async (resolve, reject) =>{
    try{
 // Construct the message body
 let request_body = {
  recipient: {
    id: sender_psid,
  },
  message: response,
};
await sendMarkReadMessage(sender_psid);
await sendTypingOn(sender_psid);
// Send the HTTP request to the Messenger Platform
request(
  {
    uri: "https://graph.facebook.com/v9.0/me/messages",
    qs: { access_token: PAGE_ACCESS_TOKEN },
    method: "POST",
    json: request_body,
  },
  (err, res, body) => {
    console.log("---------------")
    console.log(body)
    console.log("---------------")

    if (!err) {
      resolve("message sent!");
    } else {
      console.error("Unable to send message:" + err);
    }
  });
    }
    catch(e){
      reject(e);
    }
   
  })
     
}
let sendTypingOn= (sender_psid,response) =>{
    // Construct the message body
 let request_body = {
   recipient: {
     id: sender_psid,
   },
   "sender_action":"typing_on"
 };

 // Send the HTTP request to the Messenger Platform
 request(
   {
     uri: "https://graph.facebook.com/v9.0/me/messages",
     qs: { access_token: PAGE_ACCESS_TOKEN },
     method: "POST",
     json: request_body,
   },
   (err, res, body) => {
     if (!err) {
       console.log("sent typing on!");
     } else {
       console.error("Unable to send message:" + err);
     }
   }
 );
}
let sendMarkReadMessage= (sender_psid,response) =>{
    // Construct the message body
 let request_body = {
   recipient: {
     id: sender_psid,
   },
   "sender_action":"mark_seen"
 };

 // Send the HTTP request to the Messenger Platform
 request(
   {
     uri: "https://graph.facebook.com/v9.0/me/messages",
     qs: { access_token: PAGE_ACCESS_TOKEN },
     method: "POST",
     json: request_body,
   },
   (err, res, body) => {
     if (!err) {
       console.log("sent typing on!");
     } else {
       console.error("Unable to send message:" + err);
     }
   }
 );
}
let getUser = (sender_psid)=>{
    return new Promise((resolve, reject)=>{
 request(
    {
      uri: `https://graph.facebook.com/${sender_psid}?fields=first_name,last_name,profile_pic&access_token=${PAGE_ACCESS_TOKEN}`,
      qs: { access_token: PAGE_ACCESS_TOKEN },
      method: "GET",
    },
    (err, res, body) => {
        console.log(body)
      if (!err) {
        body = JSON.parse(body);
        // "first_name": "Peter",
        //  "last_name": "Chang",
       let userName = `${body.last_name} ${body.first_name}`;
        resolve(userName);

      } else {
        console.error("Unable to send message:" + err);
        reject(err);
      }
    });
})
}
let handleGetStarted= (sender_psid)=>{
    return new Promise(async(resolve, reject)=>{
        try {
        let userName =await getUser(sender_psid);
          let response1 = { text: `Xin chào bạn ${userName} đến với trang BẠN MUỐN ĂN GÌ?` };
          //let response2 =getStartedTemplate();
          //send gif image
          let response2 = getImageGetStarted();
          let response3 =getStartedQuickReplyTemplate();

          //send text message
          await callSendAPI(sender_psid,response1);
          //send generic template message
          await callSendAPI(sender_psid,response2);
          await callSendAPI(sender_psid,response3);


          resolve('done');
        } catch (e) {
            reject(e);
            
        }
    });
}
let getStartedTemplate =()=>{
  let  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Xin chào bạn đến với trang BẠN MUỐN ĂN GÌ?.",
            subtitle: "Dưới đây là các lựa chọn.",
            image_url: IMAGE_GET_STARTED,
            buttons: [
              {
                type: "postback",
                title: "MENU CHÍNH",
                payload: "MAIN_MENU",
              },
              {
                type: "web_url",
                title: "ĐẶT BÀN",
                "url" :`${process.env.URL_WEB_VIEW_ORDER}`,
                "webview_height_ratio" : "tall",
                "messenger_extensions": true,
                
              },
              {
                type: "postback",
                title: "HƯỚNG DẪN SỬ DỤNG BOT",
                payload: "GIUDE_TO_USE",
              },
            ],
          },
        ],
      },
    },
  };
  return response;
}

let getImageGetStarted =() =>{
  let response ={
    "attachment":{
        "type":"image", 
        "payload":{
          "url": IMAGE_GIF, 
          "is_reusable":true
        }
      }
  }
  return response
}

let getStartedQuickReplyTemplate =() =>{
  let response = {
    "text": "Dưới đây là các lựa chọn:",
    "quick_replies":[
      {
        "content_type":"text",
        "title":"GỢI Ý",
        "payload":"MAIN_MENU",
        // "image_url":"http://example.com/img/red.png"
      },{
        "content_type":"text",
        "title":"HDSD Bot",
        "payload":"GIUDE_TO_USE",
        // "image_url":"http://example.com/img/green.png"
      },
      // {
      //   "content_type":"location",
      //   "title":"LOCATION",
      //   "payload":"LOACATION",
      //   // "image_url":"http://example.com/img/green.png"
      // }
    ]
  }
  return response;
}

let handleSendMainMenu = (sender_psid) =>{
  return new Promise(async(resolve, reject)=>{
    try {
      let response1 =getMainMenuTemplate();
      //send text message
      await callSendAPI(sender_psid,response1);
    

      resolve('done');
    } catch (e) {
        reject(e);
        
    }
});
}
let getMainMenuTemplate =() =>{
  let  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        "elements":[
          {
           "title":"Bạn muốn xem gợi ý buổi nào ?",
           "image_url":IMAGE_MAIN_MENU_1,
           "subtitle":"Chúng tôi gợi ý cho bạn các món ăn theo buổi.",
           "default_action": {
             "type": "web_url",
             "url": "https://petersfancybrownhats.com/view?item=103",
             "webview_height_ratio": "tall",
           },
           "buttons":[
             {
               "type":"postback",
               "title":"BỮA TRƯA",
               "payload":"LUNCH_MENU"
             },{
               "type":"postback",
               "title":"BỮA TỐI",
               "payload":"DINNER_MENU"
             }              
           ]      
         },
    
        {
         "title":"Giờ mở cửa!",
         "image_url":IMAGE_MAIN_MENU_2,
         "subtitle":"T2-T3  10AM - 11PM    |    SAT   5PM  -  10PM    |   SUN  5PM - 9PM",
         "default_action": {
           "type": "web_url",
           "url": "https://petersfancybrownhats.com/view?item=103",
           "webview_height_ratio": "tall",
         },
         "buttons":[
         {
          type: "web_url",
          title: "ĐẶT BÀN",
          "url" :`${process.env.URL_WEB_VIEW_ORDER}`,
          "webview_height_ratio" : "tall",
          "messenger_extensions": true,
           }              
         ]      
       },
    
      {
       "title":"Không gian nhà hàng!",
       "image_url":IMAGE_MAIN_MENU_3,
       "subtitle":"Nhà hàng có sức chứa 300 khách hàng",
       "default_action": {
         "type": "web_url",
         "url": "https://petersfancybrownhats.com/view?item=103",
         "webview_height_ratio": "tall",
       },
       "buttons":[
        {
           "type":"postback",
           "title":"CHI TIẾT",
           "payload":"SHOW_ROOMS"
         }              
       ]      
     }
   ]
      },
    },
  };
  return response;
}
let handleSendLunchMenu = (sender_psid) => {
  return new Promise(async(resolve, reject)=>{
    try {
      let response1 =getLunchMenuTemplate();
      //send text message
      await callSendAPI(sender_psid,response1);
    

      resolve('done');
    } catch (e) {
        reject(e);
        
    }
});
}
let getLunchMenuTemplate = () =>{
  let  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Món khai vị.",
            subtitle: "Nhà hàng có nhiều món khai vị hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_1,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_APPETIZER",
              },
            
            ],
          },
          {
            title: "Món cá.",
            subtitle: "Nhà hàng có nhiều món cá hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_2,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_FISH",
              },
            
            ],
          },
          {
            title: "Món thịt",
            subtitle: "Nhà hàng có nhiều món thịt hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_3,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_MEAT",
              },
            
            ],
          },
          {
            title: "Quay trở lại.",
            subtitle: "Quay trở lại MENU CHÍNH.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: "Quay trở lại",
                payload: "BACK_TO_MAIN_MENU",
              },
            
            ],
          }
        ],
      },
    },
  };
  return response;
}
let handleSendDinnerMenu =(sender_psid) => {
  return new Promise(async(resolve, reject)=>{
    try {
      let response1 =getDinnerMenuTemplate();
      //send text message
      await callSendAPI(sender_psid,response1);
    

      resolve('done');
    } catch (e) {
        reject(e);
        
    }
});
}
let getDinnerMenuTemplate = () => {
  let  response = {
    attachment: {
      type: "template",
      payload: {
        template_type: "generic",
        elements: [
          {
            title: "Món khai vị.",
            subtitle: "Nhà hàng có nhiều món khai vị hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_1,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_APPETIZER",
              },
            
            ],
          },
          {
            title: "Món cá.",
            subtitle: "Nhà hàng có nhiều món cá hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_2,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_FISH",
              },
            
            ],
          },
          {
            title: "Món thịtttttttttt.",
            subtitle: "Nhà hàng có nhiều món thịt hấp dẫn.",
            image_url: IMAGE_LUNCH_MENU_3,
            buttons: [
              {
                type: "postback",
                title: "Xem chi tiết",
                payload: "VIEW_MEAT",
              },
            ],
          },
          {
            title: "Quay trở lại.",
            subtitle: "Quay trở lại MENU CHÍNH.",
            image_url: IMAGE_BACK_MAIN_MENU,
            buttons: [
              {
                type: "postback",
                title: "Quay trở lại",
                payload: "BACK_TO_MAIN_MENU",
              },
            
            ],
          }
        ],
      },
    },
  };
  return response;
}

let handleBackToMainMenu = async(sender_psid) =>{
    await handleSendMainMenu(sender_psid)
}
let handleDetailViewAppetizer =(sender_psid) => {
    return new Promise(async(resolve, reject)=>{
        try {
          let response1 =getDetailViewAppetizerTemplate();
          //send text message
          await callSendAPI(sender_psid,response1);
        
    
          resolve('done');
        } catch (e) {
            reject(e);
            
        }
    });
}
let getDetailViewAppetizerTemplate = () => {
    let  response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Món gỏi.",
              subtitle: "60.000đ",
              image_url: IMAGE_DETAIL_APPETIZER_1,
            
            },
            {
              title: "Món súp.",
              subtitle: "50.000đ.",
              image_url: IMAGE_DETAIL_APPETIZER_2,
             
            },
            {
              title: "Món salad.",
              subtitle: "45.000đ",
              image_url: IMAGE_DETAIL_APPETIZER_3,
            
            },
            {
                title: "Quay trở lại.",
                subtitle: "Quay trở lại MENU BUỔI TRƯA.",
                image_url: IMAGE_BACK_MAIN_MENU,
                buttons: [
                  {
                    type: "postback",
                    title: "Quay trở lại",
                    payload: "LUNCH_MENU",
                  },
                
                ],
              }
          ],
        },
      },
    };
    return response;
  }
let handleDetailViewFish =(sender_psid) => {
    return new Promise(async(resolve, reject)=>{
        try {
          let response1 =getDetailViewFishTemplate();
          //send text message
          await callSendAPI(sender_psid,response1);
        
    
          resolve('done');
        } catch (e) {
            reject(e);
            
        }
    });
}
let getDetailViewFishTemplate =()=> {
    let  response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Cá hồi.",
              subtitle: "80.000đ",
              image_url: IMAGE_DETAIL_FISH_1,
            
            },
            {
              title: "Món ngừ.",
              subtitle: "100.000đ.",
              image_url: IMAGE_DETAIL_FISH_2,
             
            },
            {
              title: "Món basa.",
              subtitle: "65.000đ",
              image_url: IMAGE_DETAIL_FISH_3,
            
            },
            {
                title: "Quay trở lại.",
                subtitle: "Quay trở lại MENU CHÍNH.",
                image_url: IMAGE_BACK_MAIN_MENU,
                buttons: [
                  {
                    type: "postback",
                    title: "Quay trở lại",
                    payload: "LUNCH_MENU",
                  },
                
                ],
              }
          ],
        },
      },
    };
    return response;
  }
let handleDetailViewMeat =(sender_psid) => {
    return new Promise(async(resolve, reject)=>{
        try {
          let response1 =getDetailViewMeatTemplate();
          //send text message
          await callSendAPI(sender_psid,response1);
        
    
          resolve('done');
        } catch (e) {
            reject(e);
            
        }
    });
}
let getDetailViewMeatTemplate =()=> {
    let  response = {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [
            {
              title: "Thịt bò",
              subtitle: "200.000đ",
              image_url: IMAGE_DETAIL_MEAT_1,
             
            },
            {
              title: "Thịt cừu.",
              subtitle: "280.000đ",
              image_url: IMAGE_DETAIL_MEAT_2,
            },
            {
              title: "Thịt heo",
              subtitle: "190.000đ",
              image_url: IMAGE_DETAIL_MEAT_3,
        
            },
            {
              title: "Quay trở lại.",
              subtitle: "Quay trở lại MENU CHÍNH.",
              image_url: IMAGE_BACK_MAIN_MENU,
              buttons: [
                {
                  type: "postback",
                  title: "Quay trở lại",
                  payload: "LUNCH_MENU",
                },
              
              ],
            }
          ],
        },
      },
    };
    return response;
  }
  
let getImageTemplate = () =>{
      let response ={
        "attachment":{
            "type":"image", 
            "payload":{
              "url": IMAGE_DETAIL_ROOMS, 
              "is_reusable":true
            }
          }
      }
      return response
  }
 let getButtonRoomsTemplate = () =>{
    let response ={
        "attachment":{
            "type":"template",
            "payload":{
              "template_type":"button",
              "text":"Nhà hàng có thể phục vụ tối đa 300 khách",
              "buttons":[
                {
                  "type":"postback",
                  "title":"MENU CHÍNH",
                  "payload":"MAIN_MENU"
                },
                {
                  type: "web_url",
                  title: "ĐẶT BÀN",
                  "url" :`${process.env.URL_WEB_VIEW_ORDER}`,
                  "webview_height_ratio" : "tall",
                  "messenger_extensions": true,
                  },
              ]
            }
          }
    }
    return response;
}
  let handleShowDetailRooms =(sender_psid) =>{
    return new Promise(async(resolve, reject)=>{
        try {
            //send image
          let response1 =getImageTemplate();
          //send text,button message
          let response2 =getButtonRoomsTemplate();

          await callSendAPI(sender_psid,response1);
          await callSendAPI(sender_psid,response2);

       
          resolve('done');
        } catch (e) {
            reject(e);
            
        }
    });
  }

  let handleGuideToUse = (sender_psid) => {
    return new Promise(async(resolve, reject)=>{
      try {
          //send text
          let userName =await getUser(sender_psid);
          let response1 = { text: `Xin chào bạn ${userName} đến với trang BẠN MUỐN ĂN GÌ? \n Đây là HDSD.` };
        //send video
        let response2 =getBotMedia();

        await callSendAPI(sender_psid,response1);
        await callSendAPI(sender_psid,response2);

     
        resolve('done');
      } catch (e) {
          reject(e);
          
      }
  });
  }
  let getBotMedia = () =>{
    let response ={
      "attachment": {
        "type": "template",
        "payload": {
           "template_type": "media",
           "elements": [
              {
                 "media_type": "video",
                 "url": "https://business.facebook.com/104118268497772/videos/274536761030845/",
                 "buttons": [
                  {
                     "type": "postback",
                     "title": "MENU CHÍNH",
                     "payload": "MAIN_MENU",
                  },
                  
            
               ]
              }
           ]
        }
      }    
    };
    return response;
  }
module.exports =  {
    handleGetStarted: handleGetStarted,
    handleSendMainMenu: handleSendMainMenu,
    handleSendLunchMenu:handleSendLunchMenu,
    handleSendDinnerMenu:handleSendDinnerMenu,
    handleBackToMainMenu:handleBackToMainMenu,
    handleDetailViewAppetizer:handleDetailViewAppetizer,
    handleDetailViewFish:handleDetailViewFish,
    handleDetailViewMeat:handleDetailViewMeat,
    handleShowDetailRooms:handleShowDetailRooms,
    callSendAPI:callSendAPI,
    getUser:getUser,
    handleGuideToUse:handleGuideToUse

}