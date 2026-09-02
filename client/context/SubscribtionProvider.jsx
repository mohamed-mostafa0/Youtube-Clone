"use client"

import { getSubscribedChannels } from "@/app/api/services/channelServices";
import { useQuery } from "@tanstack/react-query";
import { createContext, useState } from "react";



export const subscriptionContext = createContext()


export function SubscribtionProvider({children}){

    const {data : subscribedChannelsData , isLoading} = useQuery({
        queryKey:["subscribed-channels"],
        queryFn: async()=>{
            const res = await getSubscribedChannels()
            console.log(res);
            
            return res.data.channels
        },
        refetchOnWindowFocus:false,
        staleTime: 1 * 60 * 1000,
        gcTime: 10 * 60 * 1000
    })

    return (
        <subscriptionContext.Provider value={{subscribedChannelsData , isLoading}}>
            {children}
        </subscriptionContext.Provider>
    )
}