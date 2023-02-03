import React, {useEffect, useState} from 'react';

import {Textarea} from './component/Textarea';
import {Button} from './component/Button';
import ChatBox from './component/ChatBox'

import * as env from "env";
import axios from 'axios';
import * as fs from "@tauri-apps/api/fs";
import * as path from "@tauri-apps/api/path";

let apiKey;
let endpoint;
let model;
let instructPrompt;
let stream;
let temperature;

async function readConfig() {
    try {
    const configPath = await path.configDir()
    const configFile = await path.resolve(configPath, "config.json")
    const config =  await fs.readTextFile(configFile)
        return config

    } catch (e) {
        console.log(e)
        return e
    }
}
if (env.MODE === "development") {
    apiKey = env.CHATGPT_API
    endpoint = env.ENDPOINT;
    model = env.MODEL;
    instructPrompt = env.INSTRUCT_PROMPT
    temperature = env.TEMPERATURE
    console.log(apiKey)
    console.log(endpoint)
    console.log(model)
    console.log(instructPrompt)
    console.log(parseFloat(temperature))
    if (!apiKey || !endpoint || !model) {
        throw new Error("Please set environment variable")
    }
} else {
    readConfig().then((config) => {
        const configJson = JSON.parse(config)
        apiKey = configJson.CHATGPT_KEY
        endpoint = configJson.ENDPOINT
        model = configJson.MODEL
        instructPrompt = configJson.INSTRUCT_PROMPT
        temperature = configJson.TEMPERATURE
    }).catch((e)=> {
        console.log(e)
    })
}
export default function App() {
    /**
     * Use to store dataset for the model, it should keep reprompt like ME: or BOT:
     */
    const [messageHistory, setMessageHistory] = useState([
        instructPrompt
    ]);
    /**
     * Store raw message to render in frontend
     */
    const [rawMessageHistory, setRawMessageHistory] = useState([]);

    function sendPromptToChatGPT(prompt) {

        const promptWithBot = `ME: ${prompt}\nBot: `
        const tempMessageHistory = [...messageHistory, promptWithBot].join('\n')
        const waitingMessage = {"author": "bot", "message": "Waiting for response..."}
        setRawMessageHistory(previousRawMessageHistory => [...previousRawMessageHistory,waitingMessage])

        axios({
            method: 'post',
            url: endpoint,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            data: {
                prompt: `${tempMessageHistory}`,
                model: model,
                max_tokens: 2000,
                temperature: parseFloat(temperature),
                stop: ["<|im_end|>", "ME:"],
                stream:false
            }
        }).then((response) => {
            console.log(response)
            const answer = response.data.choices[0].text
            // const answer = response.data
            const saveMess = `ME: ${prompt}\nBot: ${answer}`
            setMessageHistory([...messageHistory, saveMess])
            // push both prompt and answer to rawMessageHistory
            const botResponse = {"author": "bot", "message": answer}
            // replace a waiting message with bot response
            setRawMessageHistory(previousRawMessageHistory => [...previousRawMessageHistory.slice(0, -1), botResponse])
        }).catch((error) => {
            console.log(error)
            setRawMessageHistory(
                previousRawMessageHistory => [...previousRawMessageHistory.slice(0,-1),
                    {"author": "error", "message": error.toString()}]
            )
        })

    }

    useEffect(() => {
        const chatMessages = document.getElementById("chat-container");
        // scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }, [rawMessageHistory])
    return (
        <div className={"grid grid-rows-6 h-screen   "}>

            <div id={"chat-container"} className={"row-span-5  overflow-scroll overscroll-contain"}>
                <div className="flex flex-col h-4/5  w-full   ">
                    {rawMessageHistory.map((messageJson, index) => {
                        return (
                            // codiga-disable
                            <ChatBox key={index} messageJson={messageJson}
                            />
                        )
                    })}
                </div>
            </div>
            <div className={"row-span-1"}>
                <div className={"flex flex-row justify-center  content-end "}>
                    <Textarea
                        id={"prompt"}
                        className={"w-1/2 self-center  bottom-0 mt-6  "}
                        placeholder={"Press Ctrl-Enter to send"}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                if (event.ctrlKey === true) {
                                    const yourPrompt = {
                                        "author": "me",
                                        "message": event.target.value
                                    }
                                    setRawMessageHistory(previousRawMessageHistory => [...previousRawMessageHistory, yourPrompt])
                                    sendPromptToChatGPT(event.target.value)
                                    event.target.value = ""

                                }
                            }
                        }}
                    />
                    <Button
                        className={" self-center  mt-6 mx-12  "}
                        onClick={() => {
                            const yourPrompt = {
                                "author": "me",
                                "message": document.getElementById("prompt").value
                            }
                            setRawMessageHistory(previousRawMessageHistory => [...previousRawMessageHistory, yourPrompt])
                            sendPromptToChatGPT(document.getElementById("prompt").value)
                            document.getElementById("prompt").value = ""
                        }
                        }

                    >Send</Button>
                </div>
            </div>
        </div>
    )
}