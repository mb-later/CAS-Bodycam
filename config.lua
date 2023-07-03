


CAS = {
    allowedJob = "police",
    webhook = "https://discord.com/api/webhooks/11244384468161ad32216948/1m80acXtfAO2XXgLhax0h8Y3OqpJg6qSHguNWw7lkyWpMtgrf83AiCGx-Hkpelf03eWD",
    Framework = "esx",
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
