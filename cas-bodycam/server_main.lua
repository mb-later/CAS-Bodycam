Videos = {}

CreateThread(function()
    local file = json.decode(LoadResourceFile(GetCurrentResourceName(), "videopatch.json"))
    if file then
        Videos = file
    end
end)





RegisterServerEvent("getPlayerInfos")
AddEventHandler("getPlayerInfos", function()
    local player = GetPlayer(source)
    infos = {}
    if player then
        infos = {
            name = GetPlayerRName(source),
            job = GetJob(player).grade_label
        }
        TriggerClientEvent("cas-client:updatePlayerInfos", source, infos)
    end
end)


RegisterServerEvent("sendToClient")
AddEventHandler("sendToClient", function(_)
    ToPolices()
end)
RegisterServerEvent("sendFileData")
AddEventHandler("sendFileData", function(videoURL, recordName)
    local src = source
    if src == -1 or src == 0 then return end
    if videoURL ~= nil then
        local newVideo = {
            date = os.date("%Y-%m-%d"),
            hms = os.date("%H:%M:%S"),
            recordName = recordName,
            recordDetails = "Police Department Video Record.",
            recorder = GetPlayerRName(src),
            videoLink = videoURL
        }
        Videos[recordName] = newVideo
    end
    ToPolices()
    SaveResourceFile(GetCurrentResourceName(), "/videopatch.json", json.encode(Videos), -1)
end)


ToPolices = function()
    local players = GetPlayersFw()
    for i = 1, #players do
        local player = GetPlayer(players[i])
        print(GetJob(player).name)
        if GetJob(player).name == "police" then
            TriggerClientEvent("cas-client:updateVideos", GetSource(player), Videos)
        end
    end
end

