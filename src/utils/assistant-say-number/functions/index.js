const functions = require("firebase-functions");
const ActionsSdkAssistant = require("actions-on-google").ActionsSdkAssistant;

exports.sayNumber = functions.https.onRequest((req, res) => {
  const assistant = new ActionsSdkASsistant({ request: req, response: res });

  const reprompts = [
    `I didn't here a number`,
    `If you're still here, what's the number`,
    `What is the number?`,
  ];

  const actionMap = new Map();

  actionMap.set(assistant.StandardIntents.MAIN, (assistant) => {
    const inputPrompt = assistant.buildInputPrompt(
      true,
      `<speak>
      Hi! <break time='1'>
      I can read out an ordinal number like <say-as interpret-as ="ordinal">123</say-as>.
      Say a number.
      </speak>`,
      reprompts
    );
    assistant.ask(inputPrompt);
  });

  actionMap.set(assistant.StandardIntents.TEXT, (assistant)=>{
      const rawInput = assistant.getRawInput()
      if(rawInput === 'bye'){
          assistant.tell('Goodbye!')
      } else if (isNan(parseInt(rawInput,10))){
        const inputPrompt = assistant.buildInputPrompt(false,`I didn't quite get that, what was the`)
      } else {
          const inputPrompt = assistant.buildInputPrompt(true,`<speak></speak>`)
      }
      assistant.ask(inputPrompt)
  })
  assistant.handleRequest(actionMap)
});