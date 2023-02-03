import React, {useState} from 'react'
import ReactMarkdown from 'react-markdown'

export default function ChatBox (props){
    function parseMessage(messageJson){
        const author = messageJson.author
        const message = messageJson.message
        if (author === "me"){
            return (
                <div className={"flex flex-row place-content-end   "}>
                    <ReactMarkdown
                        className="whitespace-pre-wrap
                        text-right  p-5 rounded m-5
                          bg-gradient-to-br  from-green-400 to-emerald-600" >
                    {message}
                </ReactMarkdown></div>
            )
        } else if (author==="bot") {
            return (
                <div className={"flex flex-row " +
                    "place-content-start"
                   }>
                    <ReactMarkdown className={
                    "whitespace-pre-wrap" +
                        "text-left bg-blue-400 p-5 rounded m-5 bg-gradient-to-r from-blue-400 to-blue-700"
                    }>
                    {message}
                </ReactMarkdown></div>
            )
        } else if (author === "error"){
            return (
                <div className={"flex flex-row " +
                    "place-content-start"
                }>
                    <ReactMarkdown className={
                        "whitespace-pre-wrap" +
                        "text-left bg-red-400 p-5 rounded m-5 bg-gradient-to-r from-red-400 to-red-700"
                    }>
                        {message}
                    </ReactMarkdown></div>
            )
        }
    }
    return (
        <div>
            {parseMessage(props.messageJson)}
        </div>
    )

}