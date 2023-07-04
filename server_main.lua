Videos = {}

CreateThread(function()
    local file = json.decode(LoadResourceFile(GetCurrentResourceName(), "videopatch.json"))
    if file then
        Videos = file
    end
end)

local function getItem(source)
    local src = source
    if src == 0 then return end
    local player = GetPlayer(src)
    if not player then return end
    if CAS.Framework == "qb" then
        local item = player.Functions.GetItemByName('bodycam')
        if not item then return end
        return true
    else
        local item = player.getInventoryItem("bodycam")
        if not item then return end
        return true
    end
    return false
end


RegisterCommand("records",function(playerId)
    if playerId then
        if not Videos then
            Videos = {}
        end
        local player = GetPlayer(playerId)
        if not player then return end
        local jobCheck = (GetJob(player).name == CAS.allowedJob)
        if not jobCheck then return end
        TriggerClientEvent("cas-bodycam:action",playerId, "records", Videos)
    end
end)


RegisterCommand("bodycam",function(playerId)
    local info = {}
    if playerId then
        local player = GetPlayer(playerId)
        if player then
            local jobCheck = (GetJob(player).name == CAS.allowedJob)
            if not jobCheck then return end
            info = {
                name = GetPlayerRName(playerId),
                grade = GetGrade(player)
            }
            local itemCheck = getItem(playerId)
            if not itemCheck then return end
            TriggerClientEvent("cas-bodycam:action", playerId, "bodycam", info)
        end
    end
end)


RegisterServerEvent("sendFileData")
AddEventHandler("sendFileData", function(videoURL, recordName, videoDesc)
    local src = source
    if src == -1 or src == 0 then return end
    if videoURL ~= nil then
        local newVideo = {
            date = os.date("%Y-%m-%d"),
            hms = os.date("%H:%M:%S"),
            recordName = recordName,
            recordDetails = videoDesc,
            recorder = GetPlayerRName(src),
            videoLink = videoURL
        }
        Videos[recordName] = newVideo
    end
    SaveResourceFile(GetCurrentResourceName(), "/videopatch.json", json.encode(Videos), -1)
end)





-- RegisterServerEvent("getPlayerInfos")
-- AddEventHandler("getPlayerInfos", function()
--     local player = GetPlayer(source)
--     infos = {}
--     if player then
--         infos = {
--             name = GetPlayerRName(source),
--             job = GetJob(player).grade.label
--         }
--         TriggerClientEvent("cas-client:updatePlayerInfos", source, infos)
--     end
-- end)


-- RegisterServerEvent("sendToClient")
-- AddEventHandler("sendToClient", function(_)
--     ToPolices()
-- end)



-- ToPolices = function()
--     local players = GetPlayersFw()
--     for i = 1, #players do
--         local player = GetPlayer(players[i])
--         print(GetJob(player).name)
--         if GetJob(player).name == "police" then
--             TriggerClientEvent("cas-client:updateVideos", GetSource(player), Videos)
--         end
--     end
-- end

