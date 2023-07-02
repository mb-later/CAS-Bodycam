
if CAS.Framework == "qb" then
    QBCore = exports["qb-core"]:GetCoreObject()
else
    ESX = exports["es_extended"]:getSharedObject()
end


GetPlayersFw = function()
    if CAS.Framework == "qb" then
        return QBCore.Functions.GetPlayers()
    else
        return ESX.GetPlayers()
    end
end


GetPlayer = function(player)
    if CAS.Framework == "qb" then
        return QBCore.Functions.GetPlayer(player)
    else
        return ESX.GetPlayerFromId(player)
    end
end


GetJob = function(player)
    if CAS.Framework == "qb" then
        return player.PlayerData.job
    else
        return player.getJob()
    end
end

GetSource = function(player)
    if CAS.Framework == "qb" then
        return player.PlayerData.source
    else
        return player.source
    end
end

GetPlayerRName = function(player)
    local xPlayer = GetPlayer(player)
    if CAS.Framework == "qb" then
        return xPlayer.PlayerData.charinfo.firstname.." "..xPlayer.PlayerData.charinfo.lastname
    else
        return xPlayer.getName()
    end
end

CreateThread(function()
    if CAS.Framework == "qb" then
        QBCore.Functions.CreateUseableItem("bodycam",function(source)
            if source ~= 0 then
                TriggerClientEvent("useBodycam",source)
            end
        end)
    else
        ESX.RegisterUsableItem('bodycam', function(playerId)
            local xPlayer = GetPlayer(playerId)
            xPlayer.showNotification('Bodycam test')
        end)
    end
end)