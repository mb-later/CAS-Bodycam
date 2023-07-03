


CAS = {
    Framework = "esx",
    playerLoaded = "esx:playerLoaded", -- or QBCore:Client:OnPlayerLoaded
    Footer = "You can see the records of bodycam in this page.",
    Header = "LOS SANTOS POLICE DEPARTMENT BODYCAM RECORDS",
    recordDesc = "Police Department Bodycam Record",
    recordName = "Police Bodycam Record",

    Commands = {
        [1] = {
            command = "records",
            action = "recordmenu",
            desc = "Records Menu",
        },
        [2] = {
            command = "bodycam",
            action = "bodycam",
            desc = "Turn On/Off Bodycam"
        },
    }
}
