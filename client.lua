Videos = {}
infos = {}

local function startSettings()

end

RegisterNetEvent("cas-client:updatePlayerInfos",function(array)
    infos = array
end)
RegisterNetEvent("cas-client:updateVideos",function(array)
    Videos = array
    print("kanka update video")
end)

RegisterNetEvent("useBodycam",function()
    SendNUIMessage({
        action = "bodycam",
        name = infos.name,
        grade = infos.grade,
        desc = CAS.recordDesc,
        header = CAS.recordName,
        webhook = CAS.webhook
    })
end)

local function fetchInfo()
    TriggerServerEvent("getPlayerInfos")
    TriggerServerEvent("sendToClient")
    CreateThread(function()
        for i,j in pairs(CAS.Commands) do
            print("command")
            RegisterCommand(CAS.Commands[i].command, function(source,args)
                if CAS.Commands[i].action == "bodycam" then
                    SendNUIMessage({
                        action = "bodycam",
                        name = infos.name,
                        grade = infos.grade,
                        desc = CAS.recordDesc,
                        header = CAS.recordName,
                        webhook = CAS.webhook
                    })
                elseif CAS.Commands[i].action == "recordmenu" then
                    SendNUIMessage({
                        action = "records",
                        infos = Videos,
                        header = CAS.Header,
                        footer = CAS.Footer,
                    })
                    print("records")
                    SetNuiFocus(true,true)
                elseif CAS.Commands[i].action == "resume" then
                    SendNUIMessage("resume")
                elseif CAS.Commands[i].action == "pause" then
                    SendNUIMessage("pause")
                end
            end)
        end
    end)
end

RegisterCommand("ld",function()
    TriggerEvent(CAS.playerLoaded)
end)

RegisterNetEvent(CAS.playerLoaded)
AddEventHandler(CAS.playerLoaded,function()
    fetchInfo()
end)






RegisterNUICallback("getVideoURL",function(data,cb)
    TriggerServerEvent("sendFileData", data.videoURL, data.videoName, data.videoDesc)
    cb("ok")
end)


RegisterNUICallback("escapeFromNUI",function(data,cb)
    SetNuiFocus(false,false)
end)

