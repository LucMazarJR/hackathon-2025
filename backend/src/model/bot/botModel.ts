import {sendMessage} from "./botConfig/config.js"

export let messageBotModel = async (message: string, sessionId?: string): Promise<[number, string]> => {
  let response = await sendMessage(message, sessionId || "default")
  return [200, response];
}